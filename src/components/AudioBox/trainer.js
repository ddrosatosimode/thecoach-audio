import { Image, Text, View, StyleSheet, Linking } from "react-native";
import { AlegreyaSans_800ExtraBold, AlegreyaSans_400Regular } from '@expo-google-fonts/alegreya-sans';
import { normalize } from "../../utilities/normalize";

const TrainerBox = ({ title, img }) => {
  const openLink = async () => {
    const url = 'https://www.white-space.gr/';
    await Linking.canOpenURL(url);
    Linking.openURL(url);
  };

  return (
    <>
      <View style={styles.trainer}>
        <Image style={styles.avatar} source={{ uri: img }} />
        <Text style={styles.ttl}>{title.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}</Text>
      </View>
      <View style={{ flex: 1, width: '100%', flexDirection: 'row', flexWrap: 'nowrap', maxHeight: 30, marginBottom: 10 }}>
        <Text style={styles.smallText}>Executive Producer: </Text>
        <Text style={styles.smallText} onPress={openLink}>white-space.gr</Text>
      </View>
    </>
  )
}

export default TrainerBox;

const styles = StyleSheet.create({
  trainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexGrow: 0,
    minHeight: normalize(25),
    marginBottom: 8,
  },
  avatar: {
    width: normalize(25),
    height: normalize(25),
    marginRight: 10,
    flexGrow: 0,
    borderRadius: 50,
    overflow: 'hidden'
  },
  ttl: {
    fontSize: normalize(11),
    fontFamily: 'AlegreyaSans_800ExtraBold',
    color: '#FADA6B',
    width: 'auto',
    flexGrow: 1,
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  smallText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'AlegreyaSans_400Regular',
  },
});