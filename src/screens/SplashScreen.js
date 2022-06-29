import { useContext, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, Image, useWindowDimensions } from 'react-native';
import logobig from "../../assets/coach_logo_big.png";
import gif from "../../assets/animation_640_l42xbavh.gif"
import { StatusBar } from 'react-native'
import { AuthStateContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SplashScreen = () => {
  const window = useWindowDimensions();
  const { user, isLoading, openLogin, signIn } = useContext(AuthStateContext);

  return (
    <>
      <View style={styles.container}>
        <StatusBar hidden={true}></StatusBar>
        <LinearGradient
          colors={['#1E5391', '#090A0C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.9, y: 0.9 }}
          style={styles.gradient}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: 255, height: 90 }} source={logobig} />
            <Image style={{ justifyContent: 'center', alignItems: 'center', maxWidth: 640, width: window.width, height: window.width }} source={gif} />
          </View>
        </LinearGradient>
      </View>
    </>
  )
}
export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})