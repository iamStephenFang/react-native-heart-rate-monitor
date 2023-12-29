/**
 * @format
 * @flow strict-local
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { HRStackScreen } from './pages/commonPages/HRStackScreen';


const App = () => {
    return (
        <NavigationContainer>
            <HRStackScreen />
        </NavigationContainer>
    );
};

export default App;