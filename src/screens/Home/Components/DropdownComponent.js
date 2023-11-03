import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
// import AntDesign from '@expo/vector-icons/AntDesign';
import { useIsFocused } from "@react-navigation/native";

const data = [
    { label: "Over All", value: '-1' },
    { label: 'Today', value: '0' },
    { label: 'Week', value: '1' },
    { label: '1 Month', value: '2' },
    { label: '3 Months', value: '3' },
];

const DropdownComponent = ({ onIntervalChange }) => {
    const [value, setValue] = useState('-1');
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) { setValue('-1') }
    }, [isFocused])



    return (
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            // search
            selectedTextProps={{
                style: {  
                    color: 'black',
                },
            }}

            textColor="black"
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={value}
            onChange={item => {
                setValue(item.value);
                onIntervalChange(item.value)
            }}

        />
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    dropdown: {
        // marginBottom: 10,
        height: 40,
        top: -5,
        color: "black",
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});