import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
import React, { useState, createRef, useEffect, useRef } from 'react';

import { StyleSheet, Text, View, TextInput, ScrollView, Image, TouchableOpacity, Keyboard, KeyboardAvoidingView, ActivityIndicator, SafeAreaView, FlatList, Button, Alert, Modal, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { setIsEnabledAsync } from 'expo-av/build/Audio';

const Stack = createNativeStackNavigator();

const SplashScreen = ({ navigation }) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  const getUserId = async () => {
    try {
      const uid = await AsyncStorage.getItem('user_id');
      navigation.navigate(
        uid === null ? 'Login' : 'Items'
      )
    } catch (error) {
      console.log('error', error);
    };
  }
  useEffect(() => {
    getUserId();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#080808', '#005498']}
        style={styles.containerGradient}
      >
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#d8534f" />
        </View>
      </LinearGradient>
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = useRef();

  const handleSubmitPress = () => {
    setErrortext('');
    Keyboard.dismiss();
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }

    let dataToSend = { email: userEmail, password: userPassword };
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
        //Header Defination
        'Content-Type':
          'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (!responseJson.status) {
          setErrortext(responseJson.message);
        } else {
          AsyncStorage.setItem('user_id', responseJson.user_id);
          navigation.replace('Items');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar
        animated={true}
        style="light"
      />
      <LinearGradient
        colors={['#080808', '#005498']}
        style={styles.containerGradient}

      >
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('./assets/thecoach_logo_white_small.png')}
            style={{
              width: 183,
              height: 50,
            }}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={(UserEmail) =>
              setUserEmail(UserEmail)
            }
            placeholder="Email"
            placeholderTextColor="#FFF"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() =>
              passwordInputRef.current.focus()
            }
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            ref={passwordInputRef}
            style={styles.inputStyle}
            onChangeText={(userPassword) =>
              setUserPassword(userPassword)
            }
            placeholder="Κωδικός"
            placeholderTextColor="#FFF"
            secureTextEntry={true}
            autoCapitalize="none"

          />
        </View>
        {errortext != '' ? (
          <Text style={styles.errorTextStyle}>
            {errortext}
          </Text>
        ) : null}
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={handleSubmitPress}>
          <Text style={styles.buttonTextStyle}>ΣΥΝΔΕΣΗ</Text>
        </TouchableOpacity>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const ItemsScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [hasSub, sethasSub] = useState(false);
  const [subText, setsubText] = useState();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [isLoaded, setisLoaded] = useState(false);
  const [AudioStatus, setAudioStatus] = useState({});
  const [positionMillis, setpositionMillis] = useState(0);
  const [playableDurationMillis, setplayableDurationMillis] = useState(0);
  const [durationMillis, setdurationMillis] = useState(1);
  const [sliderValue, setsliderValue] = useState(0);
  let playlistIndex, direction;
  const [sound, setSound] = useState();

  useEffect(() => {
    fetchAudioFiles();
  })

  const fetchAudioFiles = async () => {
    if (data.length === 0) {

      const resp = await fetch("https://thecoach.gr/index.php?option=com_imodeuserplans&task=app.audiolist&format=json&user_id=" + AsyncStorage.getItem('user_id'));
      const data = await resp.json();
      setData(data.list);
      sethasSub(data.sub);
      setsubText(data.subText);
      setLoading(false);
    }
  }

  const str_pad_left = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  const convertNumberToTime = (mili_secs) => {
    if (mili_secs < 1000) {
      return '00:00'
    }
    let total_seconds = mili_secs / 1000;
    total_seconds = Number((total_seconds).toFixed(0));

    let minutes = Math.floor(total_seconds / 60);
    if (minutes < 1) {
      minutes = 0;
    }
    let seconds = total_seconds - minutes * 60;

    let finalTime = str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
    return finalTime
  }

  const handlePlayPause = async () => {
    AudioStatus.isPlaying ? await sound.pauseAsync() : await sound.playAsync()
  }

  const moveAudio = async (value) => {
    if (sound === null) return;

    try {
      await sound.playFromPositionAsync(Math.floor(AudioStatus.durationMillis * value));
    } catch (error) {
      console.log('error inside onSlidingComplete callback', error);
    }
  }

  const calculateSeebBar = () => {
    if (AudioStatus.positionMillis !== null && AudioStatus.durationMillis !== null) {
      return AudioStatus.positionMillis / AudioStatus.durationMillis;
    }

    return 0;
  };

  const onPlaybackStatusUpdate = (playbackStatus) => {
    setAudioStatus(playbackStatus);
    if (AudioStatus.didJustFinish) {
      //nextTrack('next');
    }
  }

  const nextTrack = async (direction) => {
    await sound.unloadAsync();
    let newIndex = currentIndex;
    if (direction == 'next') {
      currentIndex < data.length - 1 ? (newIndex += 1) : (newIndex = 0)
    } else {
      currentIndex <= 0 ? (newIndex = data.length - 1) : (newIndex -= 1)
    }
    audioSelect(newIndex);
  }

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  const audioSelect = async (playlistIndex) => {

    setcurrentIndex(playlistIndex);
    if (sound != null) {
      if (playlistIndex != currentIndex) {
        await sound.unloadAsync();
      }
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: false
    });

    if (!modalVisible) {
      setModalVisible(true);
    }
    if (playlistIndex != currentIndex || !AudioStatus.isPlaying) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: data[currentIndex].url },
        {
          progressUpdateIntervalMillis: 1000,
          positionMillis: 0,
          shouldPlay: false,
          rate: 1.0,
          shouldCorrectPitch: false,
          volume: 1.0,
          isMuted: false,
          isLooping: false,
        },
        onPlaybackStatusUpdate
      );
      setSound(sound);
      await sound.playAsync();
    }

  }

  const AudioInfo = () => {
    return (
      <View style={styles.InfoContainer}>
        <Image
          source={
            { uri: data[currentIndex].cover }
          }
          style={{
            width: 220,
            height: 220,
            borderRadius: 10,
          }}
        />
        <Text style={styles.infoTitle}>{data[currentIndex].title}</Text>
      </View>
    );
  }

  const SeekBar = () => {
    return (
      <View style={styles.seekBarcontainer}>
        <Slider
          minimumValue={0}
          maximumValue={1}
          value={calculateSeebBar()}
          style={styles.slider}
          minimumTrackTintColor='#0176ff'
          //step={0.05}
          onValueChange={value => {

          }}
          onSlidingStart={async () => {
            if (!AudioStatus.isPlaying) return;
            sound.pauseAsync();
          }}
          onSlidingComplete={async (value) => {
            // if (!AudioStatus.isBuffering) return;
            await sound.playFromPositionAsync(Math.floor(AudioStatus.durationMillis * value));
          }}
        />

      </View>
    );
  }

  const AudioTimers = () => {

    return (
      <View style={styles.timesContainer}>
        <Text>{AudioStatus.isLoaded && AudioStatus.positionMillis > 0 ? convertNumberToTime(AudioStatus.positionMillis) : '00:00'}</Text>
        <Text>{AudioStatus.isLoaded ? convertNumberToTime(AudioStatus.durationMillis) : '00:00'}</Text>
      </View>
    );
  }
  const Controls = () => {
    return (
      <View style={styles.ControlsContainer}>
        <View>
          <TouchableOpacity onPress={() => nextTrack('prev')}>
            <Ionicons name="play-skip-back" size={30} color="#333" />
          </TouchableOpacity>
        </View>
        {AudioStatus.isPlaying ? (
          <View style={styles.controlButton}>
            <TouchableOpacity onPress={() => handlePlayPause()}>
              <Ionicons name="pause-circle" size={80} color="#0176ff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.controlButton}>
            <TouchableOpacity onPress={() => handlePlayPause()}>
              <Ionicons name="play-circle" size={80} color="#0176ff" />
            </TouchableOpacity>
          </View>
        )}
        <View>
          <TouchableOpacity onPress={() => nextTrack('next')}>
            <Ionicons name="play-skip-forward" size={30} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const AudioPlayer = () => {
    return (
      <View style={styles.audioPlayer}>
        <AudioInfo />
        {AudioStatus.isLoaded ? (
          <View>
            <SeekBar />
            <AudioTimers />
          </View>
        ) : (<View></View>)
        }
        <Controls />
      </View>
    );
  }


  const Item = (props) => (
    <View style={styles.item}>
      <View style={styles.innerItemTop}>
        <Image
          source={{ uri: props.img }}
          style={{
            width: 50,
            height: 50,
          }}
        />
        <Text style={styles.title}>{props.title}</Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{props.descr}</Text>
      </View>
      <View style={styles.innerItemBottom}>
        <TouchableOpacity style={styles.playbutton} onPress={() => audioSelect(props.index)}>
          {(currentIndex == props.index && AudioStatus.isPlaying) ? (
            <Ionicons name="pause-circle-sharp" size={20} color="#0176ff" />
          ) : (
            <Ionicons name="play-circle-sharp" size={20} color="#0176ff" />
          )}

          <Text style={styles.playbuttonText}>{props.duration}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <Item title={item.title} duration={item.duration} descr={item.description} img={item.img} url={item.url} index={index} />
  );

  const LogoBar = () => {
    return (
      <View style={styles.topBar}>
        <Image
          source={require('./assets/thecoach_logo_white_small.png')}
          style={{
            width: 146,
            height: 40,
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.main}>
      <LinearGradient
        colors={['#080808', '#005498']}
        style={styles.containerGradient}
      >
        {loading && (<View style={{ height: '100%', justifyContent: 'center' }}><ActivityIndicator size="large" color="#d8534f" /></View>)}
        {data.length > 0 ? (
          <View>
            <StatusBar
              animated={true}
              style="light"
            />
            <LogoBar />
            {!hasSub ? (
              <View style={styles.messageContainer}>
                <Text style={styles.messageContainerText}>{subText}</Text>
              </View>
            ) : (
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
              />
            )
            }
          </View>
        ) : (<View></View>)}
      </LinearGradient>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView} >
          <TouchableOpacity style={styles.closeHandler} onPress={() => {
            setModalVisible(!modalVisible);
          }}>
            <View></View>
          </TouchableOpacity>
          <View style={styles.modalView}>
            <AudioPlayer />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const App = () => {
  useKeepAwake();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Items"
          component={ItemsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  main: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  containerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
    maxWidth: 480,
    width: '100%',
    justifyContent: 'center',
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
    height: 40,
    justifyContent: 'center',
    maxWidth: 300,
  },
  buttonStyle: {
    backgroundColor: '#d8534f',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#d8534f',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
    width: '100%',
    maxWidth: 300,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  topBar: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    padding: 10,
    paddingTop: 20,
  },
  listcontainer: {

  },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  innerItemTop: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    alignSelf: 'center',
    paddingLeft: 20,
  },
  descriptionContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
  },
  descriptionText: {

  },
  playbutton: {
    flex: 1,
    flexDirection: 'row',
    width: 100,
    flexGrow: 0,
    borderWidth: 1,
    borderRadius: 30,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: '#dadce0',
    alignItems: 'center',
  },
  playbuttonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '700',
    paddingLeft: 5,
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  closeHandler: {
    elevation: 5,
    height: '20%',
  },
  modalView: {
    elevation: 5,
    backgroundColor: '#fff',
    height: '80%',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  InfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  infoTitle: {
    width: '100%',
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
    fontWeight: '700',
  },
  ControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    paddingLeft: 17,
    paddingRight: 10,
    justifyContent: 'center',
  },
  timesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    height: '80%',
  },
  messageContainerText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  }
});


