export interface BuildInfo {
  id: string
  commit: string
  builtAt: string
}

export const APP_BUILD = __APP_BUILD__
export const APP_BUILD_ID = APP_BUILD.id

type CheckStatus = 'disabled' | 'not-checked' | 'checking' | 'confirmed' | 'unreachable' | 'failed'
type WorkerStatus = 'idle' | 'installing' | 'downloading' | 'ready' | 'applying' | 'failed'
type CheckReason = 'initial-launch' | 'foreground' | 'online' | 'lesson-selection' | 'manual'

interface PwaUpdateState {
  latestBuild: BuildInfo | null
  checkStatus: CheckStatus
  workerStatus: WorkerStatus
  lastAttemptAt: number | null
  lastSuccessAt: number | null
  checkError: string | null
  workerError: string | null
  canApply: boolean
}

const CHECK_THROTTLE_MS = 60_000
const METADATA_TIMEOUT_MS = 8_000
const ACTIVATION_TIMEOUT_MS = 15_000
const LEGACY_CACHE_NAMES = ['reading-audio', 'reading-images']
const listeners = new Set<() => void>()
const observedWorkers = new WeakSet<ServiceWorker>()

let state: PwaUpdateState = {
  latestBuild: null,
  checkStatus: 'not-checked',
  workerStatus: 'idle',
  lastAttemptAt: null,
  lastSuccessAt: null,
  checkError: null,
  workerError: null,
  canApply: false,
}
let registration: ServiceWorkerRegistration | undefined
let checkInProgress: Promise<void> | undefined
let lessonSelectionVisible = false
let activating: ServiceWorker | undefined
let activationTimer: number | undefined
let reloadPending = false
let reloadStarted = false

function setState(update: Partial<PwaUpdateState>) {
  state = { ...state, ...update }
  for (const listener of listeners) listener()
}

export function getPwaUpdateState() {
  return state
}

export function subscribeToPwaUpdateState(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

async function fetchLatestBuild(): Promise<BuildInfo> {
  const url = new URL(`${import.meta.env.BASE_URL}build-info.json`, window.location.origin)
  // The URL is outside Workbox's precache and navigation fallback. A fresh
  // query also avoids reusing a cached response at an intermediary.
  url.searchParams.set('check', String(Date.now()))
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), METADATA_TIMEOUT_MS)
  try {
    const response = await fetch(url, { cache: 'no-store', signal: controller.signal })
    if (!response.ok) throw new Error(`The deployment server returned HTTP ${response.status}.`)

    const build = await response.json() as Partial<BuildInfo> | null
    if (!build || typeof build.id !== 'string' || !build.id ||
        typeof build.commit !== 'string' || !build.commit ||
        typeof build.builtAt !== 'string' || !Number.isFinite(Date.parse(build.builtAt))) {
      throw new Error('The deployment metadata is invalid.')
    }
    return { id: build.id, commit: build.commit, builtAt: build.builtAt }
  } finally {
    window.clearTimeout(timeout)
  }
}

function finishActivation() {
  window.clearTimeout(activationTimer)
  activating = undefined
}

function activationFailed(message: string) {
  finishActivation()
  setState({
    workerStatus: 'failed',
    workerError: message,
    canApply: Boolean(registration?.waiting),
  })
}

function reloadWithNewWorker() {
  if (reloadStarted) return
  finishActivation()
  reloadPending = true
  setState({ workerStatus: 'applying', canApply: false })
  if (!lessonSelectionVisible) return

  const guardKey = 'early-reading:pwa-reloaded-from'
  try {
    if (sessionStorage.getItem(guardKey) === APP_BUILD_ID) {
      reloadPending = false
      activationFailed('The app already reloaded from this build.')
      return
    }
    sessionStorage.setItem(guardKey, APP_BUILD_ID)
  } catch {
    // The in-memory guard still handles duplicate lifecycle events.
  }
  reloadStarted = true
  window.location.reload()
}

export function applyPreparedUpdate() {
  const worker = registration?.waiting
  if (!lessonSelectionVisible || !worker || activating || reloadPending) return

  activating = worker
  setState({ workerStatus: 'applying', workerError: null, canApply: false })
  activationTimer = window.setTimeout(() => {
    activationFailed('The update did not finish applying in time.')
  }, ACTIVATION_TIMEOUT_MS)
  try {
    // Workbox precaches the build during install and handles this message only
    // after the replacement worker reaches the waiting stage.
    worker.postMessage({ type: 'SKIP_WAITING' })
  } catch {
    activationFailed('The prepared update could not be activated.')
  }
}

