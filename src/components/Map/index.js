import * as React from "react";
import { WebView } from 'react-native-webview';

const Map = ({ track }) => {
    const url = 'https://www.google.com/maps/dir/' + track.startPoint.lat + ',' + track.startPoint.long + '/' + track.endPoint.lat + ',' + track.endPoint.long;
    return (
        <WebView
            source={{ uri: url }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
        />
    );
};

export default Map;
