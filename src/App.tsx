import { useCallback, useEffect, useRef, useState } from 'react'
import { audioService } from './audio'
import unicornImage from './assets/unicorn.png'
import { BlendScreen } from './components/BlendScreen'
import { InteractiveBlendScreen } from './components/InteractiveBlendScreen'
import { LetterTracing } from './components/LetterTracing'
import { UnicornInstructor } from './components/UnicornInstructor'
import { createLessonRun, lessons, pictures, sounds } from './lessonData'
import type { LessonDefinition, LessonScreen, SoundId } from './lessonTypes'
import './App.css'

interface SoundButtonProps {
  soundId: SoundId
  size: 'hero' | 'choice' | 'small'
  onActivate?: (soundId: SoundId) => void
}

function SoundButton({ soundId, size, onActivate }: SoundButtonProps) {
  const sound = sounds[soundId]

  return (
    <button
      className={`sound-button sound-button--${size} sound-button--${soundId}`}
      type="button"
      aria-label={`Play the ${sound.display} sound`}
      onClick={() => {
        void audioService.play(sound.audioId)
        onActivate?.(soundId)
      }}
    >
      {sound.display}
    </button>
  )
}

function ChoiceStars({ animationKey }: { animationKey: number }) {
  if (animationKey === 0) return null

  return (
    <div className="choice-stars" key={animationKey} aria-hidden="true">
      <span>★</span>
      <span>✦</span>
      <span>★</span>
    </div>
  )
}

interface ScreenContentProps {
  screen: LessonScreen
  blendReplayToken: number
  onBlendReplay: () => void
  onBlendComplete: () => void
  onSpeakingChange: (speaking: boolean) => void
}

