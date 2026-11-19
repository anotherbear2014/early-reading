export type SoundId = 'm' | 's' | 'a'

export interface SoundDefinition {
  id: SoundId
  display: string
  promptSound: string
  audioId: string
}

export interface PictureDefinition {
  id: string
  label: string
  image: string
  soundId: SoundId
  audioId: string
}

interface BaseScreen {
  id: string
  instructionAudioId: string
}

export interface WelcomeScreen extends BaseScreen {
  type: 'welcome'
  title: string
}

export interface SoundScreen extends BaseScreen {
  type: 'sound'
  soundId: SoundId
  prompt?: string
}

export interface PictureScreen extends BaseScreen {
  type: 'picture'
  pictureId: string
}

export interface SoundChoiceScreen extends BaseScreen {
  type: 'soundChoice'
  sounds: SoundId[]
  prompt?: string
  requestedSoundId?: SoundId
  correctFeedback?: 'stars'
  randomizeOrder?: boolean
}

export interface PictureChoice {
  id: string
  label: string
  image: string
  responseAudioId: string
  correct?: boolean
}

export interface PictureChoiceScreen extends BaseScreen {
  type: 'pictureChoice'
  prompt: string
  choices: PictureChoice[]
}

export interface TracingPhase {
  id: string
  path: string
}

export interface TracingDefinition {
  viewBox: string
  startPoint: { x: number; y: number }
  phases: TracingPhase[]
  strokeColor: string
  touchTolerance: number
  completion: 'stars'
  ariaLabel: string
}

export interface TracingScreen extends BaseScreen {
  type: 'tracing'
  tracing: TracingDefinition
}

export interface CelebrationScreen extends BaseScreen {
  type: 'celebration'
}

export type LessonScreen =
  | WelcomeScreen
  | SoundScreen
  | PictureScreen
  | SoundChoiceScreen
  | PictureChoiceScreen
  | TracingScreen
  | CelebrationScreen

export interface LessonDefinition {
  id: number
  title: string
  screens: LessonScreen[]
}
