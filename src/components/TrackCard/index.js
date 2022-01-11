import * as React from "react";
import {
    Text,
    View
} from "react-native";
import styles from "./styles";
import { timeFormat } from '../../helpers/timeFormat';
import { convertMetersToSteps } from '../../helpers/GetDistance';

const TrackCard = ({ duration, distance }) => {

    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>Duration:  <Text style={styles.value}>{timeFormat(duration)}</Text></Text>
            <Text style={styles.label}>Distance:  <Text style={styles.value}>{distance} meter</Text></Text>
            <Text style={styles.label}>Steps:  <Text style={styles.value}>{convertMetersToSteps(distance)}</Text></Text>
        </View>
    );
};

export default TrackCard;
