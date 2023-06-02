import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { AlegreyaSans_400Regular, AlegreyaSans_800ExtraBold } from '@expo-google-fonts/alegreya-sans';
import Icon from '../CustomIcons';
import AudioBox from "../AudioBox";
import { useNavigation } from '@react-navigation/native';
import { useApiDataList } from "../../hooks/ItemsData";
import { AuthStateContext } from "../../context/AuthContext";
import { normalize } from "../../utilities/normalize";

const AudioSwiper = ({ tmpl = "normal", headerNav, title, subtitle, path, cat, userlist = false, api_data = null }) => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const { schedules } = useContext(AuthStateContext);
  const { user } = useContext(AuthStateContext);

  useEffect(() => {
    if (api_data && user) {
      useApiDataList(api_data, cat, schedules, userlist, path, user, setData, setLoading, 10)
    }
  }, [api_data, cat, schedules, userlist, path, user]);

  return (
    <View style={[styles.cmp, tmpl == "normal" ? styles.dark : null]}>
      <View style={styles.titleWrap}>
        <Text style={[styles.defaultH1, tmpl == 'normal' ? { fontSize: normalize(22) } : null]}>{title}</Text>
      </View>
      <View style={styles.bottonWrap}>
        <TouchableOpacity onPress={() => {
          navigation.navigate(headerNav, {
            path: path,
            cat: cat,
            title: title
          })
        }}>
          <Icon name="arrow-right" color="white" size={normalize(19)}></Icon>
        </TouchableOpacity>
      </View>
      <View style={{ width: '100%' }}><Text style={{ fontSize: 14, color: '#E4E4E4', paddingLeft: 30, fontFamily: 'AlegreyaSans_400Regular' }}>{subtitle}</Text></View>
      <View style={{ width: '100%', paddingTop: 16 }}>
        {isLoading ? <ActivityIndicator /> : !data || data.length == 0 ? <View style={{ flex: 1, justifyContent: "center", width: "100%", alignItems: "center" }}><Text style={{ color: '#fff', textAlign: "center" }}>Η λίστα είναι άδεια</Text></View> : (
          <FlatList
            data={data}
            renderItem={({ item, index }) => {
              return (
                <AudioBox key={index} item={item} index={index} tmpl={tmpl} navigation={navigation} activeSub={user.activeSub} />
              )
            }}
            keyExtractor={item => item.id}
            horizontal={true}
          />)}
      </View>
    </View>
  )
}

export default AudioSwiper;

const styles = StyleSheet.create({
  cmp: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 'auto',
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 64,
  },
  dark: {
    backgroundColor: '#000',
  },
  titleWrap: {
    flexBasis: 'auto',
    flexGrow: 1,
    flexShrink: 0,
    maxWidth: '90%',
  },
  defaultH1: {
    fontSize: normalize(28),
    color: '#fff',
    fontFamily: 'AlegreyaSans_800ExtraBold',
    paddingLeft: 30,
  },
  bottonWrap: {
    flexBasis: normalize(35),
    flexGrow: 0,
    flexShrink: 1,
    paddingRight: normalize(0),
    alignSelf: "center",
    //backgroundColor: 'red'
  },
})
