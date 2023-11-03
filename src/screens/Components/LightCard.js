import { View, Text, StyleSheet, Pressable, Image, Alert, ActivityIndicator } from 'react-native'
import React from 'react'
import { mainColors } from '../../colors/color-map';
function LightCard({ item, servings }) {


    return (
        <View style={[styles.card, styles.categoryCard, styles.shadowProp]}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10
            }}>
                {/* {console.log(item?.item_image)} */}
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
                <View style={[{ backgroundColor: "white", padding: 5, borderRadius: 5, paddingLeft: 10, paddingRight: 10 }, styles.shadowProp]}>
                    <Pressable>
                        <View>
                            <Text style={{ color: "black" }}>{servings}</Text>
                        </View>
                    </Pressable>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

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



export default LightCard;