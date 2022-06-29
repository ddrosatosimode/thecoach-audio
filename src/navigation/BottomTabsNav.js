import React, { useContext } from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FavoritesScreen from "../screens/FavoritesScreen";
import MyScheduleScreen from "../screens/MySchedule";
import ProfileScreen from "../screens/Profile";
import homeicon from '../../assets/home_icon.png';
import Icon from '../components/CustomIcons';
import { AlegreyaSans_400Regular } from '@expo-google-fonts/alegreya-sans';
import LeftNav from '../components/NavigationParts/leftNav';
import Logo from '../components/Logo';
import RightNav from '../components/NavigationParts/rightNav';
import { AuthStateContext } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import MainNavigation from './MainNavigation';
import { normalize } from '../utilities/normalize';
const Tab = createBottomTabNavigator();

const BottomTabsNav = ({ navigation, route }) => {
  const { user, isLoading } = useContext(AuthStateContext);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#212121',
          height: normalize(66),
          paddingTop: normalize(8),
          paddingBottom: normalize(8),
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'AlegreyaSans_400Regular',
          margin: 0,
        },
        tabBarItemStyle: {
          margin: 5,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
        headerTitle: (props) => <Logo {...props} />,
        headerTitleAlign: 'center',
        headerTransparent: false,
        headerStyle: { borderBottomWidth: 0, backgroundColor: '#000' },
        headerLeft: (props) => <LeftNav {...props} />,
        headerRight: (props) => <RightNav {...props} />,
        tabBarIcon: () => {
          let iconName;
          if (route.name === 'Overview' || route.name === 'Home') {
            return <Image style={{ width: normalize(23), height: normalize(12) }} source={homeicon} />
          } else if (route.name === 'Favorites') {
            return <Icon name="hearts" size={normalize(19)} color="white" />
          } else if (route.name === 'MySchedule') {
            return <Icon name="calendar" size={normalize(19)} color="white" />
          }
        },
      })}
    >

      {isLoading ? (
        <Tab.Screen name="Splash" component={SplashScreen} options={{ headerShown: false, tabBarStyle: { height: 0, borderTopWidth: 0, } }} />
      ) : user == null ? (
        <Tab.Screen name="Login" component={LoginScreen} options={{ headerShown: false, tabBarStyle: { height: 0, borderTopWidth: 0, } }} />
      ) : (
        <>
          <Tab.Screen name="Overview" component={MainNavigation} options={{ title: 'The Coach', headerShown: false }} />
          <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Αγαπημένα' }} />
          <Tab.Screen name="MySchedule" component={MyScheduleScreen} ptions={{ title: 'To Πρόγραμμά μου' }} />
          <Tab.Screen name="Profile" component={ProfileScreen}
            options={{
              title: 'Προφίλ',
              tabBarLabel: 'Προφίλ',
              tabBarIcon: ({ color, size }) => (
                <Icon name="user" size={normalize(19)} color={color} />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  )
}

export default BottomTabsNav;