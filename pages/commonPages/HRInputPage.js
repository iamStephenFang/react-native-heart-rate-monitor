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
    TextInput,
    BackHandler,
    ScrollView,
    View,
    Image
} from 'react-native';
import { colorStyle } from '../colorStyle';
import { Camera } from 'react-native-vision-camera';


export function HRInputPage({ navigation, route }) {
    const [text, setText] = React.useState("")

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

    function _onChangeText(val) {
        if (val.length > 3 || val.includes('.') || val.includes('/') || val.includes('-')) {
            return;
        } else {
            setText(val)
        }
    }
    const textdata = [
        { id: '1. ', text: <Text style={{ color: '#544343' }}>請按下<Text style={{ color: '#F76B43', fontWeight: '500' }}>「偵測心率」</Text>按鈕，並轉至偵測心率頁面。</Text> },
        { id: '2. ', text: '按照指示偵測心率。' },
        { id: '3. ', text: '記下結果' },
    ];

    const showPermissionsPage = cameraPermission !== 'authorized'

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colorStyle.Navigation.background }}>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <View style={{ backgroundColor: '#FFF1D7', margin: 20, borderRadius: 10, overflow: "hidden", padding: 20 }}>
                    <View style={{ flexDirection: 'row', margin: 5 }}>
                        <Text style={{ color: '#544343', fontSize: 20, textAlign: 'left', fontWeight: 'bold' }}>{textdata[0].id}</Text>
                        <Text style={{ color: '#544343', fontSize: 20, textAlign: 'left', fontWeight: '400' }}>{textdata[0].text}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', margin: 5 }}>
                        <Text style={{ color: '#544343', fontSize: 20, textAlign: 'left', fontWeight: 'bold' }}>{textdata[1].id}</Text>
                        <Text style={{ color: '#544343', fontSize: 20, textAlign: 'left', fontWeight: '400' }}>{textdata[1].text}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', margin: 5 }}>
                        <Text style={{ color: '#544343', fontSize: 20, textAlign: 'left', fontWeight: 'bold' }}>{textdata[2].id}</Text>
                        <Text style={{ color: '#544343', fontSize: 20, textAlign: 'left', fontWeight: '400' }}>{textdata[2].text}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 80 }}>
                    <TextInput
                        style={styles.input}
                        placeholder="按此輸入"
                        placeholderTextColor="#808080"
                        onChangeText={text => _onChangeText(text)}
                        keyboardType={'numeric'}
                        value={text}
                    />
                    <Image source={require('../../source/icons/input_icon.png')} style={{ width: 23, height: 23, alignSelf: 'center' }} />
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.heartRateButton} onPress={onOpenHR}>
                        <View style={{ alignItems: 'center', flexDirection: 'row', height: 60 }}>
                            <Text style={colorStyle.NavigateButton.Text}>{'偵測心率 '}</Text>
                            <Image source={require('../../source/icons/heart_icon.png')} style={{ width: 26, height: 22 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    input: {
        width: 280,
        color: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        textAlign: 'center',
        fontSize: 20,
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