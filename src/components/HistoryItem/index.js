import * as React from "react";
import {
    Text,
    TouchableOpacity
} from "react-native";
import styles from "./styles";

const HistoryItem = ({ track, index, navigation }) => {

    return (
        <TouchableOpacity style={styles.wrapper} onPress={() => navigation.navigate("Track Details", { track })}>
            <Text style={styles.label}>Track number {index}</Text>
        </TouchableOpacity>
    );
};

export default HistoryItem;
