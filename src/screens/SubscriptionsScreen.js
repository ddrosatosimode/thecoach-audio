import { useContext } from "react";
import { AuthStateContext } from "../context/AuthContext";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
const SubscriptionsScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthStateContext);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#000' translucent={false} style="light" animated={true} />
      <ScrollView style={{ flex: 1, width: '100%', paddingHorizontal: 30 }}>
        <Text style={styles.defaultH1}>Συνδρομες</Text>
        <View style={{ width: '100%', paddingTop: 16 }}>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SubscriptionsScreen;

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
})