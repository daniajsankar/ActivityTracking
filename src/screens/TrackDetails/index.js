import * as React from "react";
import { useEffect, useState } from 'react';
import {
    ScrollView,
    SafeAreaView,
} from "react-native";
import styles from "./styles";
import { useIsFocused } from "@react-navigation/native";
import TrackCard from '../../components/TrackCard';
import Map from "../../components/Map";

const TrackDetails = ({ route }) => {
    const [track, setTrack] = useState(route.params.track);
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused)
            setTrack(route.params.track);
    }, [isFocused]);
    const url = 'https://www.google.com/maps/dir/' + track.startPoint.lat + ',' + track.startPoint.long + '/' + track.endPoint.lat + ',' + track.endPoint.long;
    return (
        <SafeAreaView style={styles.root}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <TrackCard duration={track.trackingTime} distance={track.traveledDistance} />
                <Map track={track} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default TrackDetails;
