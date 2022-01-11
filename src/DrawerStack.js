import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';
import History from './screens/History';
import TrackDetails from './screens/TrackDetails';

const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={Home} />
                <Drawer.Screen name="History" component={History} />
                <Drawer.Screen name="Track Details" component={TrackDetails}
                    options={{
                        drawerItemStyle: { height: 0 }
                    }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}