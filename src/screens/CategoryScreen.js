import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AudioBox from "../components/AudioBox";
import { AlegreyaSans_800ExtraBold } from "@expo-google-fonts/alegreya-sans";
import { DataStateContext } from "../context/DataContext";
import { AuthStateContext } from "../context/AuthContext";
import { useApiDataList } from "../hooks/ItemsData";

const CategoryScreen = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { api_data } = useContext(DataStateContext);
  const { user } = useContext(AuthStateContext);
  useEffect(() => {
    if (api_data) {
      useApiDataList(api_data, route.params.cat, null, false, route.params.path, user, setData, setLoading)
    }
  }, [api_data, route.params.path, route.params.cat, user]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#000' translucent={false} style="light" animated={true} />
      <ScrollView style={{ flex: 1, width: '100%', paddingHorizontal: 30 }}>
        <Text style={styles.defaultH1}>{route.params.title}</Text>
        <View style={{ width: '100%', paddingTop: 16 }}>
          {isLoading ? <ActivityIndicator /> :
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

export default CategoryScreen;

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