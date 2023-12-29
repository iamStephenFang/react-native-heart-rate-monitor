package com.hrmonitor;

import android.util.Log;

public class PulseDetector {
    private static final int maxPeriodsToStore = 40;
    private static final int averageSize = 40;
    private static final double maxPeriod = 1.5;
    private static final double minPeriod = 0.1;
    private static final double invalidEntry = -100;

    private double[] upVals = new double[averageSize];
    private double[] downVals = new double[averageSize];
    private int downValIndex = 0;
    private int upValIndex = 0;
    private float lastVal = 0.0f;

    private double[] periods = new double[maxPeriodsToStore];
    private double[] periodTimes = new double[maxPeriodsToStore];
    private int periodIndex = 0;

    private float average = 0.0f;
    private boolean wasDown = false;
    private double periodStart = 0.0;

    public PulseDetector() {
        java.util.Arrays.fill(upVals, 0.0);
        java.util.Arrays.fill(downVals, 0.0);
        java.util.Arrays.fill(periods, 0.0);
        java.util.Arrays.fill(periodTimes, 0.0);

        reset();
    }

    public float addNewValue(double newVal, double time) {
        if (newVal > 0) {
            upVals[upValIndex] = newVal;
            upValIndex += 1;
            if (upValIndex >= averageSize) {
                upValIndex = 0;
            }
        }

        if (newVal < 0) {
            downVals[downValIndex] = -newVal;
            downValIndex += 1;
            if (downValIndex >= averageSize) {
                downValIndex = 0;
            }
        }

        // work out the average value above zero
        double total = 0.0;
        double count = 0.0;
        for (int i = 0; i < averageSize; i++) {
            if (upVals[i] != invalidEntry) {
                count += 1.0;
                total += upVals[i];
            }
        }

        double averageUp = total / count;
        // and the average value below zero
        total = 0.0;
        count = 0.0;
        for (int i = 0; i < averageSize; i++) {
            if (downVals[i] != invalidEntry) {
                count += 1.0;
                total += downVals[i];
            }
        }
        double averageDown = total / count;

        if (newVal < -0.5 * averageDown) {
            wasDown = true;
        }
        // is the new value an up value and were we previously in the down state?
        if (newVal >= 0.5 * averageUp && wasDown) {
            wasDown = false;
            // work out the difference between now and the last time this happenned
            if ((time - periodStart < maxPeriod) && (time - periodStart > minPeriod)) {
                periods[periodIndex] = time - periodStart;
                periodTimes[periodIndex] = time;
                periodIndex += 1;
                if (periodIndex >= maxPeriodsToStore) {
                    periodIndex = 0;
                }
            }
            // track when the transition happened
            periodStart = time;
        }
        // return up or down
        if (newVal < -0.5 * averageDown) {
            return -1;
        } else if (newVal > 0.5 * averageUp) {
            return 1;
        }
        return 0;
    }

    public float getAverage() {
        double time = System.currentTimeMillis() / (double) (1000.0);
        double total = 0.0;
        double count = 0.0;

        for (int i = 0; i < maxPeriodsToStore; i++) {
            // only use upto 10 seconds worth of data
            if ((periods[i] != invalidEntry) && (time - periodTimes[i] < 30.0)) {
                count += 1.0;
                total += periods[i];
            }
        }

        if (count > 2) {
            return (float) (total / count);
        }
        return (float) (-1);
    }

    public void reset() {
        for (int i = 0; i < maxPeriodsToStore; i++) {
            periods[i] = invalidEntry;
            periodTimes[i] = 0.0;
        }
        for (int i = 0; i < averageSize; i++) {
            upVals[i] = invalidEntry;
            downVals[i] = invalidEntry;
        }
        periodIndex = 0;
        downValIndex = 0;
        upValIndex = 0;
    }
}