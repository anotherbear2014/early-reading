export type SoundId = 'm' | 's'

export interface SoundDefinition {
  id: SoundId
  display: string
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
  randomizeOrder?: boolean
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
  | TracingScreen
  | CelebrationScreen

export interface LessonDefinition {
  id: number
  title: string
  screens: LessonScreen[]
}
