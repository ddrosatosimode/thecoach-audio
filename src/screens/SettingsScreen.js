import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AudioBox from "../components/AudioBox";

const SettingsScreen = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#000' translucent={false} style="light" animated={true} />
      <ScrollView style={{ flex: 1, width: '100%', paddingHorizontal: 30 }}>
        <Text style={styles.defaultH1}>Settings</Text>
        <View style={{ width: '100%', paddingTop: 16 }}>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SettingsScreen;

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