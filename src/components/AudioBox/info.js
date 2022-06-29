import { AlegreyaSans_400Regular, AlegreyaSans_700Bold } from "@expo-google-fonts/alegreya-sans";
import { StyleSheet, View, Text } from "react-native";
import { normalize } from "../../utilities/normalize";
import Icon from '../CustomIcons';

const AudioInfo = ({ title, category = null, duration = null, intensity = null, large = false }) => {
  return (
    <>
      <Text style={[styles.ttl, large ? { fontSize: normalize(26) } : null]}>{title}</Text>
      {category && <Text style={styles.cat}>{category.join(', ').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}</Text>}
      {duration || intensity ?
        <View style={styles.info}>
          {duration ?
            <>
              <Icon name="clock" color="#FADA6B" size={normalize(13)} style={{ marginRight: 10, alignSelf: 'center' }}></Icon>
              <Text style={styles.lbl}>{duration}</Text>
            </> : null}
          {intensity ?
            <>
              <Icon name="intensity" color="#FADA6B" size={normalize(13)} style={{ marginRight: 10, alignSelf: 'center' }}></Icon>
              <Text style={styles.lbl}>{intensity}</Text>
            </> : null}
        </View>
        : null}
    </>
  )
}

export default AudioInfo;

const styles = StyleSheet.create({
  info: {
    flex: 1,
    maxHeight: normalize(25),
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  ttl: {
    color: '#fff',
    fontSize: normalize(22),
    lineHeight: normalize(26),
    letterSpacing: 1,
    fontFamily: 'AlegreyaSans_700Bold',
  },
  cat: {
    fontSize: 15,
    color: '#E4E4E4',
    marginTop: 8,
    marginBottom: 11,
    fontFamily: 'AlegreyaSans_400Regular',
    textTransform: 'uppercase',
  },
  lbl: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'AlegreyaSans_400Regular',
    marginRight: 20,
    alignSelf: "center",
  }
})