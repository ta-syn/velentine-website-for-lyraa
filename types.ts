
export enum SoundType {
  UI_CLICK = 'UI_CLICK',
  UI_HOVER = 'UI_HOVER',
  TRANSITION = 'TRANSITION',
  ENTRANCE = 'ENTRANCE',
  HEARTBEAT = 'HEARTBEAT',
  CHIME = 'CHIME',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  setSoundMuted: (muted: boolean) => void;
  playSfx: (type: SoundType) => void;
  startBgMusic: () => void;
}

export interface Message {
  id: string;
  text: string;
  sender: 'Yuki' | 'Lyra';
  timestamp: string;
}
