import { AlegreyaSans_400Regular, AlegreyaSans_500Medium_Italic, AlegreyaSans_700Bold, AlegreyaSans_800ExtraBold } from '@expo-google-fonts/alegreya-sans';
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import logobig from "../../assets/coach_logo_big.png";

const InitialScreen = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <StatusBar translucent={true} setBackgroundColor={'transparent'} style='light'></StatusBar>
      <LinearGradient
        colors={['#1E5391', '#090A0C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 0.9 }}
        style={styles.container}
      >
        <Image style={{ width: 170, height: 60 }} source={logobig} />
        <View style={styles.action}>
          <Text style={styles.bigTitle}>Σύνδεση</Text>
          <Text style={styles.smallTitle}>Μόνο για μέλη</Text>
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={() => { navigation.navigate('Login') }}>
            <Text style={styles.buttonTextStyle}>Σύνδεση</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.action}>
          <Text style={styles.bigTitle}>Εγγραφή</Text>
          <Text style={styles.smallTitle}>Νέος χρήστης</Text>
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={() => { navigation.navigate('Register') }}>
            <Text style={styles.buttonTextStyle}>Εγγραφή</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  bigTitle: {
    fontSize: 36,
    fontFamily: 'AlegreyaSans_800ExtraBold',
    lineHeight: 43,
    color: '#fff',
    marginTop: 22
  },
  smallTitle: {
    fontSize: 15,
    fontFamily: 'AlegreyaSans_400Regular',
    lineHeight: 18,
    color: '#fff',
  },
  buttonStyle: {
    width: 300,
    maxWidth: 300,
    borderRadius: 50,
    height: 60,
    maxHeight: 60,
    backgroundColor: '#0176FF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'AlegreyaSans_700Bold',
  },
  action: {
    alignItems: "center",
    paddingVertical: 10
  }
});
export default InitialScreen;