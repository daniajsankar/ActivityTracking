import * as React from "react";
import { useEffect, useState } from 'react';
import {
    ScrollView,
    SafeAreaView,
} from "react-native";
import styles from "./styles";
import Button from "../../components/Button";
import { readFile, writeFile, deleteFile } from '../../helpers/FileSystemManagement';

const Home = ({ navigation }) => {
    // currentStatus refers to if we have running track to end or paused track to resume
    // or no running tracks to start new
    const [currentStatus, setCurrentStatus] = useState('No Running Track');
    const [currentTrack, setCurrentTrack] = useState({});
    let jsonTrack = {};
    useEffect(() => {
        readFile("currentTrack.txt").then((content) => {
            console.log(content);
            if (content) {
                setCurrentStatus("Running Track")
                jsonTrack = JSON.parse(content);
                setCurrentStatus(jsonTrack.status);
                setCurrentTrack(jsonTrack);
            }
        }).catch((e) => {
            console.log(e);
            setCurrentStatus('No Running Track');
        });
    }, []);
    const onStartTracking = () => {
        jsonTrack.status = "Running Track";
        writeFile("currentTrack.txt", JSON.stringify(jsonTrack));
        setCurrentStatus("Running Track");
    }
    const onPauseTracking = () => {
        jsonTrack.status = "Paused Track";
        writeFile("currentTrack.txt", JSON.stringify(jsonTrack));
        setCurrentStatus("Paused Track");
    }
    const onResumeTracking = () => {
        jsonTrack.status = "Running Track";
        writeFile("currentTrack.txt", JSON.stringify(jsonTrack));
        setCurrentStatus("Running Track");
    }
    const onEndTracking = () => {
        deleteFile("currentTrack.txt");
        setCurrentStatus("No Running Track");
    }
    const onButtonPress = () => {
        if (currentStatus === 'No Running Track')
            onStartTracking();
        else if (currentStatus === 'Running Track')
            onPauseTracking();
        else if (currentStatus === 'Paused Track')
            onResumeTracking();
    }
    return (
        <SafeAreaView style={styles.root}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <Button text={currentStatus === 'No Running Track' ? "Start Tracking" :
                    currentStatus === 'Running Track' ? "Pause Tracking" :
                        currentStatus === 'Paused Track' ? "Resume Tracking" : ''
                }
                    onPress={onButtonPress} />
                {currentStatus === 'Running Track' || currentStatus === 'Paused Track' ?
                    <Button text={"End Tracking"} onPress={onEndTracking} /> : null}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;
