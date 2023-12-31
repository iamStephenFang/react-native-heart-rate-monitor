/**
 * @format
 * @flow strict-local
*/
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
    BackHandler,
    View,
    Image
} from 'react-native';
import { colorStyle } from '../colorStyle';
import { Camera } from 'react-native-vision-camera';


export function HRInputPage({ navigation, route }) {
    const [cameraPermission, setCameraPermission] = useState < CameraPermissionStatus > ('not-determined');

    useEffect(() => {
        Camera.getCameraPermissionStatus().then(setCameraPermission);
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                console.log('onBackPressed')
                return true
            }

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            }
        }, [])
    );


    function onOpenHR() {
        navigation.push(showPermissionsPage ? 'Permission' : 'Monitor')
    }

    const showPermissionsPage = cameraPermission !== 'authorized'

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ backgroundColor: '#FFF1D7', margin: 20, borderRadius: 10, overflow: "hidden", padding: 20 }}>
                <View style={{ flexDirection: 'row', margin: 5 }}>
                    <Text style={{ color: '#544343', fontSize: 20, textAlign: 'left', fontWeight: 'bold' }}>{'1. '}</Text>
                    <Text style={{ color: '#544343', fontSize: 20, textAlign: 'left', fontWeight: '400' }}>{<Text style={{ color: '#544343' }}>請按下<Text style={{ color: '#F76B43', fontWeight: '500' }}>「偵測心率」</Text>按鈕，並轉至偵測心率頁面。</Text>}</Text>
                </View>
                <View style={{ flexDirection: 'row', margin: 5 }}>
                    <Text style={{ color: '#544343', fontSize: 20, textAlign: 'left', fontWeight: 'bold' }}>{'2. '}</Text>
                    <Text style={{ color: '#544343', fontSize: 20, textAlign: 'left', fontWeight: '400' }}>{'按照指示偵測心率。'}</Text>
                </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style={styles.heartRateButton} onPress={onOpenHR}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', height: 60 }}>
                        <Text style={colorStyle.NavigateButton.Text}>{'偵測心率 '}</Text>
                        <Image source={require('../../source/heart_icon.png')} style={{ width: 26, height: 22 }} />
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colorStyle.Navigation.background,
    },
    heartRateButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colorStyle.HRButton.background,
        marginVertical: 56,
        borderRadius: 20,
        height: 60,
        width: 274
    },
})