import * as React from "react";
import { useEffect, useState } from 'react';
import {
    ScrollView,
    SafeAreaView,
} from "react-native";
import BackgroundService from 'react-native-background-actions';
import styles from "./styles";
import Button from "../../components/Button";
import { readFile, writeFile, deleteFile } from '../../helpers/FileSystemManagement';
import { startTracking, stopTracking, isTracking, sleep, interval } from '../../helpers/BackgroundTask';
import InitTrack from '../../helpers/InitTrack';
import { getDistanceFromLatLonInM } from '../../helpers/GetDistance';

const Home = ({ navigation }) => {
    // currentStatus refers to if we have running track to end or paused track to resume
    // or no running tracks to start new
    const [currentStatus, setCurrentStatus] = useState('No Running Track');
    const [currentTrack, setCurrentTrack] = useState(InitTrack);
    let jsonTrack = InitTrack;
    useEffect(() => {
        readFile("currentTrack.txt").then((content) => {
            console.log(content);
            if (content) {
                if (isTracking()) {
                    setCurrentStatus("Running Track");
                } else {
                    setCurrentStatus("Paused Track");
                }
                jsonTrack = JSON.parse(content);
                setCurrentTrack(jsonTrack);
            }
        }).catch((e) => {
            console.log(e);
            setCurrentStatus('No Running Track');
        });
    }, []);
    const veryIntensiveTask = async (taskDataArguments) => {
        const { delay } = taskDataArguments;
        await new Promise(async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
                console.log(jsonTrack.trackingTime);
                jsonTrack.endPoint = { lat: "1", long: '2' };
                jsonTrack.trackingTime += interval;
                setCurrentTrack(jsonTrack);
                writeFile("currentTrack.txt", JSON.stringify(jsonTrack));
                await sleep(delay);
            }
        });
    };
    const onStartTracking = () => {
        jsonTrack.startPoint = { lat: "1", long: '2' };
        startTracking(veryIntensiveTask);
        jsonTrack.status = "Running Track";
        writeFile("currentTrack.txt", JSON.stringify(jsonTrack));
        setCurrentStatus("Running Track");
    }
    const onPauseTracking = () => {
        stopTracking();
        jsonTrack.status = "Paused Track";
        writeFile("currentTrack.txt", JSON.stringify(jsonTrack));
        setCurrentStatus("Paused Track");
    }
    const onResumeTracking = () => {
        startTracking(veryIntensiveTask);
        jsonTrack.status = "Running Track";
        writeFile("currentTrack.txt", JSON.stringify(jsonTrack));
        setCurrentStatus("Running Track");
    }
    const onEndTracking = () => {
        stopTracking()
        deleteFile("currentTrack.txt");
        setCurrentStatus("No Running Track");
        setCurrentTrack(InitTrack);
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
