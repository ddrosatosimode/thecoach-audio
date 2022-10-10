import { AlegreyaSans_400Regular, AlegreyaSans_500Medium_Italic, AlegreyaSans_700Bold, AlegreyaSans_800ExtraBold } from '@expo-google-fonts/alegreya-sans';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useContext } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import * as geolib from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStateContext } from '../context/AuthContext';

const FreepassScreen = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [allowed, setAllowed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const { signIn } = useContext(AuthStateContext);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLocation(null);
      setAllowed(null);
      setLoading(true);
      setErrorMsg(null);
    })
  }, [navigation]);

  useEffect(() => {
    if (!location) {
      (async () => {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        if (loc) {
          setLocation(loc);
          setLoading(false);
          //const lat = 38.01644123926392;
          //const lng = 23.73499865581623;
          const lat = loc.coords.latitude;
          const lng = loc.coords.longitude;
          if (lat && lng) {
            let inside = geolib.isPointInPolygon({ latitude: lat, longitude: lng }, [
              { latitude: 38.01766466943315, longitude: 23.734825667991636 },
              { latitude: 38.0176380404046, longitude: 23.735530149075466 },
              { latitude: 38.01569972473228, longitude: 23.735450361881 },
              { latitude: 38.015860951281354, longitude: 23.734472862734126 },
            ]);
            //inside = true;
            if (inside) {
              setAllowed(true);
              const now = new Date();
              const trialUser = {
                id: 99999,
                name: '',
                username: 'GeoPass',
                activeSub: false,
                locationSub: now.getTime() + 7200000

              }
              AsyncStorage.setItem('user', JSON.stringify(trialUser));
              signIn(trialUser);
            } else {
              setAllowed(false);
            }
          }

        }
      })();
    }
  }, [navigation, location]);

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} setBackgroundColor={'transparent'} style='light'></StatusBar>
      <LinearGradient
        colors={['#1E5391', '#090A0C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 0.9 }}
        style={styles.container}
      >
        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> :
          <>
            <Text style={styles.title}>Προσδιορισμός Θέσης</Text>
            {loading && <ActivityIndicator size="large" color="#00ff00" />}
            {!loading && allowed && <Text style={styles.title_small}>Success</Text>}
            {!loading && !allowed && <Text style={[styles.title_small, styles.error]}>Δεν επιτρέπεται η πρόσβαση</Text>}
          </>
        }
      </LinearGradient>
    </View>
  )
}

export default FreepassScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontFamily: 'AlegreyaSans_800ExtraBold',
    lineHeight: 43,
  },
  error: {
    color: 'red',
    fontSize: 18,
    lineHeight: 24,
    marginTop: 10
  },
  title_small: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 24,
  },
})