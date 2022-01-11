import * as React from "react";
import { useEffect, useState } from 'react';
import {
    ScrollView,
    SafeAreaView,
} from "react-native";
import styles from "./styles";
import HistoryItem from "../../components/HistoryItem";
import { readFile } from '../../helpers/FileSystemManagement';
import { useIsFocused } from "@react-navigation/native";

const History = ({ navigation }) => {
    const [history, setHistory] = useState([]);
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused)
            readFile("historyTracks.txt").then((content) => {
                if (content) {
                    setHistory(JSON.parse(content));
                }
            }).catch((e) => {
                console.log(e);
            });
    }, [isFocused]);
    return (
        <SafeAreaView style={styles.root}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {history.map((track, index) => {
                    return <HistoryItem track={track} key={index} index={index + 1} navigation={navigation} />
                })}
            </ScrollView>
        </SafeAreaView>
    );
};

export default History;
