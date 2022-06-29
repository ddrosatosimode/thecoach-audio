import { Image, Text, View, StyleSheet } from "react-native";
import { AlegreyaSans_800ExtraBold } from '@expo-google-fonts/alegreya-sans';
import { normalize } from "../../utilities/normalize";

const TrainerBox = ({ title, img }) => {
  return (
    <View style={styles.trainer}>
      <Image style={styles.avatar} source={{ uri: img }} />
      <Text style={styles.ttl}>{title.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}</Text>
    </View>
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
  }
});