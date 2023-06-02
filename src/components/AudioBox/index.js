import React from "react";
import { StyleSheet, Text, View, ImageBackground, Pressable } from "react-native";
import { normalize } from "../../utilities/normalize";
import AudioInfo from "./info";
import TrainerBox from "./trainer";
import SvgLock from "../SvgComp/SvgLock";

const AudioBox = ({ item, index, tmpl, navigation, activeSub }) => {
  return (
    <View style={[tmpl != 'full' ? styles.audiobox : styles.audioboxfull, index == 0 && tmpl != 'full' ? styles.first : null, tmpl == 'featured' ? styles.big : styles.regular]}>
      {item.availability === 'free' || activeSub ?
        <Pressable style={{ flex: 1 }} onPress={() => { navigation.navigate('Audio', { aid: item.id }) }} pressRetentionOffset={{ bottom: 0, left: 0, right: 0, top: 0 }}>
          <ImageBackground source={{ uri: item.bgimage }} style={[styles.bgimage, tmpl == 'featured' ? styles.big : styles.regular, tmpl == 'full']} resizeMode="cover">
            {/*<TrainerBox title={item.trainer.userName} img={item.trainer.img} />*/}
            <AudioInfo title={item.title} category={item.category} duration={item.duration} intensity={item.intensity} />
          </ImageBackground>
        </Pressable> :
        <Pressable style={{ flex: 1 }} onPress={() => { navigation.navigate('Subscriptions') }} pressRetentionOffset={{ bottom: 0, left: 0, right: 0, top: 0 }}>
          <ImageBackground source={{ uri: item.bgimage }} style={[styles.bgimage, tmpl == 'featured' ? styles.big : styles.regular, tmpl == 'full']} resizeMode="cover">
            {/*<TrainerBox title={item.trainer.userName} img={item.trainer.img} />*/}
            <View style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(70,70,70,0.9)", padding: 10, zIndex: 2 }}><SvgLock /><Text style={{ color: "#FFF", marginTop: 10, fontSize: 18 }}>Αγορά συνδρομής</Text></View>
            <AudioInfo title={item.title} category={item.category} duration={item.duration} intensity={item.intensity} />
          </ImageBackground>
        </Pressable>
      }
    </View>
  )
}
export default AudioBox;
const styles = StyleSheet.create({
  audiobox: {
    width: normalize(226),
    marginRight: 16,
  },
  audioboxfull: {
    width: '100%',
    marginBottom: 16,
  },
  regular: {
    height: normalize(178),
  },
  big: {
    height: normalize(278),
  },
  first: {
    marginLeft: 30
  },
  bgimage: {
    flex: 1,
    justifyContent: 'flex-end',
    minWidth: normalize(226),
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(10),
    borderRadius: 14,
    overflow: 'hidden',
    maxHeight: normalize(278),
    alignSelf: 'stretch',
  },
})