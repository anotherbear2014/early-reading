import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { audioService } from '../audio'
import type { BlendDefinition } from '../lessonTypes'

interface BlendScreenProps {
  definition: BlendDefinition
  replayToken: number
  onDemonstrationComplete: () => void
  onSpeakingChange: (speaking: boolean) => void
}

interface WordGeometry {
  boundaries: number[]
}

const wait = (milliseconds: number, onTimer: (timer: number) => void) =>
  new Promise<void>((resolve) => {
    onTimer(window.setTimeout(resolve, milliseconds))
  })

const clamp = (value: number) => Math.max(0, Math.min(1, value))

export function BlendScreen({
  definition,
  replayToken,
  onDemonstrationComplete,
  onSpeakingChange,
}: BlendScreenProps) {
  const inactiveWordRef = useRef<HTMLDivElement>(null)
  const glyphRefs = useRef<Array<HTMLSpanElement | null>>([])
  const [wordGeometry, setWordGeometry] = useState<WordGeometry | null>(null)
  const [revealProgress, setRevealProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [replayButtonToken, setReplayButtonToken] = useState(0)

  useLayoutEffect(() => {
    const measureWord = () => {
      const word = inactiveWordRef.current
      const glyphs = glyphRefs.current.slice(0, definition.segments.length)
      if (!word || glyphs.some((glyph) => !glyph)) return

      const wordBounds = word.getBoundingClientRect()
      if (wordBounds.width === 0) return

      const starts = glyphs.map((glyph) => {
        const glyphBounds = glyph!.getBoundingClientRect()
        return clamp((glyphBounds.left - wordBounds.left) / wordBounds.width)
      })
      const lastGlyphBounds = glyphs[glyphs.length - 1]!.getBoundingClientRect()
      const wordEnd = clamp(
        (lastGlyphBounds.right - wordBounds.left) / wordBounds.width,
      )

      setWordGeometry({ boundaries: [...starts, wordEnd] })
    }

    measureWord()
    window.addEventListener('resize', measureWord)
    return () => window.removeEventListener('resize', measureWord)
  }, [definition])

  useEffect(() => {
    if (!wordGeometry) return

    let active = true
    let animationFrame = 0
    let pauseTimer = 0

    const revealAtTime = (elapsed: number) => {
      const { boundaries } = wordGeometry

      for (let index = definition.segments.length - 1; index >= 0; index -= 1) {
        const segment = definition.segments[index]
        if (elapsed < segment.startSeconds) continue

        const segmentProgress = clamp(
          (elapsed - segment.startSeconds) / segment.fadeDurationSeconds,
        )
        return (
          boundaries[index] +
          (boundaries[index + 1] - boundaries[index]) * segmentProgress
        )
      }

      return 0
    }

    const updateReveal = () => {
      setRevealProgress(revealAtTime(audioService.currentTimeSeconds))
      animationFrame = window.requestAnimationFrame(updateReveal)
    }

    const demonstrate = async () => {
      setIsComplete(false)
      setRevealProgress(0)
      onSpeakingChange(true)

      const blendPlayback = audioService.play(definition.blendAudioId)
      animationFrame = window.requestAnimationFrame(updateReveal)
      await blendPlayback
      window.cancelAnimationFrame(animationFrame)
      if (!active) return

      setRevealProgress(1)
      await wait(definition.pauseAfterBlendMs, (timer) => {
        pauseTimer = timer
      })
      if (!active) return

      await audioService.play(definition.wordAudioId)
      if (!active) return

      setIsComplete(true)
      onSpeakingChange(false)
      onDemonstrationComplete()
    }

    void demonstrate()

    return () => {
      active = false
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(pauseTimer)
      audioService.stop()
      onSpeakingChange(false)
    }
  }, [
    definition,
    onDemonstrationComplete,
    onSpeakingChange,
    replayButtonToken,
    replayToken,
    wordGeometry,
  ])

  const playWord = () => {
    if (isComplete) void audioService.play(definition.wordAudioId)
  }

  return (
    <div className="blend-screen">
      <div className="blend-sequence">
        <div
          className={`blend-word${isComplete ? ' is-complete' : ''}`}
          onClick={playWord}
        >
          <button
            className="blend-word-replay-accessible"
            type="button"
            disabled={!isComplete}
            aria-label={`Play the word ${definition.word}`}
            onClick={(event) => {
              event.stopPropagation()
              playWord()
            }}
          >
            {definition.word}
          </button>

          <div className="blend-word-visual">
            <div
              className="blend-word-layer blend-word-layer--inactive"
              ref={inactiveWordRef}
              aria-hidden="true"
            >
              {definition.segments.map((segment, index) => (
                <span
                  className={`blend-glyph blend-glyph--${segment.soundId}`}
                  ref={(element) => {
                    glyphRefs.current[index] = element
                  }}
                  key={`${segment.soundId}-${index}`}
                >
                  {segment.soundId}
                </span>
              ))}
            </div>

            <div
              className="blend-word-layer blend-word-layer--active"
              style={{ clipPath: `inset(0 ${100 - revealProgress * 100}% 0 0)` }}
              aria-hidden="true"
            >
              {definition.segments.map((segment, index) => (
                <span
                  className={`blend-glyph blend-glyph--${segment.soundId}`}
                  key={`${segment.soundId}-${index}`}
                >
                  {segment.soundId}
                </span>
              ))}
            </div>

            <div className="blend-letter-hit-regions">
              {wordGeometry &&
                definition.segments.map((segment, index) => (
                  <button
                    className="blend-letter-hit-region"
                    type="button"
                    disabled={!isComplete}
                    aria-label={`Play the ${segment.soundId} sound`}
                    style={{
                      left: `${wordGeometry.boundaries[index] * 100}%`,
                      width: `${
                        (wordGeometry.boundaries[index + 1] -
                          wordGeometry.boundaries[index]) *
                        100
                      }%`,
                    }}
                    onClick={(event) => {
                      event.stopPropagation()
                      void audioService.play(`sound-${segment.soundId}`)
                    }}
                    key={`${segment.soundId}-${index}`}
                  />
                ))}
            </div>
          </div>
        </div>

        <button
          className="blend-replay-control"
          type="button"
          aria-label={`Replay the ${definition.word} blend`}
          onClick={() => setReplayButtonToken((token) => token + 1)}
        >
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M38 16V7l-5 5a17 17 0 1 0 5 21l-6-3a10 10 0 1 1-2-13l-6 6h14Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
