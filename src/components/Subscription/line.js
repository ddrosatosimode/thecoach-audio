import { AlegreyaSans_400Regular, AlegreyaSans_700Bold } from "@expo-google-fonts/alegreya-sans";
import { StyleSheet, Text, View } from "react-native";
import { normalize } from "../../utilities/normalize";

const SubscriptionItem = ({ name, item }) => {
  const date = new Date(item[name]);
  const greeceOffset = 180; // Greece is GMT+3 (180 minutes offset from UTC)
  const greeceTime = new Date(date.getTime() + greeceOffset * 60 * 1000);

  // Extract the components of the date and time
  const day = greeceTime.getUTCDate().toString().padStart(2, '0');
  const month = (greeceTime.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const year = greeceTime.getUTCFullYear();
  const hours = greeceTime.getUTCHours().toString().padStart(2, '0');
  const minutes = greeceTime.getUTCMinutes().toString().padStart(2, '0');

  // Format the date and time
  const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
  return (
    <View style={{ flex: 1, marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={[styles.text, { fontSize: 16 }]}>{name}</Text>
      <Text style={[styles.text, { fontSize: 16 }]}>{formattedDate}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: normalize(15),
    lineHeight: normalize(19),
    marginBottom: 15,
    fontFamily: 'AlegreyaSans_400Regular',
  },
})
export default SubscriptionItem