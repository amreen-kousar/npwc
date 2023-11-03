import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
  TextInput,
  Pressable,
  ActivityIndicator
} from 'react-native';
import Logo from '../../assets/icons/Frame.svg';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from "@react-navigation/native";
import notifee, {
  EventType,
  AndroidColor,
  AndroidImportance,
} from '@notifee/react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

const Login = ({ navigation }) => {
  useEffect(() => {
    getDeviceToken()
  }, [])
  const [fcm, setFcm] = useState('fcmtoken')

  const [response, setResponse] = useState()
  const [loginStatus, setLoginStatus] = useState('Login')
  const [formValue, setFormValue] = useState({ email_id: "", password: "" })
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {

      setLoginStatus("Login")
    }
  }, [isFocused])


  const loginUser = () => {
    console.log('login', formValue,fcm)
    AsyncStorage.clear()
    if (formValue.email_id == '' || formValue.password == '') {
      Alert.alert('Fill all the fields')
    }
    else {
      formValue.fcm_token = fcm
      setFormValue(formValue)
      console.log(formValue, "hello")
      axios.post(`https://novapwc.com/api/login`, formValue)
        .then(function (response) {
          setLoginStatus('Signing In please wait ! ')
          console.log(response?.data, "responseeeeeee")
          if (response?.data?.Status) {
            console.log(response?.data?.Username)
            response.data['User ID'] = response?.data['User ID'].toString()
            AsyncStorage.setItem('Username', response?.data?.Username)
            AsyncStorage.setItem('email', formValue.email_id)
            AsyncStorage.setItem('token', response?.data?.Token)
            AsyncStorage.setItem('userId', response?.data['User ID'])
            navigation.navigate('HomeScreen')
          }
          else {
            Alert.alert('Invalid mail or password')
            setLoginStatus('Login')
            // setResponse(response?.data?.Message)
          }
        })
        .catch(function (error) {

          Alert.alert("Backend issue\n" +
            error);
          console.log(error);
        });
    }
  }


  const getDeviceToken = async () => {
    const settings = await notifee.requestPermission();
    // setIsEnabled(settings.authorizationStatus == 1 ? true : false)
    const fcmToken = await messaging().getToken();
    
    __DEV__ && console.log('FCMtoken-firebase--', fcmToken);
    AsyncStorage.setItem('fcmToken', fcmToken)
    console.log(fcmToken)
    setFcm(fcmToken)
    firebaseNotificationListeners();
  }
  const firebaseNotificationListeners = () => {
    //background firbaseNotifications
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      __DEV__ && console.log('Message handled in the background!---->Home', remoteMessage);
    });

    //foreground firbaseNotifications
    messaging().onMessage(async remoteMessage => {
      __DEV__ && console.log('fcm-test-onMessage-->123', remoteMessage);
      displayImcomingNotification(remoteMessage)
        .then(res => {
          // navigation.navigate(AppRoutes.NotificationDetail, { id: '23467bc74wcrb7' })
        }).catch(() => { });
    });

    //Background on tap firbaseNotifications
    messaging().onNotificationOpenedApp(remoteMessage => {
      __DEV__ && console.log('fcm-test-onNotificationOpenedApp ', remoteMessage);
      // navigation.navigate(AppRoutes.NotificationDetail, { id: '23467bc74wcrb7' })
    });

    //On tap Kill State firbaseNotifications when remoteMessage is not null
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        __DEV__ && console.log('fcm-test-onMessage Background,remoteMessage', remoteMessage);
        // if (remoteMessage) {
        //   setTimeout(() => {
        //     navigation.navigate(AppRoutes.NotificationDetail, { id: '23467bc74wcrb7' })
        //   }, 500);
        // }
      });
  };
  const displayImcomingNotification = async (remoteMessage) => {
    return new Promise(async (resolve, reject) => {
      const channelId = await notifee.createChannel({
        id: 'com.nova',
        name: 'Default Channel',
        vibration: true,
        lights: true,
        lightColor: AndroidColor.RED,
      });
      await notifee.displayNotification({
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        ios: {
          categoryId: 'post',
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            sound: true,
          },
        },
        android: {
          channelId,
          autoCancel: false,
          smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
      });
      await notifee.incrementBadgeCount();
      //setbadgeNumber(1)
      notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
          // navigation.navigate(AppRoutes.NotificationDetail, { id: '23467bc74wcrb7' })
          resolve(true)
        }
      });
      notifee.onBackgroundEvent(async ({ type, detail }) => {
        const { notification, pressAction } = detail;
        if (type === EventType.PRESS) {
          resolve(true)
        }
        // Check if the user pressed the "Mark as read" action
        if (type === EventType.ACTION_PRESS && pressAction?.id === 'mark-as-read') {
          // Decrement the count by 1
          await notifee.decrementBadgeCount();
          // Remove the notification
          await notifee.cancelAllNotifications();
        }
      });
    })
  }
  return (

    <SafeAreaView style={styles.container}>
      {/* <TextInput  >{fcm}</TextInput> */}

      <View>

        <View style={styles.logovw}>
          <Logo style={styles.logop} />
        </View>

        <View flexDirection={'column'}>
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E9AA7"
            placeholder="Email ID"
            keyboardType="default"
            onChangeText={(e) => { setFormValue({ ...formValue, email_id: e }); setLoginStatus('Login') }}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E9AA7"
            placeholder="Password"
            keyboardType="default"
            onChangeText={(e) => { setFormValue({ ...formValue, password: e }); setLoginStatus('Login') }}
          />
        </View>

        {/* <View style={{ alignItems: "center", top: -10, fontWeight: 700, color: 'red' }}>

          <Text >{response}</Text>
        </View> */}

        <Pressable style={styles.buttonvw} onPress={loginUser}>
          <Text allowFontScaling={false} style={styles.textApple}>
            {loginStatus}
          </Text>
        </Pressable>


        <Pressable style={{ top: 120, }} onPress={() => { navigation.navigate('Register') }}>
          <View style={{ alignSelf: "center", padding: 6, borderRadius: 10 }}>
            <Text style={{ fontSize: 20 }}> Create an account .</Text>
          </View>
        </Pressable>

      </View>

    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#fff"
  },
  logovw: {
    alignItems: 'center',
    marginBottom: 40
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    top: '-16%',
    color: '#112866',
    borderColor: "#C8CEDD",
    fontFamily: "Inter-Regular",
    fontSize: 14,
    backgroundColor: '#fff'
  },
  buttonvw: {
    width: 328,
    height: 44,
    // top: 50,
    backgroundColor: "#702963",
    borderRadius: 12,
    alignSelf: "center",
    borderWidth: 2.6,
    borderColor: "#F6F8FB",
  },
  textApple: {
    fontFamily: "Inter-Regular",
    fontWeight: "600",
    fontSize: 14,
    top: 11,
    color: "#fff",
    justifyContent: "center",
    textAlign: "center",
  },
});

export default Login;