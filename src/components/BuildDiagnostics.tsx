import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  APP_BUILD,
  applyPreparedUpdate,
  checkForPwaUpdate,
  getPwaUpdateState,
  subscribeToPwaUpdateState,
} from '../pwaUpdate'

const dateTime = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'medium',
})

function getStatus(state: ReturnType<typeof getPwaUpdateState>) {
  switch (state.workerStatus) {
    case 'applying': return 'Applying update'
    case 'ready': return 'Update ready'
    case 'downloading': return 'Downloading update'
    case 'installing': return 'Preparing offline files'
    case 'failed': return 'Update failed'
  }
  switch (state.checkStatus) {
    case 'disabled': return 'Update checks unavailable'
    case 'not-checked': return 'Not yet checked'
    case 'checking': return 'Checking for updates'
    case 'unreachable': return 'Offline or server unreachable'
    case 'failed': return 'Update failed'
    case 'confirmed': return state.latestBuild?.id === APP_BUILD.id
      ? 'Up to date'
      : 'Update available'
  }
}

function formatTime(value: number | string | null, fallback: string) {
  return value === null ? fallback : dateTime.format(new Date(value))
}

export function BuildDiagnostics() {
  const [expanded, setExpanded] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLElement>(null)
  const state = useSyncExternalStore(subscribeToPwaUpdateState, getPwaUpdateState)
  const checkingDisabled = state.checkStatus === 'disabled' || state.checkStatus === 'checking' ||
    state.workerStatus === 'downloading' || state.workerStatus === 'installing' ||
    state.workerStatus === 'applying' || state.canApply

  useEffect(() => {
    if (expanded) panel.current?.scrollIntoView({ block: 'nearest' })
  }, [expanded])

  const close = () => {
    setExpanded(false)
    trigger.current?.focus()
  }

  return (
    <footer className="build-diagnostics">
      <button
        ref={trigger}
        type="button"
        className="build-diagnostics__trigger"
        aria-expanded={expanded}
        aria-controls="build-diagnostics-panel"
        onClick={() => setExpanded(!expanded)}
      >
        Build: {APP_BUILD.builtAt.slice(0, 10)} · {APP_BUILD.commit.slice(0, 7)}
      </button>
      <section
        ref={panel}
        id="build-diagnostics-panel"
        className="build-diagnostics__panel"
        aria-label="Build and update diagnostics"
        hidden={!expanded}
      >
        <dl>
          <dt>Running build</dt>
          <dd>{APP_BUILD.id}</dd>
          <dt>Latest available build</dt>
          <dd>{state.latestBuild?.id ?? 'Unknown'}</dd>
          <dt>Running build date and time</dt>
          <dd>{formatTime(APP_BUILD.builtAt, '')}</dd>
          <dt>Last successful check</dt>
          <dd>{formatTime(state.lastSuccessAt, 'None this session')}</dd>
          <dt>Last attempted check</dt>
          <dd>{formatTime(state.lastAttemptAt, 'None this session')}</dd>
        </dl>
        <p className="build-diagnostics__status" role="status">
          {getStatus(state)}
          {state.workerError && <span>{state.workerError}</span>}
          {state.checkError && <span>{state.checkError}</span>}
        </p>
        <div className="build-diagnostics__actions">
          <button type="button" disabled={checkingDisabled} onClick={() => void checkForPwaUpdate('manual')}>
            Check for updates
          </button>
          {state.canApply && (
            <button type="button" onClick={applyPreparedUpdate}>Apply update</button>
          )}
          <button type="button" onClick={close}>Close</button>
        </div>
      </section>
    </footer>
  )
}
