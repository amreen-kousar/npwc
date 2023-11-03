import { View, Text, StyleSheet, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { mainColors } from '../../colors/color-map'
import AsyncStorage from '@react-native-async-storage/async-storage'

import axios from 'axios'
const DetailItem = ({ item, closeBackdrop, route }) => {

    const [servings, setServings] = useState(1)
    const [date, setDate] = useState(null)
    // console.log(item)

    useEffect(() => {
        getCurrentDate()
    }, [])


    const getCurrentDate = () => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        if (date < 10) date = '0' + date;
        if (month < 10) month = '0' + month;
        setDate(date + '-' + month + '-' + year);//format: d-m-y;
    }



    const saveDailyIntake = async () => {
        let userIdAsync = await AsyncStorage.getItem('userId')


        let data = {
            "user_id": parseInt(userIdAsync),
            "date": date,
            "diet_id": item.diet_id.diet_id,
            "item_id": item.item_id,
            "type": item.type,
            "category": item?.category,
            "servings_consumed": servings
        }

        console.log(data, "posr requestrrrrtt")
        axios.post(`https://novapwc.com/api/updateDailyIntake`, data)
            .then(function (response) {

                console.log(response?.data, "response from apiii")
                closeBackdrop(servings, item)
            })
            .catch(function (error) {
                // Alert.alert("something went wrong");
                // console.log(error);
            });



    }
    return (
        <View style={styles.container}>
            <View flexDirection="row" alignItems="center" marginBottom={40}>
                <View>
                    <Text>Image</Text>
                </View>
                <View marginLeft={20}>
                    <Text style={styles.heading}>{item.item_name} </Text>
                    <Text style={{ color: "black" }}>{item.description}</Text>
                </View>
            </View>


            <Text style={{ color: "black" }}>Select servings</Text>
            <View flexDirection="row" alignItems="center" top={20}>
                <View flex={1}>
                    <View flexDirection="row" alignItems="center" >
                        <Pressable onPress={() => { servings >= 1 && setServings(prev => prev - 1) }}>
                            <Text style={{ fontSize: 20 }}> - </Text>
                        </Pressable>

                        <View style={styles.card}>
                            <Text style={{ color: "black" }}>{servings}</Text>
                        </View>

                        <Pressable onPress={() => { setServings(prev => prev + 1) }}>
                            <Text style={{ fontSize: 20, color: "black" }}> + </Text>
                        </Pressable>
                    </View>
                </View>
                <View marginLeft={20}>
                    <Pressable onPress={() => { saveDailyIntake() }}>
                        <View style={styles.button}>
                            <Text style={{ color: "white", fontWeight: '700', fontSize: 20 }}>Save</Text>
                        </View>
                    </Pressable>
                </View>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 30,
    },
    heading: {
        fontSize: 22,
        marginBottom: 10,
        color: 'black'

    },
    card: {
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        padding: 10,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 5,

    },
    input: {
        height: 35,
        width: 35,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        borderColor: "#C8CEDD",
        fontFamily: "Inter-Regular",
        fontSize: 14,
        color: "black"
    },
    button: {
        backgroundColor: "#03A3E4",
        borderRadius: 10,
        padding: 10,
        width: 150,
        height: 70,
        alignItems: "center",
        justifyContent: "center"
    }
})
export default DetailItem