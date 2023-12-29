/** Detecting heart rate
 * @format
 * @flow strict-local
*/
import React, { useEffect, useState, useCallback } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Linking
} from 'react-native';
import { colorStyle } from '../colorStyle';
import { Camera } from 'react-native-vision-camera';

export function HRMPermissionPage({ navigation, route }) {

    const [cameraPermissionStatus, setCameraPermissionStatus] = useState < CameraPermissionStatus > ('not-determined');

    useEffect(() => {
        if (cameraPermissionStatus === 'authorized') {
            navigation.replace('Monitor')
        }

        async function checkPermission() {
            cameraPermission = await Camera.getCameraPermissionStatus()
            console.log(cameraPermission)
        }

        checkPermission();
    })

    const requestCameraPermission = useCallback(async () => {
        console.log('Requesting camera permission...');
        const permission = await Camera.requestCameraPermission();
        console.log(`Camera permission status: ${permission}`);

        if (permission === 'denied') await Linking.openSettings();
        setCameraPermissionStatus(permission);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.permissionText}>
                「運動樂」需要
                <Text style={styles.camerePermissionText}> 相機權限</Text>.{' '}
            </Text>
            <Image
                style={{ width: 180, height: 180, alignSelf: 'center', margin: 100 }}
                source={require('../../source/camera.png')}
                resizeMode='contain'
            />
            <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{'打開相機'}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colorStyle.Navigation.background,
    },
    permissionText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#544343',
        textAlign: 'center',
    },
    camerePermissionText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF7B43',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#FF8C5A',
        padding: 16,
        marginHorizontal: 58,
        borderRadius: 20
    }
});