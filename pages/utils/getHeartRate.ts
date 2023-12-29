/* globals __getHeartRate */
import type { Frame } from 'react-native-vision-camera';

export interface HeartRate {
    BPM: number;
    state: string;
    count: number;
}

/**
 * * `true`: Reset the heartbeat rate monitor (first frame)
 * * `false`: NOT reset the heartbeat rate monitor (NOT first frame)
 */
export type ShouldReset = 'true' | 'false';

// Frame Processor Plugin name
declare global {
    var __getHeartRate: (
        frame: Frame,
        shouldReset: ShouldReset,
    ) => HeartRate | undefined | null;
}

export function getHeartRate(
    frame: Frame,
    shouldReset: ShouldReset = 'false',
): HeartRate | undefined | null {
    'worklet';
    return __getHeartRate(frame, shouldReset);
}
