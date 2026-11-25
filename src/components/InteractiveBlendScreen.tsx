import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { audioService } from '../audio'
import type { BlendDefinition } from '../lessonTypes'

// Distances are fractions of the measured word width.
const dragTuning = {
  startTolerance: 0.025,
  endTolerance: 0.025,
  maxAudioLead: 0.06,
  pauseGraceMs: 180,
}

const clamp = (value: number) => Math.max(0, Math.min(1, value))

interface InteractiveBlendProps {
  definition: BlendDefinition
  instructionAudioId: string
  instructionReplayToken: number
  onSpeakingChange: (speaking: boolean) => void
}

interface DragPlayback {
  begin: () => void
  advance: (position: number) => void
  release: () => void
  cancel: () => void
  reset: () => void
  playInstruction: () => void
}

export function InteractiveBlendScreen({
  definition,
  instructionAudioId,
  instructionReplayToken,
  onSpeakingChange,
}: InteractiveBlendProps) {
  const wordRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const playback = useRef<DragPlayback | null>(null)
  const drag = useRef<{ id: number; offset: number } | null>(null)
  const [progress, setProgress] = useState(0)

  const clearDrag = useCallback(() => {
    const pointer = drag.current
    drag.current = null
    const handle = handleRef.current
    if (pointer && handle?.hasPointerCapture(pointer.id)) {
      handle.releasePointerCapture(pointer.id)
    }
  }, [])

  useEffect(() => {
    const audio = audioService.getPlaybackElement(definition.blendAudioId)
    const word = wordRef.current
    if (!audio || !word) return

    const segments = definition.segments
    const start = segments[0].startSeconds
    const end = segments[segments.length - 1].endSeconds
    let glyphBoundaries: number[] = []
    let revealed = 0
    let target = 0
    let held = false
    let lastAdvance = 0
    let releasedAt = 0
    let frame = 0
    let wordTimer = 0
    let running = false
    let complete = false
    let playAttempt = 0
    let needsReleaseGesture = false

    const measure = () => {
      const bounds = word.getBoundingClientRect()
      if (!bounds.width) return
      glyphBoundaries = Array.from(word.children, (glyph) =>
        clamp((glyph.getBoundingClientRect().left - bounds.left) / bounds.width),
      )
      glyphBoundaries.push(1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(word)

    const revealAtTime = (time: number) => {
      if (glyphBoundaries.length === 0) return 0
      for (let index = segments.length - 1; index >= 0; index -= 1) {
        const segment = segments[index]
        if (time < segment.startSeconds) continue
        const fraction = clamp((time - segment.startSeconds) / segment.fadeDurationSeconds)
        const left = glyphBoundaries[index]
        return left + fraction * (glyphBoundaries[index + 1] - left)
      }
      return 0
    }

    const pauseBlend = () => {
      playAttempt += 1
      running = false
      window.cancelAnimationFrame(frame)
      audio.pause()
    }

    const stopPending = () => {
      pauseBlend()
      window.clearTimeout(wordTimer)
      audioService.stop()
    }

    const finish = () => {
      pauseBlend()
      complete = true
      revealed = 1
      setProgress(1)
      wordTimer = window.setTimeout(() => {
        void audioService.play(definition.wordAudioId, onSpeakingChange)
      }, definition.pauseAfterBlendMs)
    }

    const update = (now: number) => {
      const spokenEnd = end === 'audio-end' ? audio.duration : end
      const elapsed = audio.currentTime
      if (target === 1 && (elapsed >= spokenEnd || audio.ended)) {
        finish()
        return
      }

      const position = revealAtTime(elapsed)
      revealed = Math.max(revealed, Math.min(position, target === 1 ? 1 : 0.99))
      setProgress(revealed)

      // A drag to the end queues the rest of the spoken blend, even after release.
      if (target < 1) {
        const tooFarAhead = position >= Math.min(target + dragTuning.maxAudioLead, 0.99)
        const stalled = position >= target && now - lastAdvance >= dragTuning.pauseGraceMs
        const released = !held && now - releasedAt >= dragTuning.pauseGraceMs
        if (tooFarAhead || stalled || released || audio.ended) {
          pauseBlend()
          if (!held) target = revealed
          return
        }
      }
      frame = window.requestAnimationFrame(update)
    }

    const resume = () => {
      if (running || complete) return
      audioService.stop()
      running = true
      const attempt = ++playAttempt
      // Keep subsequent starts at the current playhead. Reset returns to the first phoneme.
      void audio.play().then(() => {
        if (attempt === playAttempt) frame = window.requestAnimationFrame(update)
      }).catch((error: unknown) => {
        if (attempt !== playAttempt) return
        running = false
        needsReleaseGesture = error instanceof DOMException && error.name === 'NotAllowedError'
        if (!needsReleaseGesture) console.error('[audio] Could not play the interactive blend.', error)
      })
    }

    const cancel = () => {
      held = false
      pauseBlend()
      target = revealed
    }

    audio.currentTime = start
    playback.current = {
      begin() {
        held = true
        lastAdvance = performance.now()
        needsReleaseGesture = false
      },
      advance(position) {
        if (complete || position <= target) return
        target = position >= 1 - dragTuning.endTolerance ? 1 : position
        lastAdvance = performance.now()
        if (!needsReleaseGesture && (target === 1 || target - revealed >= dragTuning.startTolerance)) {
          resume()
        }
      },
      release() {
        held = false
        releasedAt = performance.now()
        // Touch release can supply user activation on Safari if the move could not.
        if (needsReleaseGesture && target > revealed) resume()
      },
      cancel,
      reset() {
        stopPending()
        audio.currentTime = start
        held = false
        complete = false
        needsReleaseGesture = false
        target = 0
        revealed = 0
        setProgress(0)
      },
      playInstruction() {
        cancel()
        window.clearTimeout(wordTimer)
        void audioService.play(instructionAudioId, onSpeakingChange)
      },
    }

    return () => {
      observer.disconnect()
      playback.current = null
      stopPending()
    }
  }, [definition, instructionAudioId, onSpeakingChange])

  useEffect(() => {
    clearDrag()
    playback.current?.playInstruction()
  }, [clearDrag, instructionReplayToken])

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current || event.button !== 0 || progress === 1) return
    const bounds = trackRef.current?.getBoundingClientRect()
    if (!bounds?.width) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { id: event.pointerId, offset: event.clientX - bounds.left - progress * bounds.width }
    playback.current?.begin()
  }

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const pointer = drag.current
    const bounds = trackRef.current?.getBoundingClientRect()
    if (!pointer || pointer.id !== event.pointerId || !bounds?.width) return
    playback.current?.advance(clamp((event.clientX - bounds.left - pointer.offset) / bounds.width))
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return
    if (event.type === 'pointerup') {
      moveDrag(event)
      playback.current?.release()
    } else {
      playback.current?.cancel()
    }
    clearDrag()
  }

  const nudge = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowUp', 'End'].includes(event.key)) return
    event.preventDefault()
    playback.current?.begin()
    playback.current?.advance(event.key === 'End' ? 1 : clamp(progress + 0.12))
    playback.current?.release()
  }

  const glyphs = definition.segments.map(({ soundId }, index) => (
    <span className={`blend-glyph blend-glyph--${soundId}`} key={`${soundId}-${index}`}>
      {soundId}
    </span>
  ))

  return (
    <div className="blend-screen interactive-blend-screen">
      <div className="blend-sequence">
        <div className="interactive-blend-word">
          <div className="blend-word-visual" aria-hidden="true">
            <div className="blend-word-layer blend-word-layer--inactive" ref={wordRef}>
              {glyphs}
            </div>
            <div className="blend-word-layer blend-word-layer--active" style={{ clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }}>
              {glyphs}
            </div>
          </div>
          <div className="interactive-blend-track" ref={trackRef}>
            <div
              className="interactive-blend-dot"
              ref={handleRef}
              style={{ left: `${progress * 100}%` }}
              role="slider"
              tabIndex={0}
              aria-label={`Move the dot to say ${definition.word}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onLostPointerCapture={endDrag}
              onKeyDown={nudge}
            />
          </div>
        </div>
        <button className="blend-replay-control" type="button" aria-label="Reset the dot" onClick={() => {
          clearDrag()
          playback.current?.reset()
        }}>
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M38 16V7l-5 5a17 17 0 1 0 5 21l-6-3a10 10 0 1 1-2-13l-6 6h14Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
