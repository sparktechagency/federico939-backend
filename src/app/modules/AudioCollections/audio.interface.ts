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
  audio_id: string;
  audio_name: string;
  audio_author: string;
  audio_url: string;
  audio_duration: number;
  audio_total_duration: number;
  audio_category: AudioCategory;
  createdAt?: Date;
  updatedAt?: Date;
}
