import 'react-native-gesture-handler';
import React, { useCallback, useState, useEffect, createContext, useContext, createRef } from "react";
import "react-native-gesture-handler";
import { NavigationContainer, useNavigationContainerRef, DefaultTheme } from "@react-navigation/native";
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { AlegreyaSans_400Regular, AlegreyaSans_700Bold, AlegreyaSans_800ExtraBold } from '@expo-google-fonts/alegreya-sans';
import { PlayerProvider, TimerProvider } from './src/context/PlayerContext';
import AudioPlayerMini from './src/components/AudioPlayer';
import { AuthProvider } from './src/context/AuthContext.js';
import BottomTabsNav from './src/navigation/BottomTabsNav';
import { DataProvider } from './src/context/DataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideBarFilters from './src/components/SideBarFilters';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

function App() {
  const navigationRef = useNavigationContainerRef();
  const [activeRoute, setActiveRoute] = useState(null);
  const [activeRouteId, setActiveRouteId] = useState(0);
  const [appIsReady, setAppIsReady] = useState(false);
  const [openSide, setOpenSide] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({ AlegreyaSans_400Regular, AlegreyaSans_700Bold, AlegreyaSans_800ExtraBold, IcoMoon: require('./assets/icomoon/icomoon.ttf') });
      } catch (e) {
        alert(e);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }
    loadResourcesAndDataAsync();
  }, []);
  if (!appIsReady) {
    return <></>
  }
  return (
    <AuthProvider>
      <DataProvider>
        <PlayerProvider>
          <TimerProvider>
            <NavigationContainer
              ref={navigationRef}
              theme={navTheme}
              onReady={() => { setActiveRoute(navigationRef.current.getCurrentRoute().name) }}
              onStateChange={() => {
                if (navigationRef.current.getCurrentRoute().params?.aid) {
                  setActiveRouteId(navigationRef.current.getCurrentRoute().params.aid);
                }
                setActiveRoute(navigationRef.current.getCurrentRoute().name);
              }}
            >
              <BottomTabsNav openSide={openSide} setOpenSide={setOpenSide} />
            </NavigationContainer>
            <AudioPlayerMini activeRoute={activeRoute} activeRouteId={activeRouteId} />
            <SideBarFilters nav={navigationRef} />
          </TimerProvider>
        </PlayerProvider>
      </DataProvider>
    </AuthProvider>
  )
}
export default () => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={{ width: '100%', height: '100%' }}>
        <RootSiblingParent>
          <App />
        </RootSiblingParent>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}