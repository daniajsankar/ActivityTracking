import * as React from "react";
import {
    ScrollView,
    SafeAreaView,
} from "react-native";
import styles from "./styles";

const Home = ({ navigation }) => {

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

export default Home;
