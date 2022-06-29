import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AlegreyaSans_800ExtraBold } from "@expo-google-fonts/alegreya-sans";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioBox from "../components/AudioBox";
import { AuthStateContext } from "../context/AuthContext";
import { getApi, useDataByIds } from "../hooks/ItemsData";
import { DataStateContext } from "../context/DataContext";

const FavoritesScreen = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();
  const { api_data } = useContext(DataStateContext);
  const { favorites } = useContext(AuthStateContext);
  useEffect(() => {
    if (api_data && favorites) {
      useDataByIds(api_data, favorites, setData, setLoading);
    }
  }, [api_data, favorites]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#000' translucent={false} style="light" animated={true} />
      <ScrollView style={{ flex: 1, width: '100%', paddingHorizontal: 30 }}>
        <Text style={styles.defaultH1}>Αγαπημένα</Text>
        <View style={{ width: '100%', paddingTop: 16 }}>
          {isLoading ? <ActivityIndicator /> :
            !data || data.length == 0 ? <Text style={{ color: '#fff', paddingVertical: 30, fontSize: 18 }}>Η Λίστα είναι άδεια</Text> :
              data.map((item, index) => {
                return (
                  <AudioBox key={index} item={item} index={index} tmpl='full' navigation={navigation} />
                )
              })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#000',
  },
  defaultH1: {
    fontSize: 31,
    color: '#fff',
    fontFamily: 'AlegreyaSans_800ExtraBold',
  },
});
