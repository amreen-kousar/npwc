import React, { useState, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    Button,
    View,
    SafeAreaView,
    Text,
    Alert,
    TextInput,
    Pressable,
    TouchableOpacity, ActivityIndicator, Image
    , KeyboardAvoidingView
} from 'react-native';
import Logo from '../../assets/icons/Frame.svg';
import axios from 'axios'
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import { ImagePickerModal } from "./ImagePickerModal";
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Register = ({ navigation }) => {
    const [visible, setVisible] = useState(false);
    const [image, setImage] = useState('')
    const [response, setResponse] = useState()
    const [fcm, setFcm] = useState('')
    var [formValue, setFormValue] = useState({
        "user_name": " ",
        "password": " ",
        "role": "user",
        "gender": "male",
        "mobile_number": " ",
        "email_id": " ",
        "address": " ",
    })
    useEffect(() => {
        // getDeviceToken()
    }, [])

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

    const getDeviceToken = async () => {
        const settings = await notifee.requestPermission();
        // setIsEnabled(settings.authorizationStatus == 1 ? true : false)
        const fcmToken = await messaging().getToken();
        __DEV__ && console.log('FCMtoken-firebase--', fcmToken);
        AsyncStorage.setItem('fcmToken', fcmToken)
        setFcm(fcmToken)
        firebaseNotificationListeners();
    }

    const onImageLibraryPress = useCallback(() => {
        const options = {
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: true,
            quality: 0.2,
            maxWidth: 500,
            maxHeight: 200
        };
        launchImageLibrary(options, (itm) => {

            if (itm?.assets) {
                setImage(itm?.assets[0]?.base64)
                if (!itm?.assets[0]?.base64) {
                    Alert.alert("This image can't be uploaded , Please select another image ")
                    setImage("")
                }
            }
            setVisible(false)
        });
    }, []);

    const onCameraPress = useCallback(() => {
        const options = {
            saveToPhotos: true,
            mediaType: 'photo',
            includeBase64: true,

        };
        launchCamera(options, setPickerResponse);
    }, []);


    const registerUser = () => {
        let validation = Object.values(formValue)
        if (validation.includes(" ")) {
            Alert.alert("Fill all the fields")
        }
        else {
            formValue.profile_image = image
            formValue.fcm_token = 'clxA5TEFTJy8NYn-JNJiLG:APA91bFi9xZ9WYiQ5wI4gS6rIjm0mRTaYvNuhKk2yQhz0ECeRXnYL31cwz7qxTGoPtu_rv-dhTAytiaj6bIIzDPQ1HfPS6ImErW94ptzf9Xc2q3CGV5LwrP_MfUFPpTc2pCq7kbBQzXi'
            setFormValue(formValue)
            console.log(formValue, "form value in register user")
            axios.post(`https://novapwc.com/api/registerUser`, formValue)
                .then(function (response) {
                    AsyncStorage.clear();
                    // console.log(response?.data, "responseeeeeee")
                    Alert.alert("Successfully registered")
                    navigation.navigate('Login')
                })
                .catch(function (error) {
                    Alert.alert("Mail already exists");
                    console.log(error);
                });
        }
    }
    return (

        <KeyboardAvoidingView style={styles.container}>

            <ScrollView showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>

                <View style={styles.logovw}>
                    <Logo style={styles.logop} />
                </View>

                <View>
                    {
                        image === "" ?
                            <TouchableOpacity onPress={() => { setVisible(true) }}>
                                <View style={{ alignItems: "center" }}>
                                    <View style={{ backgroundColor: "#f5f5f5", padding: 20, borderRadius: 50 }}>
                                        < Image style={styles.cancel}
                                            source={require("../../assets/icons/camera.png")}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={() => { setImage(''); setVisible(true) }}>
                                <View style={{ alignItems: "center" }}>
                                    <View style={{ backgroundColor: "#f5f5f5", borderRadius: 50 }}>
                                        < Image style={{ height: 100, width: 100, borderRadius: 50 }} source={{ uri: "data:image/png;base64," + image }} />
                                    </View>
                                </View>



                                {/* <View>
                                    <TouchableOpacity onPress={() => { setImage('') }}>
                                      
                                        < Text style={styles.canceltxt} >
                                            Close
                                        </Text>
                                    </TouchableOpacity>
                                    {console.log(image, "imaggegeee")}
                                    < Image style={{ height: 50, width: 50 }} source={{ uri: "data:image/png;base64," + image }} />
                                </View> */}



                            </TouchableOpacity>


                    }
                    < ImagePickerModal
                        isVisible={visible}
                        onClose={() => setVisible(false)}
                        onImageLibraryPress={onImageLibraryPress}
                        onCameraPress={onCameraPress}
                    />
                </View>

                <View style={{ marginTop: 100 }}>

                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#8E9AA7"
                        placeholder="User name"
                        keyboardType="default"
                        onChangeText={(e) => { setFormValue({ ...formValue, user_name: e }) }}
                    />



                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#8E9AA7"
                        placeholder="Email ID"
                        keyboardType="default"
                        onChangeText={(e) => { setFormValue({ ...formValue, email_id: e }) }}
                    />
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#8E9AA7"
                        placeholder="Mobile number"
                        keyboardType="default"
                        onChangeText={(e) => { setFormValue({ ...formValue, mobile_number: e }) }}
                    />

                    <View flexDirection="row" justifyContent="space-around" top={-40}>
                        <View flexDirection="row" alignItems="center">
                            <Pressable onPress={() => {
                                setFormValue({ ...formValue, gender: 'male' })
                            }}>
                                <View style={[{
                                    height: 24,
                                    width: 24,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: '#702963',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }]}>
                                    {
                                        formValue.gender == 'male' ?
                                            <View style={{
                                                height: 12,
                                                width: 12,
                                                borderRadius: 6,
                                                backgroundColor: '#702963',
                                            }} />
                                            : null
                                    }
                                </View>

                            </Pressable>
                            <Text style={styles.ratetxt}>Male</Text>
                        </View>

                        <View flexDirection="row" alignItems="center">
                            <Pressable onPress={() => { setFormValue({ ...formValue, gender: 'female' }) }}>
                                <View style={[{
                                    height: 24,
                                    width: 24,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: '#702963',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }]}>
                                    {
                                        formValue.gender == 'female' ?
                                            <View style={{
                                                height: 12,
                                                width: 12,
                                                borderRadius: 6,
                                                backgroundColor: '#702963',
                                            }} />
                                            : null
                                    }
                                </View>

                            </Pressable>
                            <Text style={styles.ratetxt}>Female</Text>
                        </View>
                    </View>





                    <View >

                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#8E9AA7"
                            placeholder="Address"
                            keyboardType="default"
                            onChangeText={(e) => { setFormValue({ ...formValue, address: e }) }}
                        />
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#8E9AA7"
                            placeholder="password"
                            keyboardType="default"
                            onChangeText={(e) => { setFormValue({ ...formValue, password: e }) }}
                        />



                    </View>



                    <View style={styles.buttonvw}>
                        <Pressable onPress={registerUser}>
                            <Text allowFontScaling={false} style={styles.textApple}>
                                Create Account
                            </Text>
                        </Pressable>

                    </View>
                    <View style={{ marginTop: 30 }} >
                        <Pressable onPress={() => { navigation.navigate('Login') }}>
                            <View style={{ alignSelf: "center" }}>
                                <Text style={{ fontSize: 20, color: "black" }}> Already have an Account ? </Text>
                            </View>
                        </Pressable>
                    </View>


                    {/* <Text>hellooooo</Text>
                   

                    <View style={styles.buttonvw}>
                        <Text>hellop</Text>
                    </View> */}





                </View>

            </ScrollView>

        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 35

    },
    logovw: {
        alignItems: 'flex-start',
        marginLeft: 14

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
        marginTop: 10,
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
    ratetxt: {
        fontFamily: "Inter-SemiBold",
        // fontStyle: 'normal',
        fontWeight: "600",
        fontSize: 14,
        marginLeft: 10,
        color: 'black',
    },
    cancel: {
        // top: -60
    }
});

export default Register;