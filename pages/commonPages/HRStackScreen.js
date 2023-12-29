import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HRMonitorPage } from './HRMonitorPage';
import { HRMPermissionPage } from './HRMPermissionPage';
import { HRInputPage } from './HRInputPage';

const HRStack = createNativeStackNavigator();
export function HRStackScreen({ navigation }) {
    return (
        <HRStack.Navigator
            initialRouteName={"Input"}>
            <HRStack.Screen
                name="Input"
                component={HRInputPage}
                options={({ route }) => ({
                    headerShown: false,
                    lazy: false,
                })} />
            <HRStack.Screen
                name="Permission"
                component={HRMPermissionPage}
                options={({ route }) => ({
                    headerShown: false,
                    lazy: false,
                })} />
            <HRStack.Screen
                name="Monitor"
                component={HRMonitorPage}
                options={({ route }) => ({
                    headerShown: false,
                    lazy: false,
                })} />
        </HRStack.Navigator >
    )
}