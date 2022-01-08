import * as React from "react";
import {
    ScrollView,
    SafeAreaView,
} from "react-native";
import styles from "./styles";

const History = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >

            </ScrollView>
        </SafeAreaView>
    );
};

export default History;
