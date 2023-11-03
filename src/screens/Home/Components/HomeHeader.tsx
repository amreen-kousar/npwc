import React from 'react';
import { StyleSheet, Text, TextInput, View, SafeAreaView, Pressable, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import Searchj from '../../../assets/icons/searchin.svg';

const HomeHeader = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <View style={styles.vw} >

        </View>

        <View>
          <TextInput
            style={styles.input}
            placeholderTextColor="#8E9AA7"
            placeholder="Search Users"
            keyboardType="default"

          />
          {/* <Searchj top={-24} marginLeft={310}/> */}
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: 180,
    top: -49,
    backgroundColor: '#F6F8FB',
    // backgroundColor: 'red',
    elevation: 2,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  smltxt: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    top: 5,
    color: '#8E9AA7',
    alignSelf: 'flex-start',
    marginStart: 12,
    textAlign: 'justify',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    top: 20,
    color: '#112866',
    borderColor: "#C8CEDD",
    fontFamily: "Inter-Regular",
    fontSize: 14,
    backgroundColor: '#fff'
  },
  vw: {
    flexDirection: 'row',
  },
  dateTextStyle: {
    fontFamily: 'Inter-SemiBold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 18,
    color: "#112866",
    //  fontWeight: "bold",
    marginLeft: 15,
    top: 15
  },
});
export default HomeHeader;