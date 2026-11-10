export interface AudioDefinition {
  id: string
  src: string
}

export type PlaybackResult = 'ended' | 'error' | 'unavailable'

export const audioLibrary: Record<string, AudioDefinition> = {
  'sound-m': { id: 'sound-m', src: '/audio/sounds/m.wav' },
  'sound-s': { id: 'sound-s', src: '/audio/sounds/s.wav' },
  'welcome-instruction': {
    id: 'welcome-instruction',
    src: '/audio/lesson-1/welcome.wav',
  },
  'm-intro-instruction': {
    id: 'm-intro-instruction',
    src: '/audio/lesson-1/m-intro.wav',
  },
  'trace-m-instruction': {
    id: 'trace-m-instruction',
    src: '/audio/lesson-1/trace-m.wav',
  },
  'm-replay-instruction': {
    id: 'm-replay-instruction',
    src: '/audio/lesson-1/m-what-sound.wav',
  },
  'moon-instruction': {
    id: 'moon-instruction',
    src: '/audio/lesson-1/moon-m.wav',
  },
  'mouse-instruction': {
    id: 'mouse-instruction',
    src: '/audio/lesson-1/mouse-m.wav',
  },
  'motorcycle-instruction': {
    id: 'motorcycle-instruction',
    src: '/audio/lesson-1/motorcycle-m.wav',
  },
  'review-sound-instruction': {
    id: 'review-sound-instruction',
    src: '/audio/lesson-1/review-sound.wav',
  },
  's-intro-instruction': {
    id: 's-intro-instruction',
    src: '/audio/lesson-1/s-intro.wav',
  },
  'trace-s-instruction': {
    id: 'trace-s-instruction',
    src: '/audio/lesson-1/trace-s.wav',
  },
  's-replay-instruction': {
    id: 's-replay-instruction',
    src: '/audio/lesson-1/s-what-sound.wav',
  },
  'sun-instruction': {
    id: 'sun-instruction',
    src: '/audio/lesson-1/sun-s.wav',
  },
  'sock-instruction': {
    id: 'sock-instruction',
    src: '/audio/lesson-1/sock-s.wav',
  },
  'find-m-instruction': {
    id: 'find-m-instruction',
    src: '/audio/lesson-1/find-m.wav',
  },
  'find-s-instruction': {
    id: 'find-s-instruction',
    src: '/audio/lesson-1/find-s.wav',
  },
  'review-instruction': {
    id: 'review-instruction',
    src: '/audio/lesson-1/tap-the-sounds.wav',
  },
  'celebration-instruction': {
    id: 'celebration-instruction',
    src: '/audio/lesson-1/great-reading.wav',
  },
}

export const lessonOneAudioIds = [
  'sound-m',
  'sound-s',
  'welcome-instruction',
  'm-intro-instruction',
  'trace-m-instruction',
  'm-replay-instruction',
  'moon-instruction',
  'mouse-instruction',
  'motorcycle-instruction',
  'review-sound-instruction',
  's-intro-instruction',
  'trace-s-instruction',
  's-replay-instruction',
  'sun-instruction',
  'sock-instruction',
  'find-m-instruction',
  'find-s-instruction',
  'review-instruction',
  'celebration-instruction',
]

type SpeakingListener = (speaking: boolean) => void

class AudioService {
  private readonly audioElements = new Map<string, HTMLAudioElement>()
  private activeAudio: HTMLAudioElement | null = null
  private activeListener: SpeakingListener | null = null
  private activeCompletion: ((result: PlaybackResult) => void) | null = null
  private playbackNumber = 0

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
    if (this.activeAudio) {
      this.activeAudio.pause()
      this.activeAudio.currentTime = 0
    }

    this.activeCompletion?.('error')
    this.activeCompletion = null
    this.playbackNumber += 1
    this.activeAudio = null
    this.activeListener?.(false)
    this.activeListener = null
  }

  async play(audioId: string, listener?: SpeakingListener): Promise<PlaybackResult> {
    const definition = audioLibrary[audioId]
    if (!definition) {
      console.error(`[audio] Cannot play unknown audio ID "${audioId}".`)
      return 'unavailable'
    }

    this.stop()
    const playbackNumber = this.playbackNumber
    this.activeListener = listener ?? null
    listener?.(true)

    return this.playFile(audioId, definition.src, playbackNumber)
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
  ): Promise<PlaybackResult> {
    return new Promise((resolve) => {
      let settled = false
      const audio = this.getAudioElement(src)
      audio.currentTime = 0
      this.activeAudio = audio

      const finish = (result: PlaybackResult) => {
        if (settled || playbackNumber !== this.playbackNumber) return
        settled = true
        this.activeCompletion = null
        this.activeAudio = null
        this.activeListener?.(false)
        this.activeListener = null
        resolve(result)
      }

      audio.onended = () => finish('ended')
      audio.onerror = () => {
        console.error(
          `[audio] Failed to load production audio "${audioId}" from "${src}" ` +
            `(networkState: ${audio.networkState}, readyState: ${audio.readyState}).`,
        )
        finish('error')
      }
      this.activeCompletion = finish
      audio.play().catch((error: unknown) => {
        console.error(
          `[audio] Failed to play production audio "${audioId}" from "${src}".`,
          error,
        )
        finish('error')
      })
    })
  }
}

export const audioService = new AudioService()
