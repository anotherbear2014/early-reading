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
import rockImage from './assets/pictures/rock.png'
import rocketImage from './assets/pictures/rocket.png'
import sockImage from './assets/pictures/sock.png'
import sunImage from './assets/pictures/sun.png'
import tableImage from './assets/pictures/table.png'
import tacoImage from './assets/pictures/taco.png'
import turtleImage from './assets/pictures/turtle.png'
import type {
  BlendScreen,
  LessonDefinition,
  LessonScreen,
  PictureDefinition,
  SoundDefinition,
  SoundId,
  TracingDefinition,
} from './lessonTypes'

export const sounds: Record<SoundId, SoundDefinition> = {
  m: { id: 'm', display: 'm', promptSound: 'mmmmmm', audioId: 'sound-m' },
  s: { id: 's', display: 's', promptSound: 'ssssss', audioId: 'sound-s' },
  a: { id: 'a', display: 'a', promptSound: 'aaaaa', audioId: 'sound-a' },
  t: { id: 't', display: 't', promptSound: 't', audioId: 'sound-t' },
  r: { id: 'r', display: 'r', promptSound: 'rrrrr', audioId: 'sound-r' },
}

const targetSoundChoice = (soundId: SoundId) => ({
  prompt: `Tap the ${sounds[soundId].promptSound}`,
  requestedSoundId: soundId,
  instructionAudioId: `tap-${soundId}-instruction`,
})

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
  taco: {
    id: 'taco',
    label: 'Taco',
    image: tacoImage,
    soundId: 't',
    audioId: 'taco-instruction',
  },
  turtle: {
    id: 'turtle',
    label: 'Turtle',
    image: turtleImage,
    soundId: 't',
    audioId: 'turtle-t-instruction',
  },
  rabbit: {
    id: 'rabbit',
    label: 'Rabbit',
    image: rabbitImage,
    soundId: 'r',
    audioId: 'rabbit-r-instruction',
  },
  rocket: {
    id: 'rocket',
    label: 'Rocket',
    image: rocketImage,
    soundId: 'r',
    audioId: 'rocket-instruction',
  },
  table: {
    id: 'table',
    label: 'Table',
    image: tableImage,
    soundId: 't',
    audioId: 'table-instruction',
  },
  rock: {
    id: 'rock',
    label: 'Rock',
    image: rockImage,
    soundId: 'r',
    audioId: 'rock-instruction',
  },
}

