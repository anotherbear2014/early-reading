export interface AudioDefinition {
  id: string
  src: string
}

export type PlaybackResult = 'ended' | 'error' | 'unavailable'

const publicAsset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

export const audioLibrary: Record<string, AudioDefinition> = {
  'sound-m': { id: 'sound-m', src: publicAsset('audio/sounds/m.wav') },
  'sound-s': { id: 'sound-s', src: publicAsset('audio/sounds/s.wav') },
  'sound-a': { id: 'sound-a', src: publicAsset('audio/sounds/a.wav') },
  'sound-t': { id: 'sound-t', src: publicAsset('audio/sounds/t.wav') },
  'sound-r': { id: 'sound-r', src: publicAsset('audio/sounds/r.wav') },
  'sound-i': { id: 'sound-i', src: publicAsset('audio/sounds/i.wav') },
  'sound-n': { id: 'sound-n', src: publicAsset('audio/sounds/n.wav') },
  'sound-p': { id: 'sound-p', src: publicAsset('audio/sounds/p.wav') },
  'sound-f': { id: 'sound-f', src: publicAsset('audio/sounds/f.wav') },
  'welcome-instruction': {
    id: 'welcome-instruction',
    src: publicAsset('audio/lesson-1/welcome.wav'),
  },
  'm-intro-instruction': {
    id: 'm-intro-instruction',
    src: publicAsset('audio/lesson-1/m-intro.wav'),
  },
  'trace-m-instruction': {
    id: 'trace-m-instruction',
    src: publicAsset('audio/lesson-1/trace-m.wav'),
  },
  'm-replay-instruction': {
    id: 'm-replay-instruction',
    src: publicAsset('audio/lesson-1/m-what-sound.wav'),
  },
  'moon-instruction': {
    id: 'moon-instruction',
    src: publicAsset('audio/lesson-1/moon-m.wav'),
  },
  'mouse-instruction': {
    id: 'mouse-instruction',
    src: publicAsset('audio/lesson-1/mouse-m.wav'),
  },
  'motorcycle-instruction': {
    id: 'motorcycle-instruction',
    src: publicAsset('audio/lesson-1/motorcycle-m.wav'),
  },
  'review-sound-instruction': {
    id: 'review-sound-instruction',
    src: publicAsset('audio/lesson-1/review-sound.wav'),
  },
  's-intro-instruction': {
    id: 's-intro-instruction',
    src: publicAsset('audio/lesson-1/s-intro.wav'),
  },
  'trace-s-instruction': {
    id: 'trace-s-instruction',
    src: publicAsset('audio/lesson-1/trace-s.wav'),
  },
  's-replay-instruction': {
    id: 's-replay-instruction',
    src: publicAsset('audio/lesson-1/s-what-sound.wav'),
  },
  'sun-instruction': {
    id: 'sun-instruction',
    src: publicAsset('audio/lesson-1/sun-s.wav'),
  },
  'sock-instruction': {
    id: 'sock-instruction',
    src: publicAsset('audio/lesson-1/sock-s.wav'),
  },
  'tap-m-instruction': {
    id: 'tap-m-instruction',
    src: publicAsset('audio/prompts/tap-m.wav'),
  },
  'tap-s-instruction': {
    id: 'tap-s-instruction',
    src: publicAsset('audio/prompts/tap-s.wav'),
  },
  'tap-a-instruction': {
    id: 'tap-a-instruction',
    src: publicAsset('audio/prompts/tap-a.wav'),
  },
  'review-instruction': {
    id: 'review-instruction',
    src: publicAsset('audio/lesson-1/tap-the-sounds.wav'),
  },
  'celebration-instruction': {
    id: 'celebration-instruction',
    src: publicAsset('audio/lesson-1/great-reading.wav'),
  },
  'lesson-2-welcome-instruction': {
    id: 'lesson-2-welcome-instruction',
    src: publicAsset('audio/lesson-2/welcome.wav'),
  },
  'a-intro-instruction': {
    id: 'a-intro-instruction',
    src: publicAsset('audio/lesson-2/a-intro.wav'),
  },
  'a-replay-instruction': {
    id: 'a-replay-instruction',
    src: publicAsset('audio/lesson-2/a-what-sound.wav'),
  },
  'apple-instruction': {
    id: 'apple-instruction',
    src: publicAsset('audio/lesson-2/apple-a.wav'),
  },
  'ant-instruction': {
    id: 'ant-instruction',
    src: publicAsset('audio/lesson-2/ant-a.wav'),
  },
  'antelope-instruction': {
    id: 'antelope-instruction',
    src: publicAsset('audio/lesson-2/antelope-a.wav'),
  },
  'alligator-instruction': {
    id: 'alligator-instruction',
    src: publicAsset('audio/lesson-2/alligator-a.wav'),
  },
  'tap-picture-s-instruction': {
    id: 'tap-picture-s-instruction',
    src: publicAsset('audio/prompts/tap-picture-begins-with-s.wav'),
  },
  'sun-correct-response': {
    id: 'sun-correct-response',
    src: publicAsset('audio/lesson-2/yes-thats-the-sun-good-job.wav'),
  },
  'basketball-response': {
    id: 'basketball-response',
    src: publicAsset('audio/lesson-2/basketball.wav'),
  },
  'turtle-response': {
    id: 'turtle-response',
    src: publicAsset('audio/lesson-2/turtle.wav'),
  },
  'tap-picture-m-instruction': {
    id: 'tap-picture-m-instruction',
    src: publicAsset('audio/prompts/tap-picture-begins-with-m.wav'),
  },
  'mouse-correct-response': {
    id: 'mouse-correct-response',
    src: publicAsset('audio/lesson-2/yes-thats-a-mouse-good-job.wav'),
  },
  'rabbit-response': {
    id: 'rabbit-response',
    src: publicAsset('audio/lesson-2/rabbit.wav'),
  },
  'duck-response': {
    id: 'duck-response',
    src: publicAsset('audio/lesson-2/duck.wav'),
  },
  'lesson-3-welcome-instruction': {
    id: 'lesson-3-welcome-instruction',
    src: publicAsset('audio/lesson-3/welcome.wav'),
  },
  't-intro-instruction': {
    id: 't-intro-instruction',
    src: publicAsset('audio/lesson-3/t-intro.wav'),
  },
  'r-intro-instruction': {
    id: 'r-intro-instruction',
    src: publicAsset('audio/lesson-3/r-intro.wav'),
  },
  'what-sound-instruction': {
    id: 'what-sound-instruction',
    src: publicAsset('audio/lesson-2/a-what-sound.wav'),
  },
  'taco-instruction': {
    id: 'taco-instruction',
    src: publicAsset('audio/lesson-3/taco-t.wav'),
  },
  'turtle-t-instruction': {
    id: 'turtle-t-instruction',
    src: publicAsset('audio/lesson-3/turtle-t.wav'),
  },
  'rabbit-r-instruction': {
    id: 'rabbit-r-instruction',
    src: publicAsset('audio/lesson-3/rabbit-r.wav'),
  },
  'rocket-instruction': {
    id: 'rocket-instruction',
    src: publicAsset('audio/lesson-3/rocket-r.wav'),
  },
  'trace-t-instruction': {
    id: 'trace-t-instruction',
    src: publicAsset('audio/lesson-3/trace-t.wav'),
  },
  'trace-r-instruction': {
    id: 'trace-r-instruction',
    src: publicAsset('audio/lesson-3/trace-r.wav'),
  },
  'table-instruction': {
    id: 'table-instruction',
    src: publicAsset('audio/lesson-3/table-t.wav'),
  },
  'rock-instruction': {
    id: 'rock-instruction',
    src: publicAsset('audio/lesson-3/rock-r.wav'),
  },
  'tap-t-instruction': {
    id: 'tap-t-instruction',
    src: publicAsset('audio/prompts/tap-t.wav'),
  },
  'tap-r-instruction': {
    id: 'tap-r-instruction',
    src: publicAsset('audio/prompts/tap-r.wav'),
  },
  'lesson-4-welcome-instruction': {
    id: 'lesson-4-welcome-instruction',
    src: publicAsset('audio/lesson-4/welcome.wav'),
  },
  'at-blend': {
    id: 'at-blend',
    src: publicAsset('audio/lesson-4/at-blend.wav'),
  },
  'at-word': {
    id: 'at-word',
    src: publicAsset('audio/lesson-4/at-word.wav'),
  },
  'mat-blend': {
    id: 'mat-blend',
    src: publicAsset('audio/lesson-4/mat-blend.wav'),
  },
  'mat-word': {
    id: 'mat-word',
    src: publicAsset('audio/lesson-4/mat-word.wav'),
  },
  'sat-blend': {
    id: 'sat-blend',
    src: publicAsset('audio/lesson-4/sat-blend.wav'),
  },
  'sat-word': {
    id: 'sat-word',
    src: publicAsset('audio/lesson-4/sat-word.wav'),
  },
  'rat-blend': {
    id: 'rat-blend',
    src: publicAsset('audio/lesson-4/rat-blend.wav'),
  },
  'rat-word': {
    id: 'rat-word',
    src: publicAsset('audio/lesson-4/rat-word.wav'),
  },
  'move-the-dot-instruction': {
    id: 'move-the-dot-instruction',
    src: publicAsset('audio/lesson-4/move-the-dot.wav'),
  },
  'your-turn-say-word-instruction': {
    id: 'your-turn-say-word-instruction',
    src: publicAsset('audio/lesson-4/your-turn-say-word.wav'),
  },
  'lesson-5-welcome-instruction': {
    id: 'lesson-5-welcome-instruction',
    src: publicAsset('audio/lesson-5/welcome.wav'),
  },
  'lesson-5-review-instruction': {
    id: 'lesson-5-review-instruction',
    src: publicAsset('audio/lesson-5/tap-the-sounds.wav'),
  },
  'i-intro-instruction': {
    id: 'i-intro-instruction',
    src: publicAsset('audio/lesson-5/i-intro.wav'),
  },
  'n-intro-instruction': {
    id: 'n-intro-instruction',
    src: publicAsset('audio/lesson-5/n-intro.wav'),
  },
  'lesson-5-what-sound-instruction': {
    id: 'lesson-5-what-sound-instruction',
    src: publicAsset('audio/lesson-5/what-sound.wav'),
  },
  'igloo-i-instruction': {
    id: 'igloo-i-instruction',
    src: publicAsset('audio/lesson-5/igloo-i.wav'),
  },
  'iguana-i-instruction': {
    id: 'iguana-i-instruction',
    src: publicAsset('audio/lesson-5/iguana-i.wav'),
  },
  'italy-i-instruction': {
    id: 'italy-i-instruction',
    src: publicAsset('audio/lesson-5/italy-i.wav'),
  },
  'inchworm-i-instruction': {
    id: 'inchworm-i-instruction',
    src: publicAsset('audio/lesson-5/inchworm-i.wav'),
  },
  'nose-n-instruction': {
    id: 'nose-n-instruction',
    src: publicAsset('audio/lesson-5/nose-n.wav'),
  },
  'nest-n-instruction': {
    id: 'nest-n-instruction',
    src: publicAsset('audio/lesson-5/nest-n.wav'),
  },
  'necklace-n-instruction': {
    id: 'necklace-n-instruction',
    src: publicAsset('audio/lesson-5/necklace-n.wav'),
  },
  'no-n-instruction': {
    id: 'no-n-instruction',
    src: publicAsset('audio/lesson-5/no-n.wav'),
  },
  'trace-i-instruction': {
    id: 'trace-i-instruction',
    src: publicAsset('audio/lesson-5/trace-i.wav'),
  },
  'trace-n-instruction': {
    id: 'trace-n-instruction',
    src: publicAsset('audio/lesson-5/trace-n.wav'),
  },
  'tap-i-instruction': {
    id: 'tap-i-instruction',
    src: publicAsset('audio/prompts/tap-i.wav'),
  },
  'tap-n-instruction': {
    id: 'tap-n-instruction',
    src: publicAsset('audio/prompts/tap-n.wav'),
  },
  'tap-picture-i-instruction': {
    id: 'tap-picture-i-instruction',
    src: publicAsset('audio/prompts/tap-picture-begins-with-i.wav'),
  },
  'tap-picture-n-instruction': {
    id: 'tap-picture-n-instruction',
    src: publicAsset('audio/prompts/tap-picture-begins-with-n.wav'),
  },
  'igloo-correct-response': {
    id: 'igloo-correct-response',
    src: publicAsset('audio/lesson-5/yes-thats-the-igloo-good-job.wav'),
  },
  'nose-correct-response': {
    id: 'nose-correct-response',
    src: publicAsset('audio/lesson-5/yes-thats-the-nose-good-job.wav'),
  },
  'lesson-5-celebration-instruction': {
    id: 'lesson-5-celebration-instruction',
    src: publicAsset('audio/lesson-5/great-reading.wav'),
  },
  'lesson-6-welcome-instruction': {
    id: 'lesson-6-welcome-instruction',
    src: publicAsset('audio/lesson-6/welcome.wav'),
  },
  'lesson-6-review-instruction': {
    id: 'lesson-6-review-instruction',
    src: publicAsset('audio/lesson-6/tap-the-sounds.wav'),
  },
  'lesson-6-what-sound-instruction': {
    id: 'lesson-6-what-sound-instruction',
    src: publicAsset('audio/lesson-6/what-sound.wav'),
  },
  'p-intro-instruction': {
    id: 'p-intro-instruction',
    src: publicAsset('audio/lesson-6/p-intro.wav'),
  },
  'f-intro-instruction': {
    id: 'f-intro-instruction',
    src: publicAsset('audio/lesson-6/f-intro.wav'),
  },
  'pig-p-instruction': {
    id: 'pig-p-instruction',
    src: publicAsset('audio/lesson-6/pig-p.wav'),
  },
  'penguin-p-instruction': {
    id: 'penguin-p-instruction',
    src: publicAsset('audio/lesson-6/penguin-p.wav'),
  },
  'pencil-p-instruction': {
    id: 'pencil-p-instruction',
    src: publicAsset('audio/lesson-6/pencil-p.wav'),
  },
  'fish-f-instruction': {
    id: 'fish-f-instruction',
    src: publicAsset('audio/lesson-6/fish-f.wav'),
  },
  'flower-f-instruction': {
    id: 'flower-f-instruction',
    src: publicAsset('audio/lesson-6/flower-f.wav'),
  },
  'trace-p-instruction': {
    id: 'trace-p-instruction',
    src: publicAsset('audio/lesson-6/trace-p.wav'),
  },
  'trace-f-instruction': {
    id: 'trace-f-instruction',
    src: publicAsset('audio/lesson-6/trace-f.wav'),
  },
  'tap-p-instruction': {
    id: 'tap-p-instruction',
    src: publicAsset('audio/lesson-6/tap-p.wav'),
  },
  'tap-f-instruction': {
    id: 'tap-f-instruction',
    src: publicAsset('audio/lesson-6/tap-f.wav'),
  },
  'tap-picture-p-instruction': {
    id: 'tap-picture-p-instruction',
    src: publicAsset('audio/lesson-6/tap-picture-p.wav'),
  },
  'tap-picture-f-instruction': {
    id: 'tap-picture-f-instruction',
    src: publicAsset('audio/lesson-6/tap-picture-f.wav'),
  },
  'pig-correct-response': {
    id: 'pig-correct-response',
    src: publicAsset('audio/lesson-6/yes-thats-the-pig-good-job.wav'),
  },
  'fish-correct-response': {
    id: 'fish-correct-response',
    src: publicAsset('audio/lesson-6/yes-thats-the-fish-good-job.wav'),
  },
  'sun-name-response': {
    id: 'sun-name-response',
    src: publicAsset('audio/lesson-6/sun.wav'),
  },
  'nest-name-response': {
    id: 'nest-name-response',
    src: publicAsset('audio/lesson-6/nest.wav'),
  },
  'lesson-6-celebration-instruction': {
    id: 'lesson-6-celebration-instruction',
    src: publicAsset('audio/lesson-6/great-reading.wav'),
  },
}

