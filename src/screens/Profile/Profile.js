import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { View, StyleSheet, Text, Image, Pressable, FlatList, SafeAreaView, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { mainColors } from '../../colors/color-map';
// import Dropdown from '../Components/Dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import Frame from "../../assets/icons/Frame.svg";
import AsyncStorage from '@react-native-async-storage/async-storage'

const Profile = ({ route, navigation }) => {


  const [username, setusername] = useState('')
  const [userId, setuserId] = useState('')
  const [email, setEmail] = useState('')
  var [userDetails, setUserDetails] = useState(null)

  useEffect(() => {

    setValues()

  }, [])

  const logout = async () => {
    await AsyncStorage.clear()
    navigation.navigate('Login')
  }



  const setValues = async () => {
    // let uname = await AsyncStorage.getItem('Username')
    let uid = await AsyncStorage.getItem('userId')
    // let email=await AsyncStorage.getItem('email')
    // await setusername(uname)
    // await setuserId(uid)
    // await setEmail(email)
    axios.get(`https://novapwc.com/api/userDetails?user_id=${uid}`)
      .then(function (response) {
        // { "Code": "200", "Message": "Success", "Status": "OK", "data": [{ "address": "Have", "email_id": "Kousar@gmail.com", "gender": "male", "mobile_number": "8919907863", "profile_image": "/api/img/Kousar@gmail.com.jpg", "role": "user", "status": "active", "user_id": 217, "user_name": "Kousar" }] } 
        console.log(response?.data?.data, "response from apiii")
        userDetails = response?.data?.data[0]
        setUserDetails(userDetails)
        // closeBackdrop(servings, item)
      })
      .catch(function (error) {
        // Alert.alert("something went wrong");
        // console.log(error);
      });

  }




  return (
    <ScrollView style={styles.container}>
      {
        Platform.OS === 'ios' &&
        <View style={{ marginTop: 50, }}>
        </View>
      }
      <View style={{ marginLeft: 10 }}>
        <Pressable onPress={() => { navigation.goBack(); }}>
          <Text style={styles.titleText} ><Icon size={30} name='angle-left' /></Text>
        </Pressable>
      </View>
      {/* {console.log(userDetails, "user")} */}
      {
        userDetails && <View style={{height:700}}>
          <View style={{ alignItems: "center", marginTop: 50 }}>
            {console.log(userDetails?.profile_image, "image", `https://novapwc.com${userDetails?.profile_image}`)}
            <View style={{ backgroundColor: "#D1A6E7", padding: 20, borderRadius: 50 }}>
              {
                !userDetails?.profile_image ? < Image

                  style={styles.cancel}
                  source={{ uri: `https://novapwc.com${userDetails?.profile_image}` }} /> :
                  < Image style={styles.cancel}
                    source={require("../../assets/icons/camera.png")}
                  />
              }
            </View>
          </View>

          <View style={{ alignItems: "center", marginTop: 30 }}>
            <Text style={styles.heading}>{userDetails?.user_name}</Text>
          </View>

          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Text style={{ fontSize: 13, color: "black" }}>{userDetails?.email_id} </Text>
            <Text style={{ fontSize: 13, color: "black", marginTop: 20, }}>{userDetails?.mobile_number} </Text>
            <Text style={{ fontSize: 13, color: "black", marginTop: 20, fontWeight: 700 }}>{userDetails?.status} </Text>
          </View>



          <Pressable style={styles.buttonvw} onPress={logout}>
            <Text allowFontScaling={false} style={styles.textApple}>
              Logout
            </Text>
          </Pressable>



        </View>
      }



    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    // marginTop: Platform.OS === 'ios' && 50,
    flex: 1,
  },
  heading: {
    fontWeight: '600',
    fontSize: 50,
    color: "black"
  },
  buttonvw: {
    width: 328,
    height: 44,
    top: 20,
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
})

export default Profile;