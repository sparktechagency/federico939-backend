/* eslint-disable no-unused-vars */
export enum AudioCategory {
  STRESS_AUDIO = 'STRESS_AUDIO',
  FOCUS_AUDIO = 'FOCUS_AUDIO',
  MEDIATAZIONE_AUDIO = 'MEDIATAZIONE_AUDIO',
  PODCAST_AUDIO = 'PODCAST_AUDIO',
  SUONI_DELLA_NATURA_AUDIO = 'SUONI_DELLA_NATURA_AUDIO',
  SONNO_AUDIO = 'SONNO_AUDIO',
  AFFERMAZIONI_POSITIVE_AUDIO = 'AFFERMAZIONI_POSITIVE_AUDIO',
  MEDIATATION_IMPORTANCE_AUDIO = 'MEDIATATION_IMPORTANCE_AUDIO',
  DAILY_AUDIO = 'DAILY_AUDIO',
  LATEST_AUDIO = 'LATEST_AUDIO',
}

export interface IAudio {
  name: string;
  author: string;
  thumbnail: string;
  audio: string;
  duration?: string;
  // total_duration?: number;
  category: AudioCategory;
  createdAt?: Date;
  updatedAt?: Date;
}
