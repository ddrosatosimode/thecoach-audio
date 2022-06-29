import 'react-native-gesture-handler';
import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Dimensions, ScrollView, Image } from 'react-native';
import Logo from '../components/Logo';
import Icon from '../components/CustomIcons'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import TrainerBox from '../components/AudioBox/trainer';
import AudioInfo from '../components/AudioBox/info';
import { AlegreyaSans_400Regular } from '@expo-google-fonts/alegreya-sans';
import SvgMinus from '../components/SvgComp/SvgMinus';
import SvgPlus from '../components/SvgComp/SvgPlus';
import AudioBottomBar from '../components/AudioBottomBar';
import { PlayerStateContext, TimerStateContext } from '../context/PlayerContext';
import { useFocusEffect } from '@react-navigation/native';
import SvgLine from '../components/SvgComp/SvgLine';
import { normalize } from '../utilities/normalize';
import wave from "../../assets/soundwave.png";
import SvgStop from '../components/SvgComp/SvgStop';

const window = Dimensions.get("window");
const ww = window.width;
const usableCenter = ww / 2;
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

const PlayerScreen = ({ navigation, route }) => {
  const ref = useRef();
  const { audio: p, isPlaying, openMini, pushPlay, duration, goSeek, pushStop } = useContext(PlayerStateContext);
  const { playProgress, playSeconds, pushProgress, pushPlaySeconds } = useContext(TimerStateContext);
  const [currentProgress, setCurrentProgress] = useState('00:00');
  const [localDuration, setLocalDuration] = useState(0);
  const handlePlayPause = async () => {
    pushPlay(!isPlaying)
  }

  const handleSeek = async (e) => {
    goSeek(e);
  }

  const handleStop = () => {
    pushPlay(false);
    pushStop();
    closeModal();
  }
  const closeModal = () => {
    navigation.getParent()?.goBack();
  }
  const convertToMili = (tm) => {
    let parts = tm.split(':');
    let seconds = (parseInt(parts[0]) * 60) + parseInt(parts[1]);
    return seconds;
  }
  useEffect(() => {
    if (playProgress) {
      setCurrentProgress(playProgress);
      let total = convertToMili(duration);
      if (localDuration == 0) {
        setLocalDuration(total);
      }
    }
  }, [playProgress])

  useFocusEffect(
    useCallback(() => {
      return () => {
        openMini(true);
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#000" translucent={true} style="light" animated={true} />
      <ImageBackground style={{ flex: 1 }} source={{ uri: p.bgimage }} resizeMode="cover">
        <LinearGradient
          colors={['#000', 'rgba(22, 55, 93, 0)']}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />

        <View style={{ flex: 1, color: '#fff' }}>
          <View style={styles.modalheader}>
            <Logo />
            <TouchableOpacity onPress={() => closeModal()}><Icon name="chevron-down" size={normalize(19)} color="#fff" /></TouchableOpacity>
          </View>
          <View style={styles.playerWrapper}>
            <View style={styles.playerInfo}>
              <TrainerBox title={p.trainer.userName} img={p.trainer.img} />
              <AudioInfo title={p.title} />
            </View>
            <View style={styles.mainPlayer}>
              <View style={{ position: 'absolute', top: normalize(23), left: 0, width: '100%', overflow: 'hidden', maxHeight: normalize(178), height: normalize(178) }}>
                <Image style={{
                  resizeMode: "repeat",
                  height: normalize(200),
                  maxHeight: normalize(200),
                  width: localDuration * 3,
                  transform: [
                    {
                      translateX: (usableCenter - ((playSeconds - 3) * 3))
                    }
                  ]
                }}
                  source={wave} />
                <View style={{
                  position: 'absolute', top: 0, left: 0, width: playSeconds * 3, overflow: 'hidden', maxHeight: normalize(200), height: normalize(200), transform: [
                    {
                      translateX: (usableCenter - ((playSeconds - 3) * 3))
                    }
                  ]
                }}>
                  <Image style={{ resizeMode: "repeat", width: localDuration * 3, maxHeight: normalize(200), tintColor: "#FADA6B", }} source={wave} />
                </View>
              </View>
              <View style={styles.playerTimer}>
                <Text style={[styles.playerNumber, { color: '#fff' }]}>{currentProgress ? currentProgress : '00:00'}</Text>
                <SvgLine st={{ transform: [{ translateY: -30 }] }} />
                <Text style={[styles.playerNumber, { color: '#E4E4E4' }]}>{duration}</Text>
              </View>
              <View style={styles.playerControls}>
                <View style={{ flexGrow: 1 }}></View>
                <TouchableOpacity style={styles.seekbtn} onPress={() => handleSeek(-15)}><SvgMinus /></TouchableOpacity>
                <TouchableOpacity style={styles.playpause} onPress={() => handlePlayPause()}>
                  {isPlaying ? <Icon name="pause" size={normalize(31)} color='#fff' /> : <Icon name="play" size={normalize(31)} color='#fff' />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.seekbtn} onPress={() => handleSeek(+15)}><SvgPlus /></TouchableOpacity>
                <View style={{ flexGrow: 1, flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}><TouchableOpacity style={{ marginRight: 15 }} onPress={() => handleStop()}><SvgStop /></TouchableOpacity></View>
              </View>
            </View>
          </View>
        </View>
        <AudioBottomBar ww={ww} navigation={navigation} handleModalOpen={false} inside={true} aid={p.id} sharer={p.title} url={p.source} />
      </ImageBackground>
    </SafeAreaView>
  )
}

export default PlayerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  soundwave: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    width: '100%',
    marginHorizontal: 2,
    alignItems: 'center'
  },
  bar: {
    width: 2,
    height: 100,
    marginHorizontal: 2,
    backgroundColor: '#FFF',
  },
  modalheader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxHeight: normalize(47),
    paddingHorizontal: normalize(20),
  },
  playerWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: normalize(47),
    paddingTop: normalize(12),
    //paddingHorizontal: 30,
  },
  playerInfo: {
    paddingHorizontal: normalize(23),
  },
  mainPlayer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  playerTimer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    maxHeight: normalize(34),
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: normalize(8),
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderStyle: 'solid',
    borderRadius: 6,
    minWidth: normalize(87),
  },
  playerNumber: {
    alignSelf: 'center',
    fontSize: normalize(13),
    paddingHorizontal: 8,
    fontFamily: 'AlegreyaSans_400Regular',
    flexBasis: normalize(44),
    textAlign: 'center'
  },
  playerControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: normalize(31),
    maxHeight: normalize(72),
    width: '100%',
  },
  seekbtn: {
    maxWidth: normalize(35),
    height: normalize(35),
    borderRadius: 50,
    backgroundColor: '#212121',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playpause: {
    maxWidth: normalize(72),
    height: normalize(72),
    borderRadius: 50,
    marginHorizontal: normalize(19),
    backgroundColor: '#0176FF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
