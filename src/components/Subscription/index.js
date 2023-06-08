import { AlegreyaSans_400Regular, AlegreyaSans_500Medium_Italic, AlegreyaSans_700Bold, AlegreyaSans_800ExtraBold } from '@expo-google-fonts/alegreya-sans';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Alert } from "react-native"
import Purchases from 'react-native-purchases';
import { AuthStateContext } from '../../context/AuthContext';

const SubscriptionPlan = ({ purchasePackage, setIsPurchasing, navigation }) => {
  const { title, description, priceString, subscriptionPeriod } = purchasePackage.product;
  const { updateUser } = useContext(AuthStateContext);
  const onSelection = async () => {
    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(purchasePackage);
      if (typeof customerInfo.entitlements.active.Full !== 'undefined') {
        await updateUser(true);
        navigation.navigate('Home');
      }
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert('Error purchasing package', e.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>{`${priceString}`}</Text>
      <Text style={styles.priceDescr}>{`${subscriptionPeriod === 'P1M' ? 'Χρέωση ανά μήνα' : ''}`}</Text>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={onSelection}>
        <Text style={styles.buttonTextStyle}>Αγορά</Text>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 24,
    paddingVertical: 48,
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 10,
    marginTop: 32
  },
  title: {
    color: '#FFF',
    textAlign: "center",
    fontSize: 32,
    marginBottom: 16
  },
  description: {
    color: '#FFF',
    textAlign: "center",
    fontSize: 18,
    marginBottom: 24
  },
  price: {
    color: '#FFF',
    textAlign: "center",
    fontSize: 32
  },
  priceDescr: {
    color: '#FFF',
    textAlign: "center",
    fontSize: 16
  },
  buttonStyle: {
    //width: 300,
    //maxWidth: 300,
    borderRadius: 50,
    height: 60,
    maxHeight: 60,
    backgroundColor: '#0176FF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'AlegreyaSans_700Bold',
  },
})
export default SubscriptionPlan