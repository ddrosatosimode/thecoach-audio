import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity } from "react-native"
import logobig from "../../assets/coach_logo_big.png";
import { useState } from "react";
import { AuthStateContext } from "../context/AuthContext";
import { useContext } from "react";
import { TextInput } from "react-native";
import { useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation, route }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errortext, setErrortext] = useState('');
  const { signIn } = useContext(AuthStateContext);
  const passwordInputRef = useRef();
  const emailInputRef = useRef();

  const isValidEmail = (value) => {
    // Simple email validation using regular expression
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return emailRegex.test(value);
  };
  const handleSubmit = async () => {
    setErrortext('');
    Keyboard.dismiss();
    if (!userName) {
      setErrortext('Το όνομα δεν μπορεί να είναι κενό');
      return;
    }
    if (!userEmail) {
      setErrortext('Το email δεν μπορεί να είναι κενό');
      return;
    }
    if (!isValidEmail(userEmail)) {
      setErrortext('Το email δεν είναι έγκυρο');
      return;
    }
    if (!userPassword) {
      setErrortext('Το Password δεν μπορεί να είναι κενό');
      return;
    }
    let dataToSend = { email: userEmail, password: userPassword, name: userName };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = '&' + formBody.join('&');
    try {
      const register = await fetch('https://thecoach.gr/index.php?option=com_imodeuserplans&task=app.register_app&format=json', {
        method: 'POST',
        body: formBody,
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
      const response = await register.json();
      if (!response.success) {
        setErrortext(response.message);
      } else {
        const jsonValue = JSON.stringify(response.data.user);
        AsyncStorage.setItem('user', jsonValue);
        AsyncStorage.setItem('tc_user_email', userEmail);
        AsyncStorage.setItem('tc_user_pass', userPassword);
        signIn(response.data.user);
      }
    } catch (error) {
      console.error(error);
    }
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
        <Text style={styles.bigTitle}>Εγγραφή</Text>
        <TextInput
          style={[styles.inputStyle, { marginTop: 43 }]}
          onChangeText={UserName => setUserName(UserName)}
          defaultValue={userName}
          placeholder="ΟΝΟΜΑ"
          placeholderTextColor="#FFF"
          autoCapitalize="none"
          keyboardType="text"
          returnKeyType="next"
          onSubmitEditing={() =>
            emailInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          ref={emailInputRef}
          style={[styles.inputStyle]}
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
          <Text style={styles.buttonTextStyle}>Εγγραφή</Text>
        </TouchableOpacity>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}
export default RegisterScreen;

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
    backgroundColor: '#d8534f',
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
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
})