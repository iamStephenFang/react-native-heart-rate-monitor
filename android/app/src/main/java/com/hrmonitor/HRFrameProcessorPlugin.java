package com.hrmonitor;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.media.Image;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.camera.core.ImageProxy;
import com.hrmonitor.utils.YuvToRgbConverter;
import com.hrmonitor.BandPassFilter;
import com.hrmonitor.PulseDetector;
import com.facebook.react.bridge.WritableNativeMap;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;
import android.util.Log;

public class HRFrameProcessorPlugin extends FrameProcessorPlugin {
    private final YuvToRgbConverter yuvToRgbConverter;
    private final BandPassFilter hueFilter = new BandPassFilter();
    private final PulseDetector pulseDetector = new PulseDetector();

    private int BPM = 0;
    private String state = "RECORDING";
    private int validFrameCounter = 0;

    private int calculateAverageColor(Bitmap bitmap) {
        int R = 0;
        int G = 0;
        int B = 0;
        int height = bitmap.getHeight();
        int width = bitmap.getWidth();
        int n = 0;
        int[] pixels = new int[width * height];
        bitmap.getPixels(pixels, 0, width, 0, 0, width, height);
        for (int i = 0; i < pixels.length; i += 1) {
            int color = pixels[i];
            R += Color.red(color);
            G += Color.green(color);
            B += Color.blue(color);
            n++;
        }
        return Color.rgb(R / n, G / n, B / n);
    }

    private void reset() {
        pulseDetector.reset();
        validFrameCounter = 0;
        state = "BEGIN";
        BPM = 0;
    }

    @SuppressLint("UnsafeOptInUsageError")
    @Nullable
    @Override
    public Object callback(@NonNull ImageProxy imageProxy, @NonNull Object[] params) {
        Image image = imageProxy.getImage();
        if (image == null) {
            return null;
        }

        if (params.length > 0 && params[0] instanceof String) {
            if (((String) params[0]).equals("true")) {
                reset();
            }
        }

        Bitmap bitmap = Bitmap.createBitmap(image.getWidth(), image.getHeight(), Bitmap.Config.ARGB_8888);
        yuvToRgbConverter.yuvToRgb(image, bitmap);

        int higher = Math.max(bitmap.getWidth(), bitmap.getHeight());
        int lower = Math.min(bitmap.getWidth(), bitmap.getHeight());
        int resizedHeight = 100;
        int resizedWidth = (int) (((float) lower / (float) higher) * resizedHeight);
        Bitmap resized = Bitmap.createScaledBitmap(bitmap, resizedWidth, resizedHeight, false);
        int average = calculateAverageColor(resized);

        float[] hsv = new float[3];
        Color.colorToHSV(Color.rgb(Color.red(average), Color.green(average),
                Color.blue(average)), hsv);
        float hue = hsv[0];
        float saturation = hsv[1];
        float brightness = hsv[2];

        if (saturation > 0.5 && brightness > 0.5) {
            state = "RECORDING";
            BPM = (int) (60.0f / pulseDetector.getAverage());
            validFrameCounter += 1;

            // Filter the hue value - the filter is a simple BAND PASS FILTER that removes
            // any DC component and any high frequency noise
            if (validFrameCounter > 60) {
                double filtered = hueFilter.processValue((double) (hue));
                float upOrDown = pulseDetector.addNewValue(filtered,
                        System.currentTimeMillis() / (double) (1000.0));
            }
        } else {
            reset();
        }

        WritableNativeMap result = new WritableNativeMap();
        result.putDouble("BPM", BPM);
        result.putString("state", state);
        result.putDouble("count", validFrameCounter);
        return result;
    }

    HRFrameProcessorPlugin(Context context) {
        super("getHeartRate");
        yuvToRgbConverter = new YuvToRgbConverter(context);
    }
}
