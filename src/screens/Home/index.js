import * as React from "react";
import { useEffect, useState, useRef } from 'react';
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
import Geolocation from "react-native-geolocation-service";
import TrackCard from '../../components/TrackCard';

const Home = ({ navigation }) => {
    // currentStatus refers to if we have running track to end or paused track to resume
    // or no running tracks to start new
    const [currentStatus, setCurrentStatus] = useState('No Running Track');
    const [currentTrack, setCurrentTrack] = useState(InitTrack);
    const [timer, setTimer] = useState(0);
    useEffect(() => {
        readFile("currentTrack.txt").then((content) => {
            if (content) {
                if (isTracking()) {
                    setCurrentStatus("Running Track");
                } else {
                    setCurrentStatus("Paused Track");
                }
                setCurrentTrack(JSON.parse(content));
                setTimer(JSON.parse(content).trackingTime);
            }
        }).catch((e) => {
            console.log(e);
            setCurrentStatus('No Running Track');
        });
    }, []);
    useEffect(() => {
        if (currentTrack.writeToFile) {
            writeFile("currentTrack.txt", JSON.stringify(currentTrack));
            setCurrentTrack((prev) => ({ ...prev, writeToFile: false }))
        }
    }, [currentTrack]);
    const veryIntensiveTask = async (taskDataArguments) => {
        const { delay } = taskDataArguments;
        await new Promise(async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
                getGeoLocation(false);
                setCurrentTrack((prev) => ({
                    ...prev,
                    trackingTime: prev.trackingTime + interval,
                    writeToFile: true
                }));
                await sleep(delay);
            }
        });
    };
    const timerRef = useRef();
    const startTimer = (startTime) => {
        setTimer(startTime);
        timerRef.current = setInterval(function () {
            setTimer((prev) => prev + 1);
        }, 1000);
    }
    const onStartTracking = () => {
        startTimer(0);
        getGeoLocation(true);
        startTracking(veryIntensiveTask);
        setCurrentTrack((prev) => ({
            ...prev, status: "Running Track",
            writeToFile: true,
            trackingTime: interval * (-1)
        }));
        setCurrentStatus("Running Track");
    }
    const onPauseTracking = () => {
        clearInterval(timerRef.current);
        stopTracking();
        setCurrentTrack((prev) => ({ ...prev, status: "Paused Track", writeToFile: true, trackingTime: timer }));
        setCurrentStatus("Paused Track");
    }
    const onResumeTracking = () => {
        startTimer(currentTrack.trackingTime);
        startTracking(veryIntensiveTask);
        setCurrentTrack((prev) => ({ ...prev, status: "Running Track", writeToFile: true }));
        setCurrentStatus("Running Track");
    }
    let history;
    const onEndTracking = () => {
        clearInterval(timerRef.current);
        stopTracking()
        deleteFile("currentTrack.txt");
        setCurrentStatus("No Running Track");
        readFile("historyTracks.txt").then((content) => {
            if (content) {
                history = JSON.parse(content);
                history.push({ ...currentTrack, trackingTime: timer });
                writeFile("historyTracks.txt", JSON.stringify(history));
            }
        }).catch((e) => {
            history = [];
            history.push({ ...currentTrack, trackingTime: timer });
            writeFile("historyTracks.txt", JSON.stringify(history));
        });
        setCurrentTrack(InitTrack);
        setTimeout(() => navigation.navigate("History"), 500);
    }
    const onButtonPress = () => {
        if (currentStatus === 'No Running Track')
            onStartTracking();
        else if (currentStatus === 'Running Track')
            onPauseTracking();
        else if (currentStatus === 'Paused Track')
            onResumeTracking();
    }
    let positionObj;
    const _initUserLocation = (firstTime) => {
        Geolocation.getCurrentPosition(
            (position) => {
                positionObj = { lat: position.coords.latitude, long: position.coords.longitude };
                if (firstTime) {
                    setCurrentTrack((prev) => ({ ...prev, startPoint: positionObj, endPoint: positionObj, writeToFile: true }));
                } else {
                    /*
                   returned geolocation maybe two different values for the same location
                   (I mean it may return two different coordinates as you are not moving) 
                   because of the error ratio of the package, so to reduce this error as possible
                   I put a minimum distance equals 5 meters to consider that the user has really moved
                   since the error distance is not greater than 5 meters based on testing
                    */
                    setCurrentTrack((prev) => ({
                        ...prev,
                        endPoint: getDistanceFromLatLonInM(prev.endPoint, positionObj) > 5 ? positionObj : prev.endPoint,
                        traveledDistance: prev.traveledDistance + (getDistanceFromLatLonInM(prev.endPoint, positionObj) > 5 ? getDistanceFromLatLonInM(prev.endPoint, positionObj) : 0),
                        writeToFile: true
                    }));
                }
            },
            (error) => {
                console.log("error " + error.message);
                return {};
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const getGeoLocation = async (firstTime) => {
        const requestAndroidLocationPermission = async () => {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Activity Tracking App Permission",
                    message:
                        "Activity Tracking App needs access to your location " +
                        "so you see where you are on the map.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return _initUserLocation(firstTime);
            } else {
                console.log("location permission denied");
                return {};
            }
        };

        if (Platform.OS === "android") {
            requestAndroidLocationPermission();
        } else {
            Geolocation.requestAuthorization("whenInUse")
                .then((permission) => {
                    if (permission === "granted") return _initUserLocation(firstTime);
                    else {
                        console.log("location permission denied");
                        return {};
                    }
                })
                .catch(() => {
                    console.log("location permission denied");
                    return {};
                });
        }
    }
    return (
        <SafeAreaView style={styles.root}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {currentStatus !== 'No Running Track' ? <TrackCard duration={timer}
                    distance={currentTrack.traveledDistance} /> : null}
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
