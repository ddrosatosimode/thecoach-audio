import { AlegreyaSans_400Regular, AlegreyaSans_500Medium_Italic, AlegreyaSans_700Bold, AlegreyaSans_800ExtraBold } from '@expo-google-fonts/alegreya-sans';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Text, KeyboardAvoidingView, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import logobig from "../../assets/coach_logo_big.png";
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { AuthStateContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';

const LoginScreen = ({ navigation, route }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errortext, setErrortext] = useState('');
  const passwordInputRef = useRef();
  const { signIn } = useContext(AuthStateContext);

  useEffect(() => {
    getValueFromAsync();
  }, [])

  const getValueFromAsync = async () => {
    const email = await AsyncStorage.getItem('tc_user_email');
    const password = await AsyncStorage.getItem('tc_user_pass');
    if (email && password) {
      setUserEmail(email);
      setUserPassword(password);
    }
  }

  const handleSubmit = async () => {
    setErrortext('');
    Keyboard.dismiss();
    if (!userEmail) {
      alert('Το email δεν μπορεί να είναι κενό');
      return;
    }
    if (!userPassword) {
      alert('Το Password δεν μπορεί να είναι κενό');
      return;
    }

    let dataToSend = { email: userEmail, password: userPassword, version: 2 };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = '&' + formBody.join('&');

    fetch('https://thecoach.gr/index.php?option=com_imodeuserplans&task=app.loggin&format=json', {
      method: 'POST',
      body: formBody,
      headers: {
        'Content-Type':
          'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (!responseJson.status) {
          setErrortext(responseJson.message);
        } else {
          const jsonValue = JSON.stringify(responseJson.user);
          AsyncStorage.setItem('user', jsonValue);
          AsyncStorage.setItem('tc_user_email', userEmail);
          AsyncStorage.setItem('tc_user_pass', userPassword);
          signIn(responseJson.user);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePress = () => {
    Linking.openURL('https://thecoach.gr/anaktisi-password');
  }


  return (

    <KeyboardAvoidingView style={styles.container}>
      <StatusBar translucent={true} setBackgroundColor={'transparent'} style='light'></StatusBar>
      <LinearGradient
        colors={['#1E5391', '#090A0C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 0.9 }}
        style={styles.container}
      >
        <Image style={{ width: 170, height: 60 }} source={logobig} />
        <Text style={styles.bigTitle}>Σύνδεση</Text>
        <Text style={styles.smallTitle}>Μόνο για μέλη</Text>
        <TextInput
          style={[styles.inputStyle, { marginTop: 43 }]}
          onChangeText={UserEmail => setUserEmail(UserEmail)}
          defaultValue={userEmail}
          placeholder="EMAIL"
          placeholderTextColor="#FFF"
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() =>
            passwordInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          ref={passwordInputRef}
          style={styles.inputStyle}
          onChangeText={userPassword => setUserPassword(userPassword)}
          defaultValue={userPassword}
          placeholder="ΚΩΔΙΚΟΣ"
          placeholderTextColor="#FFF"
          secureTextEntry={true}
          autoCapitalize="none"
        />
        {errortext != '' ? <Text style={styles.errorTextStyle}>{errortext}</Text> : null}
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={handleSubmit}>
          <Text style={styles.buttonTextStyle}>Σύνδεση</Text>
        </TouchableOpacity>
        <Text style={styles.resetText} onPress={() => { handlePress }}>Ξέχασες τον κωδικό;</Text>
        {/*<TouchableOpacity
          style={[styles.buttonStyle, styles.freepassbtn]}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('FreePass')}>
          <Text style={styles.buttonTextStyle}>Free Pass</Text>
        </TouchableOpacity>*/}
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  gradient: {
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
  resetText: {
    fontSize: 17,
    fontFamily: 'AlegreyaSans_400Regular',
    marginTop: 30,
    lineHeight: 23,
    color: '#fff'
  },
  inputStyle: {
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    fontFamily: 'AlegreyaSans_800ExtraBold',
    color: '#fff',
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 16,
    width: 300,
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
  freepassbtn: {
    backgroundColor: '#000',
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'AlegreyaSans_700Bold',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
})