import React, { useState, useRef, useLayoutEffect, useContext } from "react";
import { StyleSheet, View, Dimensions, Animated, Text } from "react-native";
import HomeBg from '../../assets/home_bg.png';
import { StatusBar } from 'expo-status-bar';
import AudioSwiper from "../components/AudioSwiper";
import FadingImage from "../components/FadingImage";
import AudioFilters from "../components/AudioFilters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataStateContext } from "../context/DataContext";
import { AlegreyaSans_700Bold } from "@expo-google-fonts/alegreya-sans";
import { normalize } from "../utilities/normalize";
import { useHeaderHeight } from '@react-navigation/elements';


const window = Dimensions.get("window");
const bgHeight = window.height * 0.8;
const contentStart = window.height * 0.5;

const HomeScreen = ({ navigation, route }) => {
  const headerHeight = useHeaderHeight();
  const scrollY = useRef(new Animated.Value(0)).current;
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, contentStart / 2, contentStart],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  const [stbar, setStBar] = useState(false);
  const { api_data } = useContext(DataStateContext);
  useLayoutEffect(() => {
    const showFte = async () => {
      const fte = await AsyncStorage.getItem('userFteShown');
      if (fte != 'YES') {
        navigation.navigate('FTE');
      }
    }
    showFte();
  });

  const handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y > (contentStart - headerHeight)) {
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
      <StatusBar backgroundColor={stbar ? '#000' : "transparent"}
        translucent={stbar ? false : true} style="light" animated={true} />
      <FadingImage imageOpacity={imageOpacity} HomeBg={HomeBg} bgHeight={bgHeight} />
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
        <View style={{ flex: 1, height: contentStart, justifyContent: 'center', alignItems: "center" }}>
          <Text style={[styles.bigIntro, { paddingTop: headerHeight }]}>Live The {"\n"}Outdoor Experience</Text>
        </View>
        <AudioSwiper tmpl="featured" headerNav="Category" title="Προτάσεις για σένα" subtitle="Με βάση τα θέλω σου" path="featured" cat="" api_data={api_data} />
        <AudioFilters navigation={navigation} />
        <AudioSwiper tmpl="normal" headerNav="Category" title="Ξεκινάς τώρα" subtitle="Κορυφαία προγράμματα για αρχάριους" path="level" cat="1" api_data={api_data} />
        <AudioSwiper tmpl="normal" headerNav="Category" title="Προπόνηση με περπάτημα" subtitle="Τώρα το περπάτημα γίνεται αποδοτική προπόνηση" path="category" cat="2" api_data={api_data} />
        <AudioSwiper tmpl="normal" headerNav="Category" title="Προπόνηση με Jogging" subtitle="Ανέβασε ρυθμό, δες το σώμα σου να αλλάζει" path="category" cat="5" api_data={api_data} />
        <AudioSwiper tmpl="normal" headerNav="Category" title="Προπόνηση Running" subtitle="Απογείωσε την απόδοση σου με τον Running Coach σου" path="category" cat="1" api_data={api_data} />
        <AudioSwiper tmpl="normal" headerNav="Category" title="Προπόνηση για φυσική κατάσταση" subtitle="Συνάντησε την καλύτερη εκδοχή του εαυτού σου" path="target" cat="1" api_data={api_data} />
        <AudioSwiper tmpl="normal" headerNav="Category" title="Προπόνηση για αντοχή" subtitle="Προετοιμάσου για περισσότερα χιλιόμετρα. Αντέχεις;" path="target" cat="3" api_data={api_data} />
        <AudioSwiper tmpl="normal" headerNav="Category" title="Προπόνηση για κάψιμο θερμίδων" subtitle="Προπονήσεις που θα μεταμορφώσουν το σώμα σου" path="target" cat="2" api_data={api_data} />
        <AudioSwiper tmpl="normal" headerNav="MySchedule" title="Το πρόγραμμά σου" subtitle="Φτιάξε το ιδανικό πρόγραμμα προπόνησης!" userlist={true} api_data={api_data} />
        <AudioSwiper tmpl="normal" headerNav="Category" title="Εναλλακτικές προτάσεις" subtitle="Για εσένα που θές περισσότερα" path="random" cat="" api_data={api_data} />
      </Animated.ScrollView >
    </View >
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#000',
  },
  bigIntro: {
    color: '#fff',
    fontFamily: 'AlegreyaSans_700Bold',
    textAlign: "center",
    fontSize: normalize(30),
  }
})