function ScreenContent({
  screen,
  blendReplayToken,
  onBlendReplay,
  onBlendComplete,
  onSpeakingChange,
}: ScreenContentProps) {
  const [choiceCelebration, setChoiceCelebration] = useState(0)

  if (screen.type === 'welcome') {
    return (
      <div className="welcome-content">
        <img className="welcome-unicorn" src={unicornImage} alt="" />
        <h2>{screen.title}</h2>
      </div>
    )
  }

  if (screen.type === 'sound') {
    return (
      <div className="sound-content">
        {screen.prompt && <h2 className="sound-prompt">{screen.prompt}</h2>}
        <SoundButton soundId={screen.soundId} size="hero" />
      </div>
    )
  }

  if (screen.type === 'picture') {
    const picture = pictures[screen.pictureId]
    return (
      <div className="picture-content">
        <button
          className="picture-button"
          type="button"
          aria-label={`Play ${picture.label}`}
          onClick={() => void audioService.play(picture.audioId)}
        >
          <img src={picture.image} alt={picture.label} />
        </button>
        <SoundButton soundId={picture.soundId} size="small" />
      </div>
    )
  }

  if (screen.type === 'soundChoice') {
    const handleChoice = (soundId: SoundId) => {
      if (soundId === screen.requestedSoundId && screen.correctFeedback === 'stars') {
        setChoiceCelebration((value) => value + 1)
      }
    }

    return (
      <div className={`choice-screen${screen.prompt ? ' has-prompt' : ''}`}>
        {screen.prompt && <h2 className="choice-prompt">{screen.prompt}</h2>}
        <div className={`choice-content choice-content--${screen.sounds.length}`}>
          {screen.sounds.map((soundId) => (
            <SoundButton
              key={soundId}
              soundId={soundId}
              size="choice"
              onActivate={handleChoice}
            />
          ))}
        </div>
        <ChoiceStars animationKey={choiceCelebration} />
      </div>
    )
  }

  if (screen.type === 'pictureChoice') {
    const handlePictureChoice = (responseAudioId: string, correct?: boolean) => {
      void audioService.play(responseAudioId)
      if (correct) setChoiceCelebration((value) => value + 1)
    }

    return (
      <div className="picture-choice-screen">
        <h2 className="choice-prompt">{screen.prompt}</h2>
        <div className="picture-choice-content">
          {screen.choices.map((choice) => (
            <button
              className="picture-choice-button"
              type="button"
              aria-label={`Choose ${choice.label}`}
              onClick={() => handlePictureChoice(choice.responseAudioId, choice.correct)}
              key={choice.id}
            >
              <img src={choice.image} alt={choice.label} />
            </button>
          ))}
        </div>
        <ChoiceStars animationKey={choiceCelebration} />
      </div>
    )
  }

  if (screen.type === 'tracing') {
    return <LetterTracing definition={screen.tracing} />
  }

  if (screen.type === 'blend') {
    return (
      <BlendScreen
        definition={screen.blend}
        replayToken={blendReplayToken}
        onReplay={onBlendReplay}
        onDemonstrationComplete={onBlendComplete}
        onSpeakingChange={onSpeakingChange}
      />
    )
  }

  if (screen.type === 'interactiveBlend') {
    return (
      <InteractiveBlendScreen
        definition={screen.blend}
        instructionAudioId={screen.instructionAudioId}
        instructionReplayToken={blendReplayToken}
        onSpeakingChange={onSpeakingChange}
      />
    )
  }

  if (screen.type === 'wordPractice') {
    return (
      <div className="choice-screen">
        <h2 className="choice-prompt">{screen.prompt}</h2>
        <div className={screen.words.length > 1 ? 'word-review-grid' : undefined}>
          {screen.words.map(({ word, wordAudioId, segments }) => (
            <button
              className="word-practice-button"
              type="button"
              aria-label={`Hear ${word}`}
              key={word}
              onClick={() => void audioService.play(wordAudioId)}
            >
              {segments.map(({ soundId }, index) => (
                <span className={`blend-glyph--${soundId}`} key={`${soundId}-${index}`}>
                  {soundId}
                </span>
              ))}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="celebration-content" aria-label="Lesson complete">
      <div className="celebration-stars" aria-hidden="true">
        {['✦', '★', '✦', '★', '✦', '★'].map((star, index) => (
          <span key={index}>{star}</span>
        ))}
      </div>
      <div className="finish-mark" aria-hidden="true">★</div>
      <h2>Great reading!</h2>
    </div>
  )
}

function HomeScreen({ onStart }: { onStart: (lesson: LessonDefinition) => void }) {
  return (
    <main className="home-screen">
      <div className="home-card">
        <img className="home-unicorn" src={unicornImage} alt="Friendly unicorn" />
        <h1>Reading</h1>
        <div className="lesson-list">
          {lessons.map((lesson) => (
            <button
              className="lesson-button"
              type="button"
              onClick={() => onStart(lesson)}
              key={lesson.id}
            >
              {lesson.title}
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

interface LessonPlayerProps {
  screens: LessonScreen[]
  onHome: () => void
  onRepeat: () => void
}

function LessonPlayer({ screens, onHome, onRepeat }: LessonPlayerProps) {
  const [screenIndex, setScreenIndex] = useState(0)
  const [readyScreenId, setReadyScreenId] = useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [blendReplayToken, setBlendReplayToken] = useState(0)
  const screen = screens[screenIndex]
  const { instructionAudioId } = screen
  const isCelebration = screen.type === 'celebration'
  const nextEnabled = readyScreenId === screen.id ||
    screen.type === 'interactiveBlend' || screen.type === 'wordPractice'
  const showLessonNavigation = nextEnabled && !isCelebration

  const playInstruction = useCallback(() => {
    if (instructionAudioId) return audioService.play(instructionAudioId, setIsSpeaking)
  }, [instructionAudioId])

  useEffect(() => {
    if (screen.type === 'blend' || screen.type === 'interactiveBlend') return

    let active = true
    let fallbackTimer = 0

    void playInstruction()?.then((result) => {
      if (!active) return
      if (result === 'ended') {
        setReadyScreenId(screen.id)
      } else {
        fallbackTimer = window.setTimeout(() => {
          if (active) setReadyScreenId(screen.id)
        }, 800)
      }
    })

    return () => {
      active = false
      window.clearTimeout(fallbackTimer)
      audioService.stop()
    }
  }, [playInstruction, screen.id, screen.type])

  const goHome = () => {
    audioService.stop()
    onHome()
  }

  const goNext = () => {
    if (!nextEnabled || isCelebration) return
    audioService.stop()
    if (screenIndex === screens.length - 1) {
      onHome()
      return
    }
    setReadyScreenId(null)
    setScreenIndex((index) => Math.min(index + 1, screens.length - 1))
  }

  const goBack = () => {
    audioService.stop()
    setReadyScreenId(null)
    if (screenIndex === 0) {
      onHome()
      return
    }
    setScreenIndex((index) => Math.max(index - 1, 0))
  }

  const repeatInstruction = () => {
    if (screen.type === 'blend' || screen.type === 'interactiveBlend') {
      setBlendReplayToken((token) => token + 1)
      return
    }
    void playInstruction()
  }

  const handleBlendComplete = useCallback(() => {
    setReadyScreenId(screen.id)
  }, [screen.id])

  return (
    <main className="lesson-screen">
      <button className="home-control" type="button" onClick={goHome} aria-label="Home">
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M8 23 24 9l16 14v16H29V28H19v11H8Z" />
        </svg>
      </button>

      <div className="lesson-content" key={screen.id}>
        <ScreenContent
          screen={screen}
          blendReplayToken={blendReplayToken}
          onBlendReplay={repeatInstruction}
          onBlendComplete={handleBlendComplete}
          onSpeakingChange={setIsSpeaking}
        />
      </div>

      {instructionAudioId && (
        <button
          className={`instructor-control${isSpeaking ? ' is-speaking' : ''}`}
          type="button"
          onClick={repeatInstruction}
          aria-label="Hear the instruction again"
        >
          <UnicornInstructor />
          <span className="sound-waves" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      )}

      {showLessonNavigation && (
        <>
          {screenIndex > 0 && (
            <button
              className="lesson-navigation-control back-control"
              type="button"
              onClick={goBack}
              aria-label="Back"
            >
              <svg viewBox="0 0 96 96" aria-hidden="true">
                <path d="M81 48H24M43 25 20 48l23 23" />
              </svg>
            </button>
          )}
          <button
            className="lesson-navigation-control next-control"
            type="button"
            onClick={goNext}
            aria-label="Next"
          >
            <svg viewBox="0 0 96 96" aria-hidden="true">
              <path d="M15 48h57M53 25l23 23-23 23" />
            </svg>
          </button>
        </>
      )}

      {isCelebration && (
        <div className="finish-actions">
          <button type="button" className="finish-button repeat-button" onClick={onRepeat}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M38 16V7l-5 5a17 17 0 1 0 5 21l-6-3a10 10 0 1 1-2-13l-6 6h14Z" />
            </svg>
            Repeat Lesson
          </button>
          <button type="button" className="finish-button" onClick={goHome}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M8 23 24 9l16 14v16H29V28H19v11H8Z" />
            </svg>
            Home
          </button>
        </div>
      )}
    </main>
  )
}

function App() {
  const runCounter = useRef(0)
  const [lessonRun, setLessonRun] = useState<{
    id: number
    lesson: LessonDefinition
    screens: LessonScreen[]
  } | null>(null)

  const startLesson = (lesson: LessonDefinition) => {
    const responseAudioIds = lesson.screens.flatMap((screen) => {
      if (screen.type === 'blend' || screen.type === 'interactiveBlend') {
        return [screen.blend.blendAudioId, screen.blend.wordAudioId]
      }
      if (screen.type === 'wordPractice') {
        return screen.words.map((word) => word.wordAudioId)
      }
      if (screen.type === 'pictureChoice') {
        return screen.choices.map((choice) => choice.responseAudioId)
      }
      if (screen.type === 'picture') {
        return [pictures[screen.pictureId].audioId]
      }
      return []
    })
    const audioIds = [
      ...Object.values(sounds).map((sound) => sound.audioId),
      ...lesson.screens.flatMap(({ instructionAudioId }) => instructionAudioId ? [instructionAudioId] : []),
      ...responseAudioIds,
    ]
    audioService.preload([...new Set(audioIds)])
    runCounter.current += 1
    setLessonRun({
      id: runCounter.current,
      lesson,
      screens: createLessonRun(lesson),
    })
  }
  const goHome = () => setLessonRun(null)

  if (!lessonRun) {
    return <HomeScreen onStart={startLesson} />
  }

  return (
    <LessonPlayer
      key={lessonRun.id}
      screens={lessonRun.screens}
      onHome={goHome}
      onRepeat={() => startLesson(lessonRun.lesson)}
    />
  )
}

export default App