type SpeakingListener = (speaking: boolean) => void

interface PlaybackOptions {
  stallTimeoutMs?: number
}

class AudioService {
  private readonly audioElements = new Map<string, HTMLAudioElement>()
  private activeAudio: HTMLAudioElement | null = null
  private activeListener: SpeakingListener | null = null
  private activeCompletion: ((result: PlaybackResult) => void) | null = null
  private playbackNumber = 0

  get currentTimeSeconds() {
    return this.activeAudio?.currentTime ?? 0
  }

  // Interactive screens own pause/resume and release this element on unmount.
  getPlaybackElement(audioId: string) {
    const definition = audioLibrary[audioId]
    return definition ? this.getAudioElement(definition.src) : null
  }

  preload(audioIds: string[]) {
    for (const audioId of audioIds) {
      const definition = audioLibrary[audioId]
      if (!definition) {
        console.error(`[audio] Cannot preload unknown audio ID "${audioId}".`)
        continue
      }

      const audio = this.getAudioElement(definition.src)
      audio.preload = 'auto'
      audio.load()
    }
  }

  stop() {
    const audio = this.activeAudio
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }

    this.activeCompletion?.('error')
    this.activeCompletion = null
    this.playbackNumber += 1
    this.activeAudio = null
    this.activeListener?.(false)
    this.activeListener = null
  }

  async play(
    audioId: string,
    listener?: SpeakingListener,
    options?: PlaybackOptions,
  ): Promise<PlaybackResult> {
    const definition = audioLibrary[audioId]
    if (!definition) {
      console.error(`[audio] Cannot play unknown audio ID "${audioId}".`)
      return 'unavailable'
    }

    this.stop()
    const playbackNumber = this.playbackNumber
    this.activeListener = listener ?? null
    listener?.(true)

    return this.playFile(audioId, definition.src, playbackNumber, options?.stallTimeoutMs)
  }

  private getAudioElement(src: string) {
    const existing = this.audioElements.get(src)
    if (existing) return existing

    const audio = new Audio(src)
    audio.preload = 'auto'
    this.audioElements.set(src, audio)
    return audio
  }

  private playFile(
    audioId: string,
    src: string,
    playbackNumber: number,
    stallTimeoutMs?: number,
  ): Promise<PlaybackResult> {
    return new Promise((resolve) => {
      let settled = false
      let stallTimer: ReturnType<typeof setTimeout> | undefined
      const audio = this.getAudioElement(src)
      audio.currentTime = 0
      this.activeAudio = audio
      let lastTime = audio.currentTime

      const finish = (result: PlaybackResult) => {
        if (settled || playbackNumber !== this.playbackNumber) return
        settled = true
        audio.onended = null
        audio.onerror = null
        if (stallTimeoutMs !== undefined) {
          clearTimeout(stallTimer)
          audio.removeEventListener('timeupdate', noteProgress)
          audio.removeEventListener('pause', handlePause)
          if (result !== 'ended' && !audio.paused) audio.pause()
        }
        this.activeCompletion = null
        this.activeAudio = null
        this.activeListener?.(false)
        this.activeListener = null
        resolve(result)
      }

      // The cached element can still have events queued from a previous run.
      const handlePause = () => {
        if (audio.paused) finish(audio.ended ? 'ended' : 'error')
      }
      const armStallTimer = () => {
        clearTimeout(stallTimer)
        stallTimer = setTimeout(() => {
          finish(audio.ended ? 'ended' : 'error')
        }, stallTimeoutMs)
      }
      const noteProgress = () => {
        if (audio.currentTime <= lastTime) return
        lastTime = audio.currentTime
        armStallTimer()
      }

      audio.onended = () => {
        if (stallTimeoutMs === undefined || audio.ended) finish('ended')
      }
      audio.onerror = () => {
        if (stallTimeoutMs !== undefined && !audio.error) return
        console.error(
          `[audio] Failed to load production audio "${audioId}" from "${src}" ` +
            `(networkState: ${audio.networkState}, readyState: ${audio.readyState}).`,
        )
        finish('error')
      }
      this.activeCompletion = finish
      if (stallTimeoutMs !== undefined) {
        audio.addEventListener('timeupdate', noteProgress)
        audio.addEventListener('pause', handlePause)
        armStallTimer()
      }
      const handlePlayError = (error: unknown) => {
        if (settled || playbackNumber !== this.playbackNumber) return
        console.error(
          `[audio] Failed to play production audio "${audioId}" from "${src}".`,
          error,
        )
        finish('error')
      }
      try {
        void audio.play().catch(handlePlayError)
      } catch (error) {
        handlePlayError(error)
      }
    })
  }
}

export const audioService = new AudioService()
