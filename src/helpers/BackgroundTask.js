import BackgroundService from 'react-native-background-actions';

export const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

export const interval = 3;
const intervalInMilliseconds = interval * 1000;

const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#2185d0',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
        delay: intervalInMilliseconds,
    },
};


export const startTracking = async (veryIntensiveTask) => {
    await BackgroundService.start(veryIntensiveTask, options);
    BackgroundService.isRunning
}
export const stopTracking = async () => { await BackgroundService.stop(); }

export const isTracking = () => { return BackgroundService.isRunning(); }