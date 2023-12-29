/**
 * @format
 * @flow strict-local
*/
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    BackHandler
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import AnimateableText from 'react-native-animateable-text';
import Reanimated, { useSharedValue, useAnimatedProps, runOnJS } from 'react-native-reanimated';
import { getHeartRate } from '../utils/getHeartRate';
import ProgressCircle from 'react-native-progress-circle'
import { colorStyle } from '../colorStyle';

export function HRMonitorPage({ navigation, route }) {
    const totalFramesCount = 350
    const [state, setState] = useState('BEGIN')
    const [percent, setPercent] = useState(0)

    // UI Elements State
    const descText = useSharedValue('用食指蓋住後置攝像頭，保持食指不動')
    const titleText = useSharedValue('準備檢測')

    const descProps = useAnimatedProps(() => {
        return {
            text: descText.value,
        };
    });
    const titleProps = useAnimatedProps(() => {
        return {
            text: titleText.value
        };
    });

    const stopRecording = () => {
        setPercent(100)
        setState("END")
    }

    const updatePercent = (count) => {
        const totalFrames = totalFramesCount
        if (count > totalFrames * 0.95) {
            setPercent(95)
        } else {
            setPercent(count * 100 / totalFrames)
        }
    }

    const devices = useCameraDevices('wide-angle-camera')
    const device = devices.back

    const counter = useSharedValue(0)

    const frameProcessor = useFrameProcessor(
        frame => {
            'worklet';

            const HR = getHeartRate(frame, counter.value == 0 ? 'true' : 'false')
            counter.value += 1
            if (HR == null) {
                console.log('HR is null')
                return
            }
            console.log('Pulse %d, State %s, Count %d', HR.BPM, HR.state, HR.count)
            runOnJS(updatePercent)(HR.count)

            if (HR.count >= totalFramesCount && HR.BPM !== -60) {
                runOnJS(stopRecording)()
                descText.value = '請記下結果，按「完成」按鈕回到上一個頁面。'
                titleText.value = `${HR.BPM} BPM`
                return
            }

            if (HR.state == "RECORDING") {
                titleText.value = '檢測中'
            } else {
                titleText.value = '準備檢測'
            }
        }, [])

    useEffect(() => {
        changeKeepAwake(true)
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true
            }

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            }
        }, [])
    );

    // Navigation
    async function onNext() {
        changeKeepAwake(false)
        navigation.goBack()
    }

    // KeepAwake
    function changeKeepAwake(shouldBeAwake) {
        if (shouldBeAwake) {
            KeepAwake.activate();
        } else {
            KeepAwake.deactivate();
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.camera}>
                    {device != null && <Camera
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={state !== "END"}
                        fps={30}
                        torch={'on'}
                        frameProcessor={frameProcessor}
                    />
                    }
                </View>
                <Reanimated.View style={styles.guideArea}>
                    <ProgressCircle
                        percent={percent}
                        radius={138}
                        borderWidth={10}
                        color="#FF6359"
                        shadowColor="#FFE5BD"
                        bgColor={colorStyle.Navigation.background}
                    >
                        {state != 'END' &&
                            <Image
                                style={{ width: 190, height: 190, alignItems: 'center', margin: 100 }}
                                source={require('../../source/finger.png')}
                                resizeMode='contain'
                            />
                        }
                        {state == 'END' &&
                            <Image
                                style={{ width: 190, height: 190, alignItems: 'center', margin: 100 }}
                                source={require('../../source/heart.png')}
                                resizeMode='contain'
                            />
                        }
                    </ProgressCircle>
                    <AnimateableText style={styles.guideTitle} animatedProps={titleProps} />
                    <AnimateableText style={styles.guideSubtitle} animatedProps={descProps} />
                </Reanimated.View>

                {state == 'END' &&
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onNext}
                    >
                        <Text style={styles.buttonText}>{'完成'}</Text>
                    </TouchableOpacity>
                }
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: colorStyle.Navigation.background,
    },
    guideArea: {
        marginTop: 20,
        alignItems: 'center',
    },
    guideTitle: {
        color: '#FF7B43',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20
    },
    guideSubtitle: {
        color: '#544343',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 32
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#FF8C5A',
        borderRadius: 20,
        padding: 15,
        marginTop: 40,
        marginHorizontal: 58
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    camera: {
        alignSelf: 'stretch',
        textAlign: 'center',
        height: 142,
    },
});