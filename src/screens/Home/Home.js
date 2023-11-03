import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios'
import { View, StyleSheet, Text, Image, Pressable, FlatList, SafeAreaView, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { mainColors } from '../../colors/color-map';
// import Dropdown from '../Components/Dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import Frame from "../../assets/icons/Frame.svg";
import Dropdown from './Components/DropdownComponent';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from "@react-navigation/native";
import FontIconAwesome from 'react-native-vector-icons/FontAwesome';
import ChartView from 'react-native-highcharts';
import { BottomSheetScrollView, BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Graph from './Graph';


const Home = ({ route, navigation }) => {

  const isFocused = useIsFocused();
  var responseData = [
    {
      "start_date": "12-06-2023",
      "end_date": "18-06-2023",
      "status": "ongoing",
      "data": [
        {
          "recommended_servings": 3,
          "servings_consumed": 1,
          "difference": 0,
          "log_date": "14-06-2023",
          "status": "excessive"
        },
        {
          "recommended_servings": 3,
          "servings_consumed": 1,
          "difference": 0,
          "log_date": "15-06-2023",
          "status": "excessive"
        }
      ]
    },
    {
      "start_date": "12-05-2023",
      "end_date": "18-05-2023",
      "status": "previous",
      "data": [
        {
          "recommended_servings": 3,
          "servings_consumed": 3,
          "difference": 0,
          "log_date": "14-06-2023",
          "status": "excessive"
        }
      ]
    },
    {
      "start_date": "12-04-2023",
      "end_date": "18-04-2023",
      "status": "previous",
      "data": [
        {
          "recommended_servings": 3,
          "servings_consumed": 3,
          "difference": 0,
          "log_date": "14-06-2023",
          "status": "excessive"
        }
      ]
    }
  ]

  // var [responseData, setResponseData] = useState([])
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ['50%'];
  const [loading, setLoading] = useState(true)
  const [username, setusername] = useState('')
  const [userId, setuserId] = useState('')
  const [oneDietPlanData, setoneDietplanData] = useState([])
  const [oneExerciseData, setOneExerciseData] = useState([])
  const [viewOneDietPlan, setViewOneDietPlan] = useState({ ongoing: true, previous: -1 })
  const interval = { '0': 'today', '1': 'week', '2': 'month', '3': '3months' }
  const [ongoingDietPlan, setOngoingDietPlan] = useState({})
  const [ongoingExercisePlan, setOngoingExercisePlan] = useState({})
  const [prevDietPlan, setPrevDietPlan] = useState([])
  const [upcoming, setUpComing] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  var [recommended_servings, setRecommendedServings] = useState([])
  var [servings_consumed, setServingsConsumed] = useState([])
  const [viewGraph, setViewGraph] = useState(false)

  useEffect(() => {
    // AsyncStorage.clear()
    if (isFocused) {
      recommended_servings = []
      servings_consumed = []
      setRecommendedServings(recommended_servings)
      setServingsConsumed(servings_consumed)
      setValues()
    }

  }, [isFocused])

  // const getChart = async (uid) => {
  //   await axios.post(`https://novapwc.com/api/dietLog?user_id=${uid}&type=food`)
  //     .then(async function (responset) {
  //       responseData = responset
  //       setResponseData(responseData)
  //       await axios.post(`https://novapwc.com/api/dietLog?user_id=${uid}&type=exercise`)
  //         .then(function (response) {
  //           responseData = [...responseData, response]
  //           setResponseData(responseData)
  //         })
  //         .catch(function (error) {
  //           console.log(error, "chart api");
  //         });
  //     })
  //     .catch(function (error) {
  //       console.log(error, "chart api outtt");
  //     });

  // }


  const apiCall = (start_date, end_date) => {
    let tempResponse = responseData.filter(e => e.start_date == start_date && e.end_date == end_date)
    if (tempResponse.length > 0) {
      tempResponse = tempResponse[0].data;
      if (tempResponse.length > 0) {
        for (let i = 0; i < tempResponse.length; i++) {
          let servingStatus = tempResponse[i]
          recommended_servings.push(servingStatus.recommended_servings)
          servings_consumed.push(servingStatus.servings_consumed)
          if (i == tempResponse.length - 1) {
            setRecommendedServings(recommended_servings)
            setServingsConsumed(servings_consumed)
            setViewGraph(true)
          }
        }
      }
    }
  }

  const graphStatus = (item) => {
    recommended_servings = []
    servings_consumed = []
    setRecommendedServings(recommended_servings)
    setServingsConsumed(servings_consumed)
    apiCall("12-06-2023", "18-06-2023")
    // apiCall(item.start_date, item.end_date)

    bottomSheetModalRef.current?.present();
  }

  const onRefresh = () => {
    setRefreshing(true)
    setValues()
  }

  const formatDate = (date) => {
    let splitDate = date.split("-")
    return splitDate[1] + '-' + splitDate[0] + '-' + splitDate[2]
  }

  const setValues = async () => {
    let uname = await AsyncStorage.getItem('Username')
    let uid = await AsyncStorage.getItem('userId')
    await setusername(uname)
    await setuserId(uid)
    console.log("set valuessss")
    await listDietPlan(uid);
    // await getChart(uid)
  }

  const convertNumber = (num, name) => {
    if (num < 0) {
      return <Text style={styles.white}><Text style={styles.gold}> {Math.abs(num)}</Text> {"\n"} {name} {"\n"} exceeded</Text>

    }
    else {
      return <Text style={styles.white}><Text style={styles.gold}> {Math.abs(num)}</Text> {"\n"} {name} {"\n"} left</Text>
    }
  }

  const onIntervalChange = (value) => {
    if (value == '-1') {
      getAllDietPlan(0, 0, 0, userId)
    }
    else {
      getAllDietPlan(ongoingDietPlan, ongoingExercisePlan, value, userId)
    }
  }

  const listDietPlan = async (uid) => {
    await axios.get(`https://novapwc.com/api/getlistsdietplans?userid=${uid}`)
      .then(function (response) {
        console.log(response?.data, "home respo se")
        if (response?.data?.data == 'Data not found') {
          setLoading(false)
          setRefreshing(false)
          AsyncStorage.removeItem('exercisestartDate')
          AsyncStorage.removeItem('exerciseendDate')
          AsyncStorage.removeItem('dietstartDate')
          AsyncStorage.removeItem('dietendDate')
        }
        else {
          let prev = response?.data?.data?.filter(e => e.status == 'previous')
          let ongoing = response?.data?.data?.filter(e => e.status == 'ongoing')
          let upcoming = response?.data?.data?.filter(e => e.status == 'upcoming')
          setUpComing(upcoming ? upcoming : [])
          setPrevDietPlan(prev ? prev : [])
          if (ongoing?.length > 0) {
            getAllDietPlan(0, 0, 0, uid)
          }
          else {
            AsyncStorage.removeItem('exercisestartDate')
            AsyncStorage.removeItem('exerciseendDate')
            AsyncStorage.removeItem('dietstartDate')
            AsyncStorage.removeItem('dietendDate')
            setLoading(false)
            setRefreshing(false)

          }
        }
      })
      .catch(function (error) {
        setLoading(false)
        setRefreshing(false)

        // Alert.alert("something went wrong");
        console.log(error, "listdietPlamn");
      });
  }

  const getAllDietPlan = (diet, exercise, value, uid) => {
    let dieturl = `https://novapwc.com/api/getAllDietPlan?userid=${uid}&type=food&status=ongoing`,
      exerciseurl = `https://novapwc.com/api/getAllDietPlan?userid=${uid}&type=exercise&status=ongoing`
    if (diet) {
      dieturl = `https://novapwc.com/api/getAllDietPlan?userid=${uid}&startdate=${diet?.StartDate}&enddate=${diet?.EndDate}&type=food&status=${interval[value]}`
      if (exercise?.StartDate) {
        exerciseurl = `https://novapwc.com/api/getAllDietPlan?userid=${uid}&startdate=${exercise?.StartDate}&enddate=${exercise?.EndDate}&type=exercise&status=${interval[value]}`
      }
    }
    value == '0' ? days = 1 : value == '1' ? days = 7 : value == '2' ? days = 30 : days = 90
    axios.get(dieturl)
      .then(function (response) {

        if (response?.data?.data) {
          if (diet) {


            if (response?.data?.data?.RecommendedServings * days < response?.data?.data?.TotalServings) {
              response.data.data.TotalServings = parseInt
                (response?.data?.data?.RecommendedServings * days)
            }



          }


          // console.log(response.data.data,"responseee")

          response.data.data.servingsLeft = parseInt
            (response?.data?.data.TotalServings - response?.data?.data.CosumedServings)

          AsyncStorage.setItem('dietstartDate', response?.data?.data?.StartDate)
          AsyncStorage.setItem('dietendDate', response?.data?.data?.EndDate)
          setOngoingDietPlan(response?.data?.data)
        }

        axios.get(exerciseurl)
          .then(function (response) {

            if (response?.data?.data) {
              if (exercise) {
                if (response?.data?.data?.RecommendedServings * days < response?.data?.data?.TotalServings) {
                  response.data.data.TotalServings = parseInt
                    (response?.data?.data?.RecommendedServings * days)
                }

              }

              response.data.data.servingsLeft = parseInt
                (response?.data?.data.TotalServings - response?.data?.data.CosumedServings)
              AsyncStorage.setItem('exercisestartDate', response?.data?.data?.StartDate)
              AsyncStorage.setItem('exerciseendDate', response?.data?.data?.EndDate)

              setOngoingExercisePlan(response?.data?.data)
            }
            setRefreshing(false)

            setLoading(false)
          })
          .catch(function (error) {
            setLoading(false)
            setRefreshing(false)

            // Alert.alert("something went wrong");
            console.log(error);
          });
      })
      .catch(function (error) {
        setLoading(false)
        setRefreshing(false)

        // Alert.alert("something went wrong");
        console.log(error);
      });
  }

  const getOneDiet = (item, index) => {
    axios.get(`https://novapwc.com/api/getAllDietPlan?userid=${userId}&startdate=${item.startdate}&enddate=${item.enddate}&type=${item.type}&status=${item.status}`)
      .then(function (response) {
        console.log(response?.data, "prev plannnn")
        setViewOneDietPlan({ ...viewOneDietPlan, previous: index })
        if (response?.data?.data) {
          response.data.data.servingsLeft = parseInt
            (response?.data?.data.TotalServings - response?.data?.data.CosumedServings)
          setoneDietplanData(response?.data?.data)
        }
        else {
          setoneDietplanData('empty')
        }
      })
      .catch(function (error) {
        // Alert.alert("something went wrong");
        console.log(error);
      });
  }

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        opacity={2.5}
        disappearsOnIndex={-1}
        pressBehavior={() => {
          Alert.alert("qwewqe")
        }}
        appearsOnIndex={2}
      />
    ),
    []
  );


  return (
    <ScrollView showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />}
    >
      <View style={styles.container}>
        {
          Platform.OS === 'ios' &&
          <View style={{ marginTop: 50 }}>
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
        <Text style={styles.heading}>Hello  {username}</Text>



        {
          loading ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 100 }}>
            <Text> <ActivityIndicator color="#1b1c1e" /></Text>

          </View> :
            <View>
              <View style={[styles.card, styles.mainCard]}>


                <View flexDirection="row" >
                  <Text style={styles.header}>Ongoing Plans</Text>
                  {
                    (ongoingDietPlan?.Type || ongoingExercisePlan?.Type) && <View style={{ width: "40%", marginLeft: '12%' }}>
                      <Dropdown onIntervalChange={onIntervalChange} />
                    </View>
                  }
                </View>

                {
                  (ongoingDietPlan?.Type || ongoingExercisePlan?.Type) ?

                    <View>
                      {/* display ongoing diet plan  */}
                      <View>
                        <Text style={[styles.header, { marginTop: 10 }]}>Diet</Text>
                      </View>

                      <View style={[styles.card, styles.mainInCard]}>
                        <Pressable onPress={() => { graphStatus(ongoingDietPlan) }}>
                          {
                            (ongoingDietPlan?.Type) ? <View style={styles.rowDirection}>
                              <Text style={styles.prevText}>{formatDate(ongoingDietPlan?.StartDate)}</Text>
                              <Text style={{ color: "black" }}>to</Text>
                              <Text style={styles.prevText}>{formatDate(ongoingDietPlan?.EndDate)}</Text>
                            </View> :
                              <View>
                                <Text>You don't have any ongoing diet plans . Please consult Dietician.</Text>
                              </View>
                          }


                        </Pressable>
                      </View>

                      <View>
                        {
                          ongoingDietPlan?.TotalServings > 0 &&
                          <Pressable onPress={() => { navigation.navigate('Diet'); }}>
                            <View style={[styles.card, styles.blackCard, styles.rowDirection]}>
                              <View>
                                <Text style={styles.white}>

                                  <Text style={styles.gold}>
                                    {ongoingDietPlan?.TotalServings}</Text> {"\n"} servings {"\n"} recommended</Text>
                              </View>
                              <Image style={styles.foodImage} source={require("../../assets/images/foodlogo.png")}></Image>
                              <View >
                                {convertNumber(ongoingDietPlan?.servingsLeft, 'servings')}

                              </View>
                            </View>
                          </Pressable>
                        }

                      </View>

                      {/* display ongoing exercise plan */}

                      <View>
                        <Text style={[styles.header, { marginTop: 10 }]}>Exercise</Text>
                      </View>
                      <View style={[styles.card, styles.mainInCard]}>
                        <Pressable onPress={() => { graphStatus(ongoingExercisePlan) }}>
                          {
                            (ongoingExercisePlan?.Type) ? <View style={styles.rowDirection}>
                              <Text style={styles.prevText}>{formatDate(ongoingExercisePlan?.StartDate)}</Text>
                              <Text style={{ color: "black" }}>to</Text>
                              <Text style={styles.prevText}>{formatDate(ongoingExercisePlan?.EndDate)}</Text>
                            </View> :
                              <View>
                                <Text>You don't have any ongoing exercise plans . Please consult Dietician.</Text>
                              </View>
                          }

                        </Pressable>
                      </View>

                      {
                        ongoingExercisePlan?.TotalServings > 0 &&
                        <Pressable onPress={() => { navigation.navigate('Exercise'); }}>
                          <View style={[styles.card, styles.blackCard, styles.rowDirection]}>
                            <View >
                              <Text style={styles.white}><Text style={styles.gold}>
                                {ongoingExercisePlan.TotalServings}</Text> {"\n"} sets {"\n"} recommended</Text>
                            </View>
                            <Image style={styles.exerciseLogo} source={require("../../assets/images/exerciselogo.png")}></Image>
                            <View >
                             {convertNumber(ongoingExercisePlan?.servingsLeft,"exercises")}
                            </View>
                          </View>
                        </Pressable>
                      }


                    </View>


                    :


                    <View style={[styles.card, styles.mainInCard]}>

                      <View>
                        <Text>You don't have any ongoing diet and exercise plans . Please consult Dietician.</Text>
                      </View>


                    </View>
                }



              </View>


              <SafeAreaView style={{ marginTop: 20, flex: 1 }}>
                {
                  prevDietPlan?.length > 0 && <View>
                    <Text style={styles.heading}>Previous Plans</Text>
                    <SafeAreaView style={{ flex: 1 }}>
                      <FlatList
                        data={prevDietPlan}
                        renderItem={({ item, index }) => {
                          return (
                            <View style={[styles.card, styles.prevCard, styles.shadow]}>
                              <Pressable onPress={() => { index == viewOneDietPlan.previous ? setViewOneDietPlan(-1) : getOneDiet(item, index) }}>
                                <View style={[styles.rowDirection]}>
                                  <Text style={styles.prevText}>{formatDate(item.startdate)}</Text>
                                  <Text style={{ color: "black" }}>to</Text>
                                  <Text style={styles.prevText}>{formatDate(item.enddate)}</Text>
                                  <Icon onPress={() => { index == viewOneDietPlan.previous ? setViewOneDietPlan(-1) : getOneDiet(item, index) }} style={styles.icon} type="font-awesome" name={index == viewOneDietPlan.previous ? 'chevron-up' : "chevron-down"} />
                                </View>
                              </Pressable>
                              <Pressable onPress={() => { graphStatus(viewOneDietPlan) }}>
                                {
                                  viewOneDietPlan.previous == index &&

                                  <View>
                                    {
                                      item?.type == 'food' ?

                                        <View style={[styles.card, styles.blackCard]}>
                                          {
                                            oneDietPlanData == 'empty' ? <View style={{ alignItems: "center", flexDirection: "row", justifyContent: 'space-between' }}>
                                              {/* <Image style={styles.exerciseLogo} source={require("../../assets/images/exerciselogo.png")}></Image> */}
                                              <Text style={{ color: "white" }}> No data found in diet plan</Text>

                                            </View> :
                                              <View style={styles.rowDirection}>
                                                <View>
                                                  <Text style={styles.white}><Text style={styles.gold}>
                                                    {oneDietPlanData.TotalServings}</Text> {"\n"} servings {"\n"} recommended</Text>
                                                </View>
                                                <Image style={styles.foodImage} source={require("../../assets/images/foodlogo.png")}></Image>
                                                <View >
                                                 {convertNumber(oneDietPlanData?.servingsLeft,"servings")}
                                                </View>


                                              </View>
                                          }
                                        </View>

                                        :

                                        item?.type == 'exercise' ?
                                          <View style={[styles.card, styles.blackCard]}>
                                            {
                                              oneDietPlanData == 'empty' ? <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                <Text style={{ color: "white" }}> No data found in exercise plan</Text>

                                              </View> :
                                                <View style={styles.rowDirection}>

                                                  <View >
                                                    <Text style={styles.white}><Text style={styles.gold}>
                                                      {oneDietPlanData.TotalServings}</Text> {"\n"} exercises {"\n"} recommended</Text>
                                                  </View>
                                                  <Image style={styles.exerciseLogo} source={require("../../assets/images/exerciselogo.png")}></Image>
                                                  <View >
                                                    {convertNumber(oneDietPlanData.servingsLeft, "exercises")}

                                                  </View>

                                                </View>
                                            }
                                          </View>

                                          :
                                          <View style={[styles.card, styles.mainInCard, { justifyContent: "center", alignItems: "center" }]}>


                                            <Text>No activity</Text>

                                          </View>
                                    }



                                  </View>


                                }
                              </Pressable>

                            </View>
                          )
                        }}

                      />

                    </SafeAreaView>

                  </View>
                }

              </SafeAreaView>


              <SafeAreaView style={{ marginTop: 20, flex: 1 }}>
                {
                  upcoming?.length > 0 && <View>
                    <Text style={styles.heading}>Upcoming Plans</Text>
                    <SafeAreaView style={{ flex: 1 }}>
                      <FlatList
                        data={upcoming}
                        renderItem={({ item, index }) => {
                          return (
                            <View style={[styles.card, styles.prevCard, styles.shadow]}>
                              <Pressable >
                                <View style={[styles.rowDirection]}>
                                  {
                                    item?.type == 'food' ?
                                      <Image style={[styles.foodImage, { borderRadius: 50, height: 50, width: 50 }]} source={require("../../assets/images/foodlogo.png")}></Image>
                                      :
                                      <Image style={[styles.exerciseLogo, { borderRadius: 50 }]} source={require("../../assets/images/exerciselogo.png")}></Image>
                                  }
                                  <Text style={styles.prevText}>{formatDate(item.startdate)}</Text>
                                  <Text style={{ color: "black" }}>to</Text>
                                  <Text style={styles.prevText}>{formatDate(item.enddate)}</Text>
                                </View>
                              </Pressable>

                            </View>
                          )
                        }}

                      />

                    </SafeAreaView>

                  </View>
                }

              </SafeAreaView>



            </View>
        }
      </View>

      <BottomSheetModalProvider>
        <BottomSheetModal
          backdropComponent={renderBackdrop}
          animateOnMount={false}
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
        >
          <BottomSheetScrollView
            scrollEnabled={true}
          >
            {
              viewGraph ? <Graph recommended_servings={recommended_servings} servings_consumed={servings_consumed} /> :
                <Text>No data found</Text>
            }
          </BottomSheetScrollView>
        </BottomSheetModal>

      </BottomSheetModalProvider>



    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    overflow: 'hidden',
    // marginTop: Platform.OS === 'ios' && 50,
    flex: 1,
    marginBottom: 0
  },
  heading: {
    fontWeight: '600',
    fontSize: 22,
    color: "black"
  },
  header: {
    fontWeight: '600',
    fontSize: 19,
    color: "black"
  },
  dropDownText: {
    padding: 10,
  },
  prevText: {
    fontWeight: '600',
    fontSize: 17,
    color: "black"
  },
  item: {
    borderBottomColor: 'grey',
    borderBottomWidth: 0.2,
  },
  gold: {
    color: mainColors.gold,
    fontWeight: '700',
    fontSize: 25,

  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    margin: 5
  },
  shadowProp: {
    elevation: 3,
    width: 200,
    padding: 5,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 20
  },
  white: {
    color: 'white',
    fontWeight: '600',
    lineHeight: 24,
    fontSize: 13,
    // backgroundColor: "red",
    paddingTop: 6
  },
  card: {
    borderRadius: 12,
    padding: 20
  },
  foodImage: {
    height: 60,
    width: 60,
    marginLeft: -10
  },
  exerciseLogo: {
    height: 30,
    width: 60,
    marginLeft: -10
  },
  mainCard: {
    marginTop: 15,
    backgroundColor: mainColors.homeMainCard,
  }
  ,
  prevCard: {
    marginTop: 15,
    backgroundColor: '#f5f5f5',
  }
  ,
  blackCard: {
    marginTop: 20,
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: mainColors.blackCard,
  }
  ,
  mainInCard: {
    marginTop: 10,
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
  },
})

export default Home;