import 'react-native-gesture-handler';
import React, { useLayoutEffect, useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import AudioScreen from "../screens/AudioScreen";
import CategoryScreen from "../screens/CategoryScreen";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Icon from '../components/CustomIcons';
import Logo from '../components/Logo';
import PlayerScreen from '../screens/PlayerScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SearchScreen from '../screens/SearchScreen';
import HomeScreen from '../screens/HomeScreen';
import { AuthStateContext } from '../context/AuthContext';
import { HeaderStyleInterpolators } from '@react-navigation/stack';
import LeftNav from '../components/NavigationParts/leftNav';
import UserPreferences from '../screens/UserPreferences';
import { normalize } from '../utilities/normalize';
import RightNav from '../components/NavigationParts/rightNav';

const Stack = createStackNavigator();

const MainNavigation = ({ navigation, route }) => {
  const { user, isLoading } = useContext(AuthStateContext);
  useLayoutEffect(() => {
    const tabHiddenRoutes = ["Category", "Audio", "Player", "FTE"];
    if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({
        tabBarStyle: {
          display: 'flex',
          backgroundColor: '#212121',
          borderTopWidth: 0,
          height: normalize(66),
          paddingTop: normalize(8),
          paddingBottom: normalize(8),
        }
      });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator
      id="mainNav"
      screenOptions={({ navigation, route }) => ({
        headerTitle: (props) => <Logo {...props} />,
        headerTitleAlign: 'center',
        headerTransparent: false,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerStyle: { borderBottomWidth: 0, backgroundColor: '#000' },
        headerTintColor: '#FFF',
        headerRight: () => <RightNav />,
      })}>
      <Stack.Screen name="Home" component={HomeScreen} options={({ route }) => ({ headerStyleInterpolator: HeaderStyleInterpolators.forNoAnimation, headerTransparent: true, headerLeft: (props) => <LeftNav {...props} /> })} />
      <Stack.Screen name="FTE" component={UserPreferences} options={{ headerShown: false }} />
      <Stack.Screen name="Category" component={CategoryScreen} options={({ route }) => ({ title: route.params.title })} />
      <Stack.Screen name="Search" component={SearchScreen} options={({ route }) => ({ title: 'Search' })} />
      <Stack.Screen name="Audio" component={AudioScreen} options={({ route }) => ({ headerStyleInterpolator: HeaderStyleInterpolators.forNoAnimation, headerTransparent: true, })} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} options={({ route }) => ({ headerShown: false, presentation: 'modal', gestureDirection: 'vertical', gestureEnabled: true, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS })} />

    </Stack.Navigator>
  )
}

export default MainNavigation;