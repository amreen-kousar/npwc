// import React, { FC, ReactElement, useRef, useState } from 'react';
// import {
//     FlatList,
//     StyleSheet,
//     Text,
//     Pressable,
//     Modal,
//     View,
// ,Alert, ActivityIndicator } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';



// const Dropdown = ({ label, data, onSelect }) => {
//     const DropdownButton = useRef();
//     const [visible, setVisible] = useState(false);
//     const [selected, setSelected] = useState(undefined);
//     const [dropdownTop, setDropdownTop] = useState(0);

//     const toggleDropdown = () => {
//         visible ? setVisible(false) : openDropdown();
//     };

//     const openDropdown = () => {
//         DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
//             setDropdownTop(py + h);
//         });
//         setVisible(true);
//     };

//     const onItemPress = (item) => {
//         setSelected(item);
//         onSelect(item);
//         setVisible(false);
//     };

//     const renderItem = ({ item }) => (
//         <Pressable style={styles.item} onPress={() => onItemPress(item)}>
//             <Text>{item.label}</Text>
//         </Pressable>
//     );

//     const renderDropdown = () => {
//         return (
//             <Modal visible={visible} transparent animationType="none">
//                 <Pressable
//                     style={styles.overlay}
//                     onPress={() => setVisible(false)}
//                 >
//                     <View style={[styles.dropdown, { top: dropdownTop }]}>
//                         <FlatList
//                             data={data}
//                             renderItem={renderItem}
//                             keyExtractor={(item, index) => index.toString()}
//                         />
//                     </View>
//                 </Pressable>
//             </Modal>
//         );
//     };

//     return (
//         <Pressable
//             ref={DropdownButton}
//             style={styles.button}
//             onPress={toggleDropdown}
//         >
//             {renderDropdown()}
//             <Text style={styles.buttonText}>
//                 {(!!selected && selected.label) || label} 
//             </Text>
//             <Icon style={styles.icon} type="font-awesome" name="chevron-down" />
//         </Pressable>
//     );
// };

// const styles = StyleSheet.create({
//     button: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#efefef',
//         height: 50,
//         zIndex: 1,
//     },
//     buttonText: {
//         flex: 1,
//         textAlign: 'center',
//     },
//     icon: {
//         marginRight: 10,
//     },
//     dropdown: {
//         position: 'absolute',
//         backgroundColor: '#fff',
//         width: '100%',
//         shadowColor: '#000000',
//         shadowRadius: 4,
//         shadowOffset: { height: 4, width: 0 },
//         shadowOpacity: 0.5,
//     },
//     overlay: {
//         width: '100%',
//         height: '100%',
//     },
//     item: {
//         paddingHorizontal: 10,
//         paddingVertical: 10,
//         borderBottomWidth: 1,
//     },
// });

// export default Dropdown;