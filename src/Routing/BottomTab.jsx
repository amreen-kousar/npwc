import React from 'react';
import { StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/Home';
import Diet from '../screens/Diet/Diet';
import Exercise from '../screens/Exercise/Exercise';
import { colors } from '../colors/color-map';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import FontIconAwesome from 'react-native-vector-icons/FontAwesome';
import Profile from '../screens/Profile/Profile';

const Tab = createBottomTabNavigator();
const BottomNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName={"Home"}
            screenOptions={{
                headerShown: false,
                // tabBarVisible: true,
                tabBarActiveTintColor: '#BB8ED1',
                // tabBarActiveBackgroundColor:'#112866',
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Icon name="home" size={25} color={focused ? '#BB8ED1' : "grey"} />
                        // <Image
                        //     source={focused ? require("../assets/icons/hbd1.png") : require("../assets/icons/hb1.png")}
                        //     style={{ width: 22, height: 22 }}

                        // />
                    )
                }}
            />

            <Tab.Screen
                name="Diet"
                component={Diet}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Icon name='food-variant' color={focused ? '#BB8ED1' : "grey"} size={25} />
                        // <Image
                        //     source={focused ? require("../assets/icons/searchdark.png") : require("../assets/icons/search.png")}
                        //     style={{ width: 22, height: 22 }}

                        // />
                    )
                }}

            />
            <Tab.Screen
                name="Exercise"
                component={Exercise}
                options={{
                    tabBarIcon: ({ tintColor, focused }) => (
                        <Icon name="dumbbell" color={focused ? '#BB8ED1' : "grey"} size={22} />
                        // <Image
                        //     source={focused ? require("../assets/icons/exdark.png") : require("../assets/icons/explore.png")}
                        //     style={{ tintColor: tintColor, width: 22, height: 22 }}
                        // />
                    )
                }}
            />
            {/* <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ tintColor, focused }) => (
                        <FontIconAwesome name="user-circle-o" color={focused ? '#BB8ED1' : "grey"} size={22} />
                        
                    )
                }}
            /> */}
        </Tab.Navigator>
    );
};
const styles = StyleSheet.create({
    tabBar: {

        borderTopStartRadius: 16,
        borderTopEndRadius: 16,
        // backgroundColor: colors.background,
        paddingHorizontal: 16,
    },
});
export default BottomNavigator;

