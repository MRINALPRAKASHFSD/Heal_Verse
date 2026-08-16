export enum TranscriptionState {
  Idle = 'idle',
  Listening = 'listening',
  Transcribing = 'transcribing',
  Complete = 'complete',
  Failed = 'failed',
}

export enum AudioDeviceKind {
  Microphone = 'microphone',
  Speaker = 'speaker',
  Headset = 'headset',
}