import { useCallback, useEffect, useRef, useState } from 'react'
import { audioService, lessonOneAudioIds } from './audio'
import unicornImage from './assets/unicorn.png'
import { LetterTracing } from './components/LetterTracing'
import { UnicornInstructor } from './components/UnicornInstructor'
import { createLessonRun, lessonOne, pictures, sounds } from './lessonData'
import type { LessonScreen, SoundId } from './lessonTypes'
import './App.css'

interface SoundButtonProps {
  soundId: SoundId
  size: 'hero' | 'choice' | 'small'
}

function SoundButton({ soundId, size }: SoundButtonProps) {
  const sound = sounds[soundId]

  return (
    <button
      className={`sound-button sound-button--${size} sound-button--${soundId}`}
      type="button"
      aria-label={`Play the ${sound.display} sound`}
      onClick={() => void audioService.play(sound.audioId)}
    >
      {sound.display}
    </button>
  )
}

function ScreenContent({ screen }: { screen: LessonScreen }) {
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
    return (
      <div className={`choice-screen${screen.prompt ? ' has-prompt' : ''}`}>
        {screen.prompt && <h2 className="choice-prompt">{screen.prompt}</h2>}
        <div className="choice-content">
          {screen.sounds.map((soundId) => (
            <SoundButton key={soundId} soundId={soundId} size="choice" />
          ))}
        </div>
      </div>
    )
  }

  if (screen.type === 'tracing') {
    return <LetterTracing definition={screen.tracing} />
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

function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="home-screen">
      <div className="home-card">
        <img className="home-unicorn" src={unicornImage} alt="Friendly unicorn" />
        <h1>Reading</h1>
        <button className="lesson-button" type="button" onClick={onStart}>
          Lesson 1
          <span aria-hidden="true">→</span>
        </button>
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
  const screen = screens[screenIndex]
  const isCelebration = screen.type === 'celebration'
  const nextEnabled = readyScreenId === screen.id
  const showLessonNavigation = nextEnabled && !isCelebration

  const playInstruction = useCallback(() => {
    return audioService.play(screen.instructionAudioId, setIsSpeaking)
  }, [screen.instructionAudioId])

  useEffect(() => {
    let active = true
    let fallbackTimer = 0

    void playInstruction().then((result) => {
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
  }, [playInstruction, screen.id])

  const goHome = () => {
    audioService.stop()
    onHome()
  }

  const goNext = () => {
    if (!nextEnabled || isCelebration) return
    audioService.stop()
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
    void playInstruction()
  }

  return (
    <main className="lesson-screen">
      <button className="home-control" type="button" onClick={goHome} aria-label="Home">
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M8 23 24 9l16 14v16H29V28H19v11H8Z" />
        </svg>
      </button>

      <div className="lesson-content" key={screen.id}>
        <ScreenContent screen={screen} />
      </div>

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

      {showLessonNavigation && (
        <>
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
    screens: LessonScreen[]
  } | null>(null)

  const startLesson = () => {
    audioService.preload(lessonOneAudioIds)
    runCounter.current += 1
    setLessonRun({ id: runCounter.current, screens: createLessonRun(lessonOne) })
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
      onRepeat={startLesson}
    />
  )
}

export default App
