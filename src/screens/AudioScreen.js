import React, { useContext } from 'react';
import { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Animated, Dimensions, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import FadingImage from "../components/FadingImage";
import TrainerBox from "../components/AudioBox/trainer";
import AudioInfo from "../components/AudioBox/info";
import { AlegreyaSans_400Regular, AlegreyaSans_700Bold } from "@expo-google-fonts/alegreya-sans";
import Icon from '../components/CustomIcons'
import AudioBottomBar from "../components/AudioBottomBar";
import { PlayerStateContext } from '../context/PlayerContext';
import { normalize } from '../utilities/normalize';
import { DataStateContext } from '../context/DataContext';
import { useSingleAudio } from '../hooks/ItemsData';
import * as Analytics from 'expo-firebase-analytics';
import AudioSections from '../components/AudioBox/sections';
import { AuthStateContext } from '../context/AuthContext';

const window = Dimensions.get("window");
const bgHeight = window.height * 0.6;
const contentStart = window.height * 0.4;
const ww = window.width;

const AudioScreen = ({ navigation, route }) => {
  const { pushAudio, openMini } = useContext(PlayerStateContext);
  const { downloads } = useContext(AuthStateContext)
  const scrollY = useRef(new Animated.Value(0)).current;
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, contentStart / 2, contentStart],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const { api_data } = useContext(DataStateContext);

  const [stbar, setStBar] = useState(false);

  useEffect(() => {
    if (api_data) {
      useSingleAudio(api_data, route.params.aid, setData, setLoading);
    }
  }, [api_data, route.params.aid]);

  const handleAudioStart = (sick = 0) => {
    if (isLoading) {
      return false;
    }
    try {
      if (data) {
        Analytics.logEvent('audio_start', {
          screen: 'AudioScreen',
          audio_id: data.id,
          audio_title: data.title
        });
        if (sick > 0) {
          data.start = sick;
        }
        if (downloads) {
          downloads.find(dl => {
            if (dl.id == data.id) {
              data.source = dl.uri;
            }
          })
        }
        pushAudio(data);
        openMini(false);
        navigation.navigate('Player', data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleScroll = (event) => {
    if ((event.nativeEvent.contentOffset.y + normalize(46)) > contentStart) {
      navigation.setOptions({
        headerTransparent: false,
      });
    } else {
      navigation.setOptions({
        headerTransparent: true,
      });
    }
  }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={stbar ? '#000' : "transparent"} translucent={stbar ? false : true} style="light" />
      {isLoading || !data ? <ActivityIndicator /> :
        <>
          <FadingImage imageOpacity={imageOpacity} HomeBg={{ uri: data.bgimage }} bgHeight={bgHeight} gradient={true} />
          <Animated.ScrollView style={{ flex: 1, width: '100%' }} onScroll={
            Animated.event(
              [{
                nativeEvent: {
                  contentOffset: {
                    y: scrollY
                  }
                }
              }],
              {
                useNativeDriver: false,
                listener: (event) => handleScroll(event)
              }
            )
          }>
            <View style={{ flex: 1, height: contentStart }}></View>
            <View style={{ flex: 1, paddingHorizontal: 30 }}>
              <TrainerBox title={data.trainer.userName} img={data.trainer.img} />
              <AudioInfo title={data.title} category={data.category} duration={data.duration} intensity={data.intensity} large={true} />
              <Text style={[styles.descr, { marginVertical: 32 }]}>{data.descr}</Text>
              {data.target.length ? (<Text style={styles.headerTitle}>Ιδανικό</Text>) : null}
              {data.target.length ? data.target.map((trg, index) => (
                <View style={[styles.line, { marginBottom: 8 }]} key={index}>
                  <Icon name="check2" size={normalize(14)} color="#FADA6B" style={{ marginRight: 9 }} />
                  <Text style={styles.descr}>{trg}</Text>
                </View>
              )) : null}
            </View>
            {data.sections ?
              <AudioSections sections={data.sections} handleModalOpen={handleAudioStart} />
              : null}
            <View style={{ flex: 1, height: normalize(62) }}></View>
          </Animated.ScrollView>
          <AudioBottomBar ww={ww} handleModalOpen={handleAudioStart} aid={data.id} sharer={data.title} url={data.source} />
        </>
      }
    </View>
  )
}

export default AudioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#000',
  },
  descr: {
    fontSize: 17,
    lineHeight: 23,
    color: '#fff',
    fontFamily: 'AlegreyaSans_400Regular'
  },
  headerTitle: {
    fontFamily: 'AlegreyaSans_700Bold',
    fontSize: normalize(17),
    lineHeight: normalize(20),
    marginBottom: 16,
    color: '#fff',
  },
  line: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  }
});