import { useContext, useEffect, useState } from "react";
import { AuthStateContext } from "../context/AuthContext";
import { ActivityIndicator, Alert, Platform, ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import SubscriptionPlan from "../components/Subscription";



const SubscriptionsScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthStateContext);
  const [packages, setPackages] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (user) {
      const getPackages = async () => {
        try {
          const offerings = await Purchases.getOfferings();
          if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
            setPackages(offerings.current.availablePackages);
          }
        } catch (e) {
          Alert.alert('Error getting offers', e.message);
        }
      };

      getPackages();
    }
  }, [user]);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#000' translucent={false} style="light" animated={true} />
      <ScrollView style={{ flex: 1, width: '100%', paddingHorizontal: 30 }}>
        <Text style={styles.defaultH1}>Συνδρομες</Text>
        {packages.length > 0 ? packages.map((pkg, index) => <SubscriptionPlan key={index} purchasePackage={pkg} setIsPurchasing={setIsPurchasing} navigation={navigation} />) : <ActivityIndicator />}
        {isPurchasing && <View style={styles.overlay} />}
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
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
  }
})