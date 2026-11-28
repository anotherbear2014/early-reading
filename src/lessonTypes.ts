export type SoundId = 'm' | 's' | 'a' | 't' | 'r' | 'i' | 'n' | 'p' | 'f' | 'o' | 'l'

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

export interface WordAssociationScreen extends BaseScreen {
  type: 'wordAssociation'
  word: string
  soundId: SoundId
}

export interface SoundChoiceScreen extends BaseScreen {
  type: 'soundChoice'
  sounds: SoundId[]
  prompt?: string
  requestedSoundId?: SoundId
  correctFeedback?: 'stars'
  highlightRequestedSound?: boolean
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
  requestedSoundId: SoundId
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

export interface BlendSegment {
  soundId: SoundId
  startSeconds: number
  endSeconds: number | 'audio-end'
  fadeDurationSeconds: number
}

export interface BlendDefinition {
  word: string
  blendAudioId: string
  wordAudioId: string
  pauseAfterBlendMs: number
  segments: BlendSegment[]
}

export interface BlendScreen extends BaseScreen {
  type: 'blend'
  blend: BlendDefinition
}

export interface InteractiveBlendScreen extends BaseScreen {
  type: 'interactiveBlend'
  blend: BlendDefinition
}

export interface WordPracticeScreen {
  id: string
  type: 'wordPractice'
  instructionAudioId?: string
  prompt: string
  words: Pick<BlendDefinition, 'word' | 'wordAudioId' | 'segments'>[]
}

export interface CelebrationScreen extends BaseScreen {
  type: 'celebration'
}

export type LessonScreen =
  | WelcomeScreen
  | SoundScreen
  | PictureScreen
  | WordAssociationScreen
  | SoundChoiceScreen
  | PictureChoiceScreen
  | TracingScreen
  | BlendScreen
  | InteractiveBlendScreen
  | WordPracticeScreen
  | CelebrationScreen

export interface LessonDefinition {
  id: number
  title: string
  screens: LessonScreen[]
}
