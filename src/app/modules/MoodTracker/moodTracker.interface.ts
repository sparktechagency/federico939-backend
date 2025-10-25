import { MOOD_TYPE, SOURCE } from "./moodTracker.constant";

export interface TMoodTracker {
    title?: string;
    moodType: MOOD_TYPE;
    source: SOURCE;
}