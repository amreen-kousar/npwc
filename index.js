/**
 * @format
 */
import { onAppBeginLaunch } from './src/Routing/launch-profiler';
onAppBeginLaunch();

import { AppRegistry, ActivityIndicator } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import firebase from '@react-native-firebase/app';



// Initialize Firebase
// firebase.initializeApp({
//     apiKey: "AIzaSyC1NK3z0ld2YlX_06MGGx0Es9tQw6Q1KVA",
//     authDomain: "npwc-app-68c21.firebaseapp.com",
//     projectId: "npwc-app-68c21",
//     storageBucket: "",
//     messagingSenderId: "817536742070",
//     appId: "1:817536742070:android:d1034ca6d8414fc8c6ec17",
//     measurementId: "G-9D5B1CJ7DQ",
//     databaseURL:""
// });

AppRegistry.registerComponent(appName, () => App);
