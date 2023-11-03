import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import {createStackNavigator} from '@react-navigation/stack';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTab from './BottomTab';
import { colors } from '../colors/color-map';
// import CreateFavorite from '../Routing/BottomTab'

import { onAppEndLaunch } from './launch-profiler';
import { getScreenBuilder } from './ScreenRegistry';
const Stack = createNativeStackNavigator();
// const Stack = createStackNavigator();

export default function Main() {
  const [emails, setEmail] = useState()


  useEffect(() => {
    requestAnimationFrame(() => {
      onAppEndLaunch();
    });
  }, []);

  console.log('💀 re-rendering Main.jsx');


  return (

    <Stack.Navigator
      initialRouteName={"AppLoader"}
      screenOptions={{
        headerMode: 'screen',
      }}>
      <Stack.Screen
    name="AppLoader"
    getComponent={getScreenBuilder('AppLoader')}
    options={{headerShown: false}}
  />
      <Stack.Screen
        name="Login"
        getComponent={getScreenBuilder('Login')}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        getComponent={getScreenBuilder('Register')}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={BottomTab}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="Home" getComponent={getScreenBuilder('Home')} options={{ headerShown: false }} />
      <Stack.Screen name="Diet" getComponent={getScreenBuilder('Diet')} options={{ headerShown: false }} />


      <Stack.Screen name="Profile" getComponent={getScreenBuilder('Profile')} options={{ headerShown: false }} />

      
      <Stack.Screen
        name="ItemsOfCategory"
        getComponent={getScreenBuilder('ItemsOfCategory')}
        options={{
          headerShown: false,
        }}
      />

      
      <Stack.Screen
        name="SetsOfCategory"
        getComponent={getScreenBuilder('SetsOfCategory')}
        options={{
          headerShown: false,
        }}
      />







    </Stack.Navigator>

  );
}
