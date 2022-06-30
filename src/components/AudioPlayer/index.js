import { AlegreyaSans_400Regular, AlegreyaSans_700Bold } from "@expo-google-fonts/alegreya-sans";
import { Audio } from "expo-av";
import { useState, useEffect, useContext } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Animated, PanResponder } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { PlayerStateContext, TimerStateContext } from "../../context/PlayerContext";
import Icon from '../CustomIcons'
import { AuthStateContext } from "../../context/AuthContext";
import { normalize } from "../../utilities/normalize";
import MaskedView from '@react-native-masked-view/masked-view';
import SvgMask from "../SvgComp/SvgMask";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SvgClose from "./svgClose";

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const playerW = SCREEN_WIDTH - normalize(15);
const playerT = SCREEN_HEIGHT - normalize(140);
const vert = -(SCREEN_HEIGHT - 200);

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


const AudioPlayerMini = ({ activeRoute, activeRouteId }) => {
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthStateContext);
  const { audio, pushAudio, pushPlay, mini, isPlaying: ctxPlaying, pushDuration, seekTo, goSeek, openMini, stop } = useContext(PlayerStateContext);
  const { pushProgress, pushPlaySeconds } = useContext(TimerStateContext);
  const [sound, setSound] = useState();
  const [isPlaying, setisPlaying] = useState(false);
  const [AudioStatus, setAudioStatus] = useState({});
  const [audioProgress, setAudioProgress] = useState('00:00');
  const [duration, setAudioDurations] = useState('00:00');

  const handlePlayPause = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
      setisPlaying(false);
      pushPlay(false);
    } else {
      await sound.playAsync();
      setisPlaying(true);
      pushPlay(true);
    }
  }
  const handleStop = async () => {

  }
  const removeMini = async () => {
    pushPlay(false);
    openMini(false);
    if (sound && AudioStatus.isLoaded) {
      sound.unloadAsync();
      setSound(null);
    }
    pushAudio({});

  }
  useEffect(() => {
    if (!user) {
      pushPlay(false);
      pushAudio({});
      openMini(false);
    }
  }, [user])

  useEffect(() => {
    if (sound && !ctxPlaying) {
      sound.pauseAsync();
      setisPlaying(false);
    }
    if (sound && ctxPlaying) {
      sound.playAsync();
      setisPlaying(true);
    }
  }, [sound, ctxPlaying])

  useEffect(() => {
    if (sound && seekTo != 0) {
      sound.playFromPositionAsync(Math.floor(audioProgress + (seekTo * 1000)));
      goSeek(0);
    }
  }, [sound, seekTo])

  useEffect(() => {
    if (sound && audio.start) {
      sound.playFromPositionAsync(audio.start);
    }
  }, [sound, audio.start]);

  const onPlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.positionMillis > 0) {
      setAudioProgress(playbackStatus.positionMillis);
      pushProgress(convertNumberToTime(playbackStatus.positionMillis))
      pushPlaySeconds(Math.floor(playbackStatus.positionMillis / 1000));
    }
    if (AudioStatus.didJustFinish) {

    }
  }

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
        setSound(null);
      }
      : undefined;
  }, [sound]);

  const audioSelect = async (audio) => {
    if (sound != null || (stop && sound != null)) {
      setAudioStatus({});
      await sound.unloadAsync();
      setisPlaying(false);
      setSound(null);
    }

    if (audio?.source) {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: audio.source },
        {
          progressUpdateIntervalMillis: 1000,
          positionMillis: 0,
          shouldPlay: true,
          rate: 1.0,
          shouldCorrectPitch: false,
          volume: 1.0,
          isMuted: false,
          isLooping: false,
        },
        onPlaybackStatusUpdate
      );
      setSound(sound);
      setAudioStatus(status);
      setAudioDurations(convertNumberToTime(status.durationMillis));
      pushDuration(convertNumberToTime(status.durationMillis));
      if (audio.start > 0) {
        try {
          await sound.playFromPositionAsync(audio.start);
        } catch (e) {
          console.log(e);
        }
      } else {
        await sound.playAsync();
      }
      setisPlaying(true);
      pushPlay(true);
    }
  }

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: 1,
      interruptionModeAndroid: 2,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    audioSelect(audio);

  }, [audio]);
  return (
    <>
      {audio && AudioStatus.isLoaded && mini && activeRoute != 'Profile' && activeRoute != 'FTE' && !stop ?
        <TouchableOpacity activeOpacity={.7} delayLongPress={2000} onLongPress={() => removeMini()}
          style={[styles.miniplay, { top: playerT }]}>
          {activeRoute == 'Audio' && (activeRouteId != audio.id || !isPlaying) ?
            <MaskedView style={{ flex: 1, flexDirection: "row", height: normalize(48), width: "100%" }} maskElement={
              <View style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', height: normalize(48) }}>
                <SvgMask w={normalize(320)} h={normalize(50)} />
              </View>
            }>
              <LinearGradient style={{ flex: 1, flexDirection: "row", alignItems: "center", height: normalize(48), maxHeight: normalize(48), width: "100%", paddingHorizontal: normalize(12) }} colors={['#1E5391', '#1E5391']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.9, y: 0.9 }}>
                <TouchableOpacity style={styles.playpause} onPress={() => handlePlayPause()}>
                  {isPlaying ? <Icon name="pause" size={normalize(8)} color='#fff' /> : <Icon name="play" size={normalize(8)} color='#fff' />}
                </TouchableOpacity>
                <Text style={{ color: '#fff', flexGrow: 1, paddingHorizontal: 10, fontSize: normalize(14), lineHeight: normalize(14), fontFamily: 'AlegreyaSans_700Bold' }}>{audio ? audio.title : null}</Text>
                <Text style={{ color: '#fff', fontSize: normalize(12), lineHeight: normalize(12), fontFamily: 'AlegreyaSans_400Regular' }}>{convertNumberToTime(audioProgress)}</Text>
                <TouchableOpacity style={[styles.playpause, { backgroundColor: 'red', marginRight: 0, marginLeft: 10 }]} onPress={() => removeMini()}>
                  <SvgClose />
                </TouchableOpacity>
              </LinearGradient>
            </MaskedView> : <LinearGradient style={{ flex: 1, flexDirection: "row", alignItems: "center", height: normalize(48), maxHeight: normalize(48), width: "100%", paddingHorizontal: normalize(12), borderRadius: normalize(11), }} colors={['#1E5391', '#1E5391']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.9, y: 0.9 }}>
              <TouchableOpacity style={styles.playpause} onPress={() => handlePlayPause()}>
                {isPlaying ? <Icon name="pause" size={normalize(8)} color='#fff' /> : <Icon name="play" size={normalize(8)} color='#fff' />}
              </TouchableOpacity>
              <Text style={{ color: '#fff', flexGrow: 1, paddingHorizontal: 10, fontSize: normalize(14), lineHeight: normalize(14), fontFamily: 'AlegreyaSans_700Bold' }}>{audio ? audio.title : null}</Text>
              <Text style={{ color: '#fff', fontSize: normalize(12), lineHeight: normalize(12), fontFamily: 'AlegreyaSans_400Regular' }}>
                {audioProgress && audioProgress > 0 ? convertNumberToTime(audioProgress) : '00:00'}
              </Text>
              <TouchableOpacity style={[styles.playpause, { backgroundColor: 'red', marginRight: 0, marginLeft: 10 }]} onPress={() => removeMini()}>
                <SvgClose />
              </TouchableOpacity>
            </LinearGradient>}
        </TouchableOpacity>
        : null}
    </>
  )
}

export default AudioPlayerMini;

const styles = StyleSheet.create({
  miniplay: {
    flex: 1,
    flexDirection: "row",
    height: normalize(48),
    position: 'absolute',
    zIndex: 1,
    elevation: 1,
    left: normalize(8),
    width: playerW,
    flexGrow: 1,
    alignItems: "center",
    //paddingHorizontal: normalize(12),
    //borderRadius: normalize(11),
  },
  playpause: {
    maxWidth: normalize(25),
    height: normalize(25),
    borderRadius: 50,
    marginRight: 10,
    backgroundColor: '#0176FF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})