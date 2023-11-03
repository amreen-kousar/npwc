import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from "@react-navigation/native";

const Apploader = (props) => {

    const isFocused = useIsFocused();

    useEffect(() => {
        
        if (isFocused) {
        
            getLogin()
       }
    }, [isFocused])

    const getLogin = async () => {
        const token = await AsyncStorage.getItem("token")
       console.log(token)
        if (token) {
          
            props?.navigation?.replace("HomeScreen")
          
        }
        else {
            props?.navigation?.navigate("Login")
        }
    }


    return (
        <View>
            <ActivityIndicator size={"large"} />
        </View>
    )
}

export default Apploader