function observeWorker(worker: ServiceWorker, isUpdate: boolean) {
  if (observedWorkers.has(worker)) return
  observedWorkers.add(worker)
  const onStateChange = () => {
    switch (worker.state) {
      case 'installing':
        setState({ workerStatus: isUpdate ? 'downloading' : 'installing', workerError: null })
        break
      case 'installed':
        if (isUpdate && registration?.waiting === worker) {
          setState({ workerStatus: 'ready', workerError: null, canApply: true })
          applyPreparedUpdate()
        }
        break
      case 'activated':
        if (isUpdate) {
          reloadWithNewWorker()
        } else {
          setState({ workerStatus: 'idle' })
        }
        break
      case 'redundant':
        if (registration?.active !== worker && !reloadPending) {
          activationFailed(isUpdate
            ? 'The replacement build could not be prepared or applied.'
            : 'The app could not prepare its offline files.')
        }
        break
    }
  }
  worker.addEventListener('statechange', onStateChange)
  onStateChange()
}

async function checkServiceWorker() {
  if (!registration) {
    registration = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
      scope: import.meta.env.BASE_URL,
      updateViaCache: 'none',
    })
    registration.addEventListener('updatefound', () => {
      const worker = registration?.installing
      if (worker) observeWorker(worker, Boolean(registration?.active))
    })
    if (registration.waiting) observeWorker(registration.waiting, Boolean(registration.active))
    if (registration.installing) observeWorker(registration.installing, Boolean(registration.active))
  }
  if (!registration.installing && !registration.waiting && !activating && !reloadPending) {
    await registration.update()
  }
}

export function checkForPwaUpdate(reason: CheckReason) {
  if (checkInProgress) return checkInProgress
  if (state.checkStatus === 'disabled' || activating || reloadPending) return
  if (state.canApply) {
    applyPreparedUpdate()
    return
  }
  if (registration?.installing) return

  const now = Date.now()
  const bypassThrottle = reason === 'manual' || reason === 'online' || reason === 'initial-launch'
  if (!bypassThrottle && state.lastAttemptAt !== null &&
      now - state.lastAttemptAt < CHECK_THROTTLE_MS) return

  checkInProgress = Promise.resolve().then(async () => {
    const [metadata, worker] = await Promise.allSettled([
      fetchLatestBuild().then((build) => setState({ latestBuild: build })),
      checkServiceWorker(),
    ])
    if (metadata.status === 'rejected') {
      const error: unknown = metadata.reason
      const unreachable = error instanceof TypeError ||
        (error instanceof DOMException && error.name === 'AbortError')
      setState({
        checkStatus: unreachable ? 'unreachable' : 'failed',
        checkError: unreachable ? null :
          error instanceof Error ? error.message : 'The deployment check failed.',
      })
    } else if (worker.status === 'rejected') {
      setState({ checkStatus: 'failed', checkError: 'The service worker check failed.' })
    } else {
      setState({ checkStatus: 'confirmed', lastSuccessAt: Date.now() })
    }
  }).finally(() => { checkInProgress = undefined })

  setState({
    checkStatus: 'checking',
    lastAttemptAt: now,
    checkError: null,
    ...(state.workerStatus === 'failed' ? { workerStatus: 'idle', workerError: null } : {}),
  })
  return checkInProgress
}

export function setLessonSelectionVisible(visible: boolean) {
  if (lessonSelectionVisible === visible) return
  lessonSelectionVisible = visible
  if (!visible) return

  if (reloadPending) reloadWithNewWorker()
  else if (state.canApply) applyPreparedUpdate()
  else void checkForPwaUpdate('lesson-selection')
}

export function beginLesson() {
  if (lessonSelectionVisible && (activating || reloadPending)) return false
  lessonSelectionVisible = false
  return true
}

export function initializePwaUpdates() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
    setState({ checkStatus: 'disabled' })
    return
  }

  let previousController = navigator.serviceWorker.controller
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    const worker = navigator.serviceWorker.controller
    const isReplacement = previousController && worker && previousController !== worker
    previousController = worker
    if (isReplacement && worker.scriptURL === new URL(`${import.meta.env.BASE_URL}sw.js`, location.href).href) {
      observeWorker(worker, true)
    }
  })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void checkForPwaUpdate('foreground')
  })
  window.addEventListener('online', () => { void checkForPwaUpdate('online') })
  void checkForPwaUpdate('initial-launch')

  if ('caches' in window) {
    void Promise.all(LEGACY_CACHE_NAMES.map((name) => caches.delete(name))).catch((error: unknown) => {
      console.warn('[pwa] Could not remove legacy runtime caches.', error)
    })
  }
}
