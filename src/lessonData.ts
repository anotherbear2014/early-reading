import alligatorImage from './assets/pictures/alligator.png'
import antImage from './assets/pictures/ant.png'
import antelopeImage from './assets/pictures/antelope.png'
import appleImage from './assets/pictures/apple.png'
import basketballImage from './assets/pictures/basketball.png'
import duckImage from './assets/pictures/duck.png'
import moonImage from './assets/pictures/moon.png'
import motorcycleImage from './assets/pictures/motorcycle.png'
import mouseImage from './assets/pictures/mouse.png'
import rabbitImage from './assets/pictures/rabbit.png'
import sockImage from './assets/pictures/sock.png'
import sunImage from './assets/pictures/sun.png'
import turtleImage from './assets/pictures/turtle.png'
import type {
  LessonDefinition,
  LessonScreen,
  PictureDefinition,
  SoundDefinition,
  TracingDefinition,
} from './lessonTypes'

export const sounds: Record<string, SoundDefinition> = {
  m: { id: 'm', display: 'm', audioId: 'sound-m' },
  s: { id: 's', display: 's', audioId: 'sound-s' },
  a: { id: 'a', display: 'a', audioId: 'sound-a' },
}

export const pictures: Record<string, PictureDefinition> = {
  moon: {
    id: 'moon',
    label: 'Moon',
    image: moonImage,
    soundId: 'm',
    audioId: 'moon-instruction',
  },
  mouse: {
    id: 'mouse',
    label: 'Mouse',
    image: mouseImage,
    soundId: 'm',
    audioId: 'mouse-instruction',
  },
  motorcycle: {
    id: 'motorcycle',
    label: 'Motorcycle',
    image: motorcycleImage,
    soundId: 'm',
    audioId: 'motorcycle-instruction',
  },
  sun: {
    id: 'sun',
    label: 'Sun',
    image: sunImage,
    soundId: 's',
    audioId: 'sun-instruction',
  },
  sock: {
    id: 'sock',
    label: 'Sock',
    image: sockImage,
    soundId: 's',
    audioId: 'sock-instruction',
  },
  apple: {
    id: 'apple',
    label: 'Apple',
    image: appleImage,
    soundId: 'a',
    audioId: 'apple-instruction',
  },
  ant: {
    id: 'ant',
    label: 'Ant',
    image: antImage,
    soundId: 'a',
    audioId: 'ant-instruction',
  },
  antelope: {
    id: 'antelope',
    label: 'Antelope',
    image: antelopeImage,
    soundId: 'a',
    audioId: 'antelope-instruction',
  },
  alligator: {
    id: 'alligator',
    label: 'Alligator',
    image: alligatorImage,
    soundId: 'a',
    audioId: 'alligator-instruction',
  },
}

const tracingDefinitions: Record<'m' | 's', TracingDefinition> = {
  m: {
    viewBox: '0 0 680 460',
    startPoint: { x: 130, y: 75 },
    phases: [
      { id: 'down', path: 'M 130 75 L 130 380' },
      {
        id: 'first-hump',
        path: 'M 130 380 C 130 225 142 140 245 140 C 340 140 340 235 340 380',
      },
      {
        id: 'second-hump',
        path: 'M 340 380 C 340 225 352 140 455 140 C 550 140 550 235 550 380',
      },
    ],
    strokeColor: 'var(--letter-m-color)',
    touchTolerance: 82,
    completion: 'stars',
    ariaLabel: 'Trace the letter m from top to bottom, then over both humps',
  },
  s: {
    viewBox: '0 0 680 460',
    startPoint: { x: 470, y: 110 },
    phases: [
      {
        id: 'continuous-stroke',
        path:
          'M 470 110 C 415 68 310 62 250 105 C 195 145 210 202 275 228 C 325 248 400 238 440 272 C 495 315 470 385 395 410 C 325 434 250 410 210 365',
      },
    ],
    strokeColor: 'var(--letter-s-color)',
    touchTolerance: 82,
    completion: 'stars',
    ariaLabel: 'Trace the letter s from the upper right, around both curves, to the lower left',
  },
}

