# HRMonitor
HRMonitor（心率監測）App written in React Native.

# Getting Started

Run the following code to install the necessary frameworks and components
    
```bash
yarn install
```

## Environment Setup

Please refer to the React Native [official page](https://reactnative.dev/docs/environment-setup#node--watchman) to complete the running environment configuration.

## Android Setup

When you complete the running environment configuration, run the following code to run the project on a simulator or an physical device.

```bash
yarn android
```

## iOS Setup


### Simulator

Open a new terminal inside your React Native project folder. Run the following command:

`npx react-native run-ios`

### Device

1. Plug in your device via USB[](https://reactnative.dev/docs/running-on-device#1-plug-in-your-device-via-usb)

    Connect your iOS device to your Mac using a USB to Lightning cable. Navigate to the `ios` folder in your project, open `.xcworkspace`, within it using Xcode.

    Open the **Product** menu from Xcode's menubar, then go to **Destination**. Look for and select your device from the list. Xcode will then register your device for development.

2. Configure code signing[](https://reactnative.dev/docs/running-on-device#2-configure-code-signing)

    Register for an [Apple developer account](https://developer.apple.com/) if you don't have one yet.

    Select your project in the Xcode Project Navigator, then select your main target (it should share the same name as your project). Look for the "General" tab. Go to "Signing" and make sure your Apple developer account or team is selected under the Team dropdown. Do the same for the tests target (it ends with Tests, and is below your main target).

    >💡 You can temporarily set the Bundle identifier to [program.polyu.](http://program.polyu.xxx/){$Product Name} and it will not affect the released Bundle identifier.


    **Repeat** this step for the **Tests** target in your project.

3. Build and Run your app[](https://reactnative.dev/docs/running-on-device#3-build-and-run-your-app)

    If everything is set up correctly, your device will be listed as the build target in the Xcode toolbar, and it will also appear in the Devices pane.

    You can now press the **Build and run** button (`⌘R`) or select **Run** from the **Product** menu. The Rebat app will launch on your device shortly.


## Screenshots


| Home Page                                                     | Ready to detect                                               | Detecting                                                     | Result Page                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| ![image](https://image.stephenfang.me/hrmonitor/IMG_4231.PNG) | ![image](https://image.stephenfang.me/hrmonitor/IMG_4232.PNG) | ![image](https://image.stephenfang.me/hrmonitor/IMG_4233.PNG) | ![image](https://image.stephenfang.me/hrmonitor/IMG_4234.PNG) |