const tracingDefinitions: Record<'m' | 's' | 't' | 'r', TracingDefinition> = {
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
  t: {
    viewBox: '0 0 680 460',
    startPoint: { x: 320, y: 60 },
    phases: [
      { id: 'stem', path: 'M 320 60 L 320 400' },
      { id: 'crossbar', path: 'M 205 190 L 435 190' },
    ],
    strokeColor: 'var(--letter-t-color)',
    touchTolerance: 82,
    completion: 'stars',
    ariaLabel: 'Trace the letter t down from the top, then across from left to right',
  },
  r: {
    viewBox: '0 0 680 460',
    startPoint: { x: 245, y: 85 },
    phases: [
      { id: 'stem-down', path: 'M 245 85 L 245 390' },
      { id: 'stem-up', path: 'M 245 390 L 245 150' },
      { id: 'shoulder', path: 'M 245 150 C 290 105 380 115 420 190 C 435 220 430 250 420 270' },
    ],
    strokeColor: 'var(--letter-r-color)',
    touchTolerance: 82,
    completion: 'stars',
    ariaLabel: 'Trace the letter r down, back up, then around the short shoulder',
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
      ...targetSoundChoice('m'),
      randomizeOrder: true,
    },
    {
      id: 'find-s',
      type: 'soundChoice',
      sounds: ['m', 's'],
      ...targetSoundChoice('s'),
      randomizeOrder: true,
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
      ...targetSoundChoice('m'),
      correctFeedback: 'stars',
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
      ...targetSoundChoice('a'),
      correctFeedback: 'stars',
    },
    {
      id: 'find-s-three-choices',
      type: 'soundChoice',
      sounds: ['m', 'a', 's'],
      ...targetSoundChoice('s'),
      correctFeedback: 'stars',
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
      ...targetSoundChoice('s'),
      correctFeedback: 'stars',
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

export const lessonThree: LessonDefinition = {
  id: 3,
  title: 'Lesson 3',
  screens: [
    {
      id: 'lesson-3-welcome',
      type: 'welcome',
      title: 'Another Sound',
      instructionAudioId: 'lesson-3-welcome-instruction',
    },
    {
      id: 'lesson-3-review-m-s-a',
      type: 'soundChoice',
      sounds: ['m', 's', 'a'],
      instructionAudioId: 'review-instruction',
    },
    {
      id: 'introduce-t',
      type: 'sound',
      soundId: 't',
      instructionAudioId: 't-intro-instruction',
    },
    {
      id: 'replay-t',
      type: 'sound',
      soundId: 't',
      prompt: 'What sound is this? Say the sound, then press the arrow.',
      instructionAudioId: 'what-sound-instruction',
    },
    {
      id: 'taco',
      type: 'picture',
      pictureId: 'taco',
      instructionAudioId: 'taco-instruction',
    },
    {
      id: 'turtle-t',
      type: 'picture',
      pictureId: 'turtle',
      instructionAudioId: 'turtle-t-instruction',
    },
    {
      id: 'trace-t',
      type: 'tracing',
      instructionAudioId: 'trace-t-instruction',
      tracing: tracingDefinitions.t,
    },
    {
      id: 'introduce-r',
      type: 'sound',
      soundId: 'r',
      instructionAudioId: 'r-intro-instruction',
    },
    {
      id: 'replay-r',
      type: 'sound',
      soundId: 'r',
      prompt: 'What sound is this? Say the sound, then press the arrow.',
      instructionAudioId: 'what-sound-instruction',
    },
    {
      id: 'rabbit-r',
      type: 'picture',
      pictureId: 'rabbit',
      instructionAudioId: 'rabbit-r-instruction',
    },
    {
      id: 'rocket',
      type: 'picture',
      pictureId: 'rocket',
      instructionAudioId: 'rocket-instruction',
    },
    {
      id: 'trace-r',
      type: 'tracing',
      instructionAudioId: 'trace-r-instruction',
      tracing: tracingDefinitions.r,
    },
    {
      id: 'table',
      type: 'picture',
      pictureId: 'table',
      instructionAudioId: 'table-instruction',
    },
    {
      id: 'rock',
      type: 'picture',
      pictureId: 'rock',
      instructionAudioId: 'rock-instruction',
    },
    {
      id: 'find-r',
      type: 'soundChoice',
      sounds: ['m', 'r'],
      ...targetSoundChoice('r'),
      correctFeedback: 'stars',
    },
    {
      id: 'find-t',
      type: 'soundChoice',
      sounds: ['s', 't'],
      ...targetSoundChoice('t'),
      correctFeedback: 'stars',
    },
    {
      id: 'find-m-review',
      type: 'soundChoice',
      sounds: ['a', 'm', 't'],
      ...targetSoundChoice('m'),
      correctFeedback: 'stars',
    },
    {
      id: 'find-s-review',
      type: 'soundChoice',
      sounds: ['a', 'r', 's'],
      ...targetSoundChoice('s'),
      correctFeedback: 'stars',
    },
    {
      id: 'lesson-3-free-review',
      type: 'soundChoice',
      sounds: ['m', 's', 'a', 't', 'r'],
      instructionAudioId: 'review-instruction',
    },
    {
      id: 'lesson-3-celebration',
      type: 'celebration',
      instructionAudioId: 'celebration-instruction',
    },
  ],
}

function buildLessonFourBlend(
  firstSound: 'm' | 's' | 'r',
  [firstStart, aStart, tStart, spokenEnd]: [number, number, number, number],
): BlendScreen {
  const word = `${firstSound}at`
  const segment = (soundId: SoundId, startSeconds: number, endSeconds: number) => ({
    soundId,
    startSeconds,
    endSeconds,
    fadeDurationSeconds: endSeconds - startSeconds,
  })

  return {
    id: `blend-${word}`,
    type: 'blend',
    instructionAudioId: `${word}-blend`,
    blend: {
      word,
      blendAudioId: `${word}-blend`,
      wordAudioId: `${word}-word`,
      pauseAfterBlendMs: 300,
      segments: [
        segment(firstSound, firstStart, aStart),
        segment('a', aStart, tStart),
        segment('t', tStart, spokenEnd),
      ],
    },
  }
}

const lessonFourDemonstrations: BlendScreen[] = [
  {
    id: 'blend-at',
    type: 'blend',
    instructionAudioId: 'at-blend',
    blend: {
      word: 'at',
      blendAudioId: 'at-blend',
      wordAudioId: 'at-word',
      pauseAfterBlendMs: 300,
      segments: [
        { soundId: 'a', startSeconds: 0, endSeconds: 1.16, fadeDurationSeconds: 1.16 },
        { soundId: 't', startSeconds: 1.16, endSeconds: 'audio-end', fadeDurationSeconds: 0.14 },
      ],
    },
  },
  // Measured raw onsets, then the approximate spoken end before the recorded tail.
  buildLessonFourBlend('m', [0.59, 1.25, 2.05, 2.36]),
  buildLessonFourBlend('s', [0.24, 0.91, 1.73, 2.04]),
  buildLessonFourBlend('r', [0.76, 1.54, 2.40, 2.76]),
]

function lessonFourWordSequence(demonstration: BlendScreen): LessonScreen[] {
  const { blend } = demonstration
  return [
    demonstration,
    {
      id: `interactive-blend-${blend.word}`,
      type: 'interactiveBlend',
      instructionAudioId: 'move-the-dot-instruction',
      blend,
    },
    {
      id: `your-turn-${blend.word}`,
      type: 'wordPractice',
      prompt: 'Your turn to say the word.',
      instructionAudioId: 'your-turn-say-word-instruction',
      words: [blend],
    },
  ]
}

export const lessonFour: LessonDefinition = {
  id: 4,
  title: 'Lesson 4',
  screens: [
    {
      id: 'lesson-4-welcome',
      type: 'welcome',
      title: 'Let’s put sounds together!',
      instructionAudioId: 'lesson-4-welcome-instruction',
    },
    {
      id: 'lesson-4-sound-review',
      type: 'soundChoice',
      sounds: ['m', 's', 'a', 't', 'r'],
      instructionAudioId: 'review-instruction',
    },
    ...lessonFourDemonstrations.flatMap(lessonFourWordSequence),
    {
      id: 'lesson-4-word-review',
      type: 'wordPractice',
      prompt: 'Tap a word.',
      words: lessonFourDemonstrations.map(({ blend }) => blend),
    },
    {
      id: 'lesson-4-celebration',
      type: 'celebration',
      instructionAudioId: 'celebration-instruction',
    },
  ],
}

export const lessons = [lessonOne, lessonTwo, lessonThree, lessonFour]
  .sort((first, second) => first.id - second.id)

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
