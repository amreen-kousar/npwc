import React from "react";
import { Text, View, Pressable, Image, SafeAreaView, StyleSheet, } from "react-native"
import Modal from "react-native-modal"
export function ImagePickerModal({
    isVisible,
    onClose,
    onImageLibraryPress,
    onCameraPress,
}) {
    return (
        <Modal
            isVisible={isVisible}
            onBackButtonPress={onClose}
            onBackdropPress={onClose}
            style={styles.modal}>
            <View style={styles.buttons}>
                <Pressable style={styles.button} onPress={onImageLibraryPress}>
                    {/* <Image style={styles.buttonIcon} source={images.image} /> */}
                    <Text style={styles.buttonText}>Click to choose image</Text>
                </Pressable>

            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    modal: {
        //   justifyContent: 'flex-end',
        //   margin: 0,
        height: '100%',
        width: '100%',
        alignSelf: "center"
    },
    buttonIcon: {
        width: 30,
        height: 30,
        margin: 10,
    },
    buttons: {
        backgroundColor: 'white',
        flexDirection: "row",
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        minHeight: 200,
        margin: 20,
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});