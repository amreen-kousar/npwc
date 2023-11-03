import React, { useState, useEffect } from 'react';
import FontIconAwesome from 'react-native-vector-icons/FontAwesome';

import axios from 'axios'
import {
  Text, StyleSheet, Platform, View, Image, Button, Pressable, FlatList, ScrollView
  , Alert
  , ActivityIndicator, RefreshControl
} from 'react-native';
import Frame from "../../assets/icons/Frame.svg";
import Dropdown from '../Home/Components/DropdownComponent';
import { mainColors } from '../../colors/color-map';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from "@react-navigation/native";

const Diet = ({ navigation }) => {


  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})
  const [dietData, setDietData] = useState([])
  const [oneDietPlan, setOneDietPlan] = useState([])
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (isFocused) {
      getValues()
    }
  }, [isFocused])

  const getValues = async () => {
    // console.log("getValuess calledddd")
    let start_date = await AsyncStorage.getItem('exercisestartDate')
    let end_date = await AsyncStorage.getItem('exerciseendDate')
    await apiCall(start_date, end_date)
  }


  const apiCall = async (start_date, end_date) => {
    setLoading(true)
    let userIdAsync = await AsyncStorage.getItem('userId')
    // console.log(start_date, end_date)
    if (start_date) {
      axios.get(`https://novapwc.com/api/getAllDietPlan?userid=${userIdAsync}&startdate=${start_date}&enddate=${end_date}&type=exercise&status=today`)
        .then(function (response) {

          if (response?.data?.data) {
            // console.log(response.data.data, "dieettttttttttt")
            response.data.data.servingsLeft = parseInt
              (response?.data?.data.RecommendedServings - response?.data?.data.CosumedServings)
            setDietData(response?.data?.data)
            // console.log(data)
            axios.get(`https://novapwc.com/api/getOneDietPlan?userid=${userIdAsync}`)
              .then(function (response) {
                response.data.data = response?.data?.data.filter(e => e.type == 'exercise')
                let resDietPlan = response?.data?.data
                // console.log(response?.data?.data, "one diet plannnn")
                // setOneDietPlan(response?.data?.data)
                if (resDietPlan.length == 0) {
                  setLoading(false)
                  setRefreshing(false)
                }
                axios.get(`https://novapwc.com/api/getAllCategories?type=exercise`)
                  .then(function (response) {

                    let existingCategories = response?.data?.data.map(e => e.category_name)

                    setData(response?.data?.data)
                    //  [{"category": "Pawan android", "diet_id": 709, "end_date": "08-23-2023", "interval": "2 month", "recommended_servings": 12, "servings_consumed": 0, "start_date": "05-25-2023", "total_servings": 1080, "type": "food", "user_id": 35}]} 
                    // console.log(response?.data?.data)
                    let dietPlan = [], dietCategories = []
                    for (let i = 0; i < resDietPlan.length; i++) {
                      let obj = resDietPlan[i];
                      if (existingCategories.includes(obj?.category)) {
                        if (dietCategories.includes(obj?.category)) {
                          let index = dietPlan.findIndex((x) => x.category === obj?.category)
                          dietPlan[index].servings_consumed = dietPlan[index].servings_consumed + obj?.servings_consumed
                        }
                        else {
                          dietCategories.push(obj?.category)
                          dietPlan.push(obj)
                        }
                      }
                      if (i == resDietPlan.length - 1) {
                        // console.log(dietPlan)
                        setLoading(false)
                        setRefreshing(false)
                        setOneDietPlan(dietPlan)
                      }
                    }

                  })
                  .catch(function (error) {
                    // Alert.alert("something went wrong");
                    // console.log(error);
                  });
                // console.log(response?.data, "response..............responseeeeee in get one diet plannnnn")
              })
              .catch(function (error) {
                // Alert.alert("something went wrong");
                // console.log(error);
              });
          }
          else {
            setLoading(false)
            setRefreshing(false)
          }


        })
        .catch(function (error) {
          // Alert.alert("something went wrong");
          // console.log(error);
        });
    }
    else {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    getValues()
  }


  const getCurrentDate = () => {

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    if (date < 10) date = '0' + date;
    if (month < 10) month = '0' + month;
    return date + '-' + month + '-' + year;//format: d-m-y;
  }


  const convertNumber = (num, name) => {
    if (num < 0) {
      return <Text style={styles.white}><Text style={styles.gold}> {Math.abs(num)}</Text>  {name}  exceeded</Text>
    }
    else {
      return <Text style={styles.white}><Text style={styles.gold}> {Math.abs(num)}</Text> {name}  left</Text>
    }
  }




  const setDietId = (item) => {
    let catid = data.filter(e => e.category_name == item.category)
    let id = null
    if (catid) { id = catid[0].category_id }
    navigation.navigate('SetsOfCategory',
      { cat: id, diet_id: item.diet_id, category: item.category, type: "exercise", servingsConsumed: item.servings_consumed, apiCall: apiCall, recommendedServings: item.recommended_servings }
    )
  }





  return (
    <View style={styles.container}>

      {
        Platform.OS === 'ios' &&
        <View style={{ marginTop: 50, }}>
        </View>
      }

      <View flexDirection="row" alignItems='center' justifyContent="space-between">
        <Frame />
        <Pressable onPress={() => { navigation.navigate("Profile") }}>
          <View style={{ marginRight: 10 }}>
            <FontIconAwesome name="user-circle-o" color='#BB8ED1' size={30} />

          </View>
        </Pressable>
      </View>

      <View flexDirection="row">
        <Text style={styles.titleText} >Exercise Plan</Text>
      </View>

      <ScrollView showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
      >
        {
          loading ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 100 }}><Text> <ActivityIndicator color="#1b1c1e" /></Text></View> : <View>
            {
              (dietData?.Type) ? <View>
                <View style={[styles.cardIn, styles.mainCard]}>
                  <View style={styles.rowDirection}>

                    <View style={[styles.card, styles.mainInCard]}>
                      <Text style={styles.header}>{getCurrentDate()}</Text>
                    </View>
                    <View style={[styles.card, styles.mainInCard]}>
                      <Text style={{ color: "black" }}>Today's exercise{"\n"}<Text style={styles.heading}>
                        {dietData?.RecommendedServings} </Text>sets</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.card, styles.blackCard, styles.rowDirection, { justifyContent: "space-around" }]}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {convertNumber(dietData.servingsLeft, "sets")}

                  </View>

                  <View>
                    <Image style={styles.exerciseLogo} source={require("../../assets/images/exerciselogo.png")}></Image>

                  </View>
                </View>




                <FlatList
                  contentContainerStyle={{ paddingBottom: 20 }}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  data={oneDietPlan}
                  ListEmptyComponent={() => {
                    return (
                      <View style={{ alignItems: "center", marginTop: 100 }}>{loading ? <Text><ActivityIndicator /></Text> : <Text>No categories assigned</Text>}</View>
                    )
                  }}

                  renderItem={({ item }) => (
                    <Pressable onPress={() => { setDietId(item) }}>
                      <View style={[styles.card, styles.categoryCard, styles.shadowProp, { marginStart: 5, marginEnd: 5 }]}>
                        <View style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 10
                        }}>

                          <Text style={[styles.heading, { flex: 1 }]}>{item.category}</Text>
                          <View style={[{ backgroundColor: "white", padding: 5, borderRadius: 5, paddingLeft: 10, paddingRight: 10 }, styles.shadowProp]}>
                            <Pressable>
                              <View>
                                <Text style={{ color: "black" }}>{'>'}</Text>
                              </View>
                            </Pressable>

                          </View>
                        </View>

                        <View style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}>
                          <Text style={{ lineHeight: 20, fontSize: 11, flex: 1, color: "black" }}>
                            <Text style={{ fontSize: 15 }}>{item.servings_consumed}</Text> sets
                            done

                          </Text>
                        </View>


                      </View>
                    </Pressable>
                  )} />

              </View>
                :
                <View style={[styles.card, styles.mainInCard, { marginTop: 30 }]}>
                  <View>
                    <Text>You don't have any ongoing exercise plans . Please consult Dietician.</Text>
                  </View>
                </View>
            }
          </View>
        }
      </ScrollView>




    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,

  },
  header: {
    fontWeight: '600',
    fontSize: 19,
    color: "black"
  },
  shadowProp: {
    elevation: 3,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  heading: {
    fontWeight: '600',
    fontSize: 22,
    color: "black"
  },
  gold: {
    color: mainColors.gold,
    fontWeight: '700',
    fontSize: 34,
  },
  white: {
    color: 'white',
    fontWeight: '600',
    fontSize: 20,
  },
  card: {
    borderRadius: 12,
    padding: 20
  },
  cardIn: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  foodImage: {
    height: 60,
    width: 60,
    marginLeft: -20
  },
  exerciseLogo: {
    height: 30,
    width: 60,
    marginLeft: -10
  },
  mainCard: {
    backgroundColor: mainColors.homeMainCard,
    marginTop: 20
  }
  ,
  categoryCard: {
    backgroundColor: mainColors.categoryCards,
    marginTop: 20
  }
  ,
  blackCard: {
    marginTop: 20,

    backgroundColor: mainColors.blackCard,
  }
  ,
  mainInCard: {
    backgroundColor: mainColors.homeInCard,
  },
  rowDirection: {
    display: "flex",
    flexDirection: "row", justifyContent: "space-around",
    alignItems: "center",
  },
  baseText: {
    fontFamily: 'Inter-Regular',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black"
  },

});

export default Diet;