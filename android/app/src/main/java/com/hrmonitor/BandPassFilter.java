package com.hrmonitor;

public class BandPassFilter {
    private static final int numberOfZeros = 10;
    private static final int numberOfPoles = 10;

    double[] xv = new double[numberOfZeros + 1];
    double[] yv = new double[numberOfPoles + 1];

    public BandPassFilter() {
        java.util.Arrays.fill(xv, 0.0);
        java.util.Arrays.fill(yv, 0.0);
    }

    public double processValue(double value) {
        xv[0] = xv[1];
        xv[1] = xv[2];
        xv[2] = xv[3];
        xv[3] = xv[4];
        xv[4] = xv[5];
        xv[5] = xv[6];
        xv[6] = xv[7];
        xv[7] = xv[8];
        xv[8] = xv[9];
        xv[9] = xv[10];
        xv[10] = value / 1.894427025e+01;

        yv[0] = yv[1];
        yv[1] = yv[2];
        yv[2] = yv[3];
        yv[3] = yv[4];
        yv[4] = yv[5];
        yv[5] = yv[6];
        yv[6] = yv[7];
        yv[7] = yv[8];
        yv[8] = yv[9];
        yv[9] = yv[10];

        yv[10] = (xv[10] - xv[0]) + 5 * (xv[2] - xv[8]) + 10 * (xv[6] - xv[4]) + (-0.0000000000 * yv[0])
                + (0.0357796363 * yv[1]) + (-0.1476158522 * yv[2]) + (0.3992561394 * yv[3]) + (-1.1743136181 * yv[4])
                + (2.4692165842 * yv[5]) + (-3.3820859632 * yv[6]) + (3.9628972812 * yv[7]) + (-4.3832594900 * yv[8])
                + (3.2101976096 * yv[9]);

        return yv[10];
    }
}