export const lessonOne: LessonDefinition = {
  id: 1,
  title: 'Lesson 1',
  screens: [
    {
      id: 'welcome',
      type: 'welcome',
      title: 'Sounds',
      instructionAudioId: 'welcome-instruction',
    },
    {
      id: 'introduce-m',
      type: 'sound',
      soundId: 'm',
      instructionAudioId: 'm-intro-instruction',
    },
    {
      id: 'trace-m',
      type: 'tracing',
      instructionAudioId: 'trace-m-instruction',
      tracing: tracingDefinitions.m,
    },
    {
      id: 'replay-m',
      type: 'sound',
      soundId: 'm',
      prompt: 'What sound is this? Say the sound then press the arrow',
      instructionAudioId: 'm-replay-instruction',
    },
    {
      id: 'moon',
      type: 'picture',
      pictureId: 'moon',
      instructionAudioId: 'moon-instruction',
    },
    {
      id: 'mouse',
      type: 'picture',
      pictureId: 'mouse',
      instructionAudioId: 'mouse-instruction',
    },
    {
      id: 'motorcycle',
      type: 'picture',
      pictureId: 'motorcycle',
      instructionAudioId: 'motorcycle-instruction',
    },
    {
      id: 'review-m',
      type: 'sound',
      soundId: 'm',
      instructionAudioId: 'review-sound-instruction',
    },
    {
      id: 'introduce-s',
      type: 'sound',
      soundId: 's',
      instructionAudioId: 's-intro-instruction',
    },
    {
      id: 'trace-s',
      type: 'tracing',
      instructionAudioId: 'trace-s-instruction',
      tracing: tracingDefinitions.s,
    },
    {
      id: 'replay-s',
      type: 'sound',
      soundId: 's',
      prompt: 'What sound is this? Say the sound then press the arrow',
      instructionAudioId: 's-replay-instruction',
    },
    {
      id: 'sun',
      type: 'picture',
      pictureId: 'sun',
      instructionAudioId: 'sun-instruction',
    },
    {
      id: 'sock',
      type: 'picture',
      pictureId: 'sock',
      instructionAudioId: 'sock-instruction',
    },
    {
      id: 'find-m',
      type: 'soundChoice',
      sounds: ['m', 's'],
      prompt: 'Tap the letter that makes the sound mmmmmm',
      requestedSoundId: 'm',
      randomizeOrder: true,
      instructionAudioId: 'find-m-instruction',
    },
    {
      id: 'find-s',
      type: 'soundChoice',
      sounds: ['m', 's'],
      prompt: 'Tap the letter that makes the sound ssssss',
      requestedSoundId: 's',
      randomizeOrder: true,
      instructionAudioId: 'find-s-instruction',
    },
    {
      id: 'sound-review',
      type: 'soundChoice',
      sounds: ['m', 's'],
      instructionAudioId: 'review-instruction',
    },
    {
      id: 'celebration',
      type: 'celebration',
      instructionAudioId: 'celebration-instruction',
    },
  ],
}

export const lessonTwo: LessonDefinition = {
  id: 2,
  title: 'Lesson 2',
  screens: [
    {
      id: 'lesson-2-welcome',
      type: 'welcome',
      title: 'Another Sound',
      instructionAudioId: 'lesson-2-welcome-instruction',
    },
    {
      id: 'review-m-s',
      type: 'soundChoice',
      sounds: ['m', 's'],
      instructionAudioId: 'review-instruction',
    },
    {
      id: 'review-find-m',
      type: 'soundChoice',
      sounds: ['m', 's'],
      prompt: 'Tap the letter that makes the sound:',
      requestedSoundId: 'm',
      correctFeedback: 'stars',
      instructionAudioId: 'find-m-instruction',
    },
    {
      id: 'introduce-a',
      type: 'sound',
      soundId: 'a',
      instructionAudioId: 'a-intro-instruction',
    },
    {
      id: 'replay-a',
      type: 'sound',
      soundId: 'a',
      prompt: 'What sound is this? Say the sound, then press the arrow.',
      instructionAudioId: 'a-replay-instruction',
    },
    {
      id: 'apple',
      type: 'picture',
      pictureId: 'apple',
      instructionAudioId: 'apple-instruction',
    },
    {
      id: 'ant',
      type: 'picture',
      pictureId: 'ant',
      instructionAudioId: 'ant-instruction',
    },
    {
      id: 'find-a-two-choices',
      type: 'soundChoice',
      sounds: ['a', 's'],
      prompt: 'Tap the letter that makes the sound:',
      requestedSoundId: 'a',
      correctFeedback: 'stars',
      instructionAudioId: 'find-a-instruction',
    },
    {
      id: 'find-s-three-choices',
      type: 'soundChoice',
      sounds: ['m', 'a', 's'],
      prompt: 'Tap the letter that makes the sound:',
      requestedSoundId: 's',
      correctFeedback: 'stars',
      instructionAudioId: 'find-s-instruction',
    },
    {
      id: 'antelope',
      type: 'picture',
      pictureId: 'antelope',
      instructionAudioId: 'antelope-instruction',
    },
    {
      id: 'alligator',
      type: 'picture',
      pictureId: 'alligator',
      instructionAudioId: 'alligator-instruction',
    },
    {
      id: 'mixed-find-s',
      type: 'soundChoice',
      sounds: ['m', 's', 'a'],
      prompt: 'Tap the letter that makes the sound:',
      requestedSoundId: 's',
      correctFeedback: 'stars',
      instructionAudioId: 'find-s-instruction',
    },
    {
      id: 'picture-choice-s',
      type: 'pictureChoice',
      prompt: 'Tap the picture that begins with the letter s.',
      instructionAudioId: 'tap-picture-s-instruction',
      choices: [
        {
          id: 'turtle',
          label: 'Turtle',
          image: turtleImage,
          responseAudioId: 'turtle-response',
        },
        {
          id: 'basketball',
          label: 'Basketball',
          image: basketballImage,
          responseAudioId: 'basketball-response',
        },
        {
          id: 'sun',
          label: 'Sun',
          image: sunImage,
          responseAudioId: 'sun-correct-response',
          correct: true,
        },
      ],
    },
    {
      id: 'picture-choice-m',
      type: 'pictureChoice',
      prompt: 'Tap the picture that begins with the letter m.',
      instructionAudioId: 'tap-picture-m-instruction',
      choices: [
        {
          id: 'mouse',
          label: 'Mouse',
          image: mouseImage,
          responseAudioId: 'mouse-correct-response',
          correct: true,
        },
        {
          id: 'rabbit',
          label: 'Rabbit',
          image: rabbitImage,
          responseAudioId: 'rabbit-response',
        },
        {
          id: 'duck',
          label: 'Duck',
          image: duckImage,
          responseAudioId: 'duck-response',
        },
      ],
    },
    {
      id: 'review-m-s-a',
      type: 'soundChoice',
      sounds: ['m', 's', 'a'],
      instructionAudioId: 'review-instruction',
    },
    {
      id: 'lesson-2-celebration',
      type: 'celebration',
      instructionAudioId: 'celebration-instruction',
    },
  ],
}

export const lessons = [lessonOne, lessonTwo]

const shuffled = <T,>(items: T[]) =>
  Math.random() < 0.5 ? [...items] : [...items].reverse()

/** Resolve lesson-level variations once so they stay stable for the whole run. */
export function createLessonRun(lesson: LessonDefinition): LessonScreen[] {
  return lesson.screens.map((screen) => {
    if (screen.type === 'soundChoice' && screen.randomizeOrder) {
      return { ...screen, sounds: shuffled(screen.sounds) }
    }
    return screen
  })
}
