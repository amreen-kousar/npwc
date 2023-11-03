import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, StyleSheet, Platform, View, Image, Button, Pressable, FlatList, RefreshControl, Dimensions, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { mainColors } from '../../colors/color-map';
import LightCard from '../Components/LightCard';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BottomSheetScrollView, BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import DetailItem from '../Components/DetailItem';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from "@react-navigation/native";


const ItemsOfCategory = ({ route, navigation }) => {

    var [items, setItems] = useState([])
    const [itemIntakeStatus, setItemIntakeStatus] = useState([])

    const [page, setPage] = useState(1)
    const [selectedData, setSelectedData] = useState(null)
    const [categoryName, setCategoryName] = useState(null)
    const snapPoints = ['39%'];
    const bottomSheetModalRef = useRef(null);
    const windowHeight = Dimensions.get('window').height;
    const [loading, setLoading] = useState(true)
    const [addServings, setAddServings] = useState(0)
    const isFocused = useIsFocused();
    const [servings, setServings] = useState(1)
    const [date, setDate] = useState(null)
    const [extraData, setExtraData] = useState(new Date())
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        if (isFocused) {
            apiCall()
            getCurrentDate()
        }
    }, [isFocused])

    const onRefresh = () => {
        setRefreshing(true)
        apiCall()
        getCurrentDate()
    }

    const increaseCount = (item, index) => {
        setAddServings(addServings => parseInt(addServings) + 1)
        item.servings_consumed = parseInt(item.servings_consumed) + 1
        items[index] = item
        setItems(items)
        setExtraData(new Date())
        saveDailyIntake(item)
    }

    const decreaseCount = (item, index) => {
        setAddServings(addServings => parseInt(addServings) - 1)
        item.servings_consumed = parseInt(item.servings_consumed) - 1
        items[index] = item
        setItems(items)
        setExtraData(new Date())
        saveDailyIntake(item)
    }

    const getCurrentDate = () => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        if (date < 10) date = '0' + date;
        if (month < 10) month = '0' + month;
        setDate(date + '-' + month + '-' + year);//format: d-m-y;
    }



    const saveDailyIntake = async (item) => {
        let userIdAsync = await AsyncStorage.getItem('userId')
        console.log(item, new Date())
        let data = {
            "user_id": parseInt(userIdAsync),
            "date": date,
            "diet_id": route?.params.diet_id,
            "item_id": item.item_id,
            "type": item.type,
            "category": categoryName,
            "servings_consumed": item?.servings_consumed
        }

        console.log(data, "posr requestrrrrttttttttttttttttt")
        axios.post(`https://novapwc.com/api/updateDailyIntake`, data)
            .then(function (response) {

                console.log(response?.data, "response from apiii")
                // closeBackdrop(servings, item)
            })
            .catch(function (error) {
                // Alert.alert("something went wrong");
                // console.log(error);
            });



    }

    const apiCall = async () => {
        setAddServings(0)
        let userIdAsync = await AsyncStorage.getItem('userId')
        setCategoryName(route?.params.category)

        axios.get(`https://novapwc.com/api/getItemsOfCategory?category_id=${route?.params.cat}&type=food`)
            .then(function (response) {
                console.log(response?.data?.data)
                if (response?.data?.data) {
                    items = response?.data?.data
                    setItems(items)
                    console.log(`https://novapwc.com/api/itemIntakeStatus?userid=${userIdAsync}&type=food&category=${route?.params.category}`, "utllllll")
                    axios.get(`https://novapwc.com/api/itemIntakeStatus?userid=${userIdAsync}&type=food&category=${route?.params.category}`)
                        .then(function (response) {
                            console.log(response?.data)
                            let itemServings = response?.data?.data ? response?.data?.data : []

                            for (let i = 0; i < items.length; i++) {
                                let servings = itemServings?.filter(oneitem => oneitem?.item_id == items[i].item_id)

                                if (servings.length > 0) {
                                    items[i] = { ...items[i], ...servings[0] }
                                    setAddServings(addServings => parseInt(addServings) + parseInt(servings[0].servings_consumed))
                                }
                                else {
                                    items[i] = { ...items[i], servings_consumed: 0 }
                                }

                                if (i == items.length - 1) {
                                    setItems(items)
                                    setLoading(false)
                                    setRefreshing(false)
                                }
                            }
                            setItemIntakeStatus(response?.data?.data)

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


    // const getStatus = (id) => {
    //     // console.log(itemIntakeStatus, id)
    //     let servings = itemIntakeStatus?.filter(i => i?.item_id == id)
    //     return servings?.length > 0 ? servings[0].servings_consumed : 0
    // }



    const handleSnapPress = useCallback((item) => {
        setSelectedData({ ...item, ...route.params });
        bottomSheetModalRef.current?.present();
    }, []);

    // const closeBackdrop = (servings, item) => {
    //     Alert.alert(`You have consumed ${servings} servings of ${item.item_name}`)
    //     setAddServings(servings)
    //     apiCall()
    //     bottomSheetModalRef.current?.close();
    // }

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
        <View style={styles.container}>
            {
                Platform.OS === 'ios' &&
                <View style={{ marginTop: 50, }}>
                </View>
            }
            <Pressable onPress={() => { route?.params?.apiCall(); navigation.goBack(); }}>
                <Text style={styles.titleText} ><Icon size={30} name='angle-left' /></Text>
            </Pressable>
            <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
                <View style={{ flex: 1, marginTop: 10 }}>
                    <Text style={styles.heading}>{categoryName}</Text>
                   
                    <Text style={{ color: "black" ,top:20}}>{route?.params.recommendedServings} recommended servings </Text>

                </View>
                <View style={[styles.card, styles.goldCard]}>
                    <Text style={styles.num}>{addServings}</Text>
                    <Text style={{ color: "black" }} >servings</Text>
                    <Text style={{ color: "black" }}>consumed</Text>
                </View>

            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                // refreshControl={
                //     <RefreshControl
                //         refreshing={refreshing}
                //         onRefresh={onRefresh}
                //     />
                // }
                data={items}
                // onEndReached={() => {
                //     setPage(page + 1);
                // }}
                extraData={extraData}
                ListEmptyComponent={() => {
                    return (
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 100 }}>{loading ? <View ><Text> <ActivityIndicator color="#1b1c1e" /></Text></View> : <Text>No items found</Text>}</View>
                    )
                }}
                keyExtractor={(item) => item.item_id}
                renderItem={({ item, index }) => (
                    <Pressable >
                        {/* <LightCard item={item} servings={getStatus(item.item_id)} /> */}
                        <View style={[styles.card, styles.categoryCard, styles.shadowProp]}>
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 10
                            }}>
                                <View style={[styles.heading, { flex: 1 }]}>
                                    <Image style={styles.exerciseLogo} source={{ uri: item?.item_image }}></Image>
                                </View>
                                <View style={{ flex: 4 }}>

                                    <Text style={[styles.heading]}>{item?.item_name}
                                    </Text>
                                    <Text style={{ lineHeight: 20, fontSize: 11, flex: 3, color: "black" }}>
                                        {item.description}
                                    </Text>
                                </View>
                                <View style={[{ backgroundColor: "white", borderRadius: 5, paddingLeft: 10, paddingRight: 10 }, styles.shadowProp]}>
                                    <Pressable>

                                        <View flexDirection="row" alignItems="center" >
                                            <Pressable onPress={() => { item.servings_consumed >= 1 && decreaseCount(item, index) }}>
                                                <Text style={{ fontSize: 20, color: "black" }}> - </Text>
                                            </Pressable>

                                            <View style={styles.servingcard}>
                                                <Text style={{ color: "black" }}>{item?.servings_consumed}</Text>
                                            </View>

                                            <Pressable onPress={() => { increaseCount(item, index) }}>
                                                <Text style={{ fontSize: 20, color: "black" }}> + </Text>
                                            </Pressable>
                                        </View>

                                    </Pressable>

                                </View>
                            </View>
                        </View>
                    </Pressable>
                )}
            />



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
                        scrollEnabled={windowHeight > 800 ? false : true}
                    >
                        {/* {selectedData ? (
                            <DetailItem item={selectedData} closeBackdrop={closeBackdrop} servings={getStatus(selectedData.item_id)} />
                        ) : <Text>no data found</Text>} */}
                    </BottomSheetScrollView>
                </BottomSheetModal>

            </BottomSheetModalProvider>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        // marginTop: Platform.OS === 'ios' && 50,
        flex: 1,
    },
    heading: {
        fontSize: 22,
        marginBottom: 10,
        color: "black"

    },
    text: {
        marginBottom: 10,
        color: "black"
    },
    num: {
        color: "black",
        fontSize: 30,
        fontWeight: '600'
    },
    shadowProp: {
        elevation: 3,
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    servingcard: {

        padding: 10,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 5,

    },
    goldCard: {
        backgroundColor: mainColors.gold,
        fontWeight: '700',
        fontSize: 34,
        alignItems: "center"
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "black"
    },
    card: {
        borderRadius: 12,
        padding: 20
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
    card: {
        borderRadius: 12,
        padding: 20,
        marginLeft: 5
    },

    categoryCard: {
        backgroundColor: mainColors.categoryCards,
        marginTop: 20
    },

    exerciseLogo: {
        height: 30,

    }
});

export default ItemsOfCategory;