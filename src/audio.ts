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
    src: publicAsset('audio/lesson-2/tap-picture-begins-with-s.wav'),
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
    src: publicAsset('audio/lesson-2/tap-picture-begins-with-m.wav'),
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
}

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
