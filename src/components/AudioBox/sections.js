import { AlegreyaSans_400Regular, AlegreyaSans_700Bold } from "@expo-google-fonts/alegreya-sans";
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { normalize } from "../../utilities/normalize";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../CustomIcons'
const SectionBox = ({ item, index, handleOpen }) => {
  return (
    <TouchableOpacity
      onPress={() => { handleOpen(item.start) }}
    >
      <LinearGradient
        colors={['#1E5391', '#090A0C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 0.9 }}
        style={[styles.sectionBox, index == 0 ? { marginLeft: 30 } : null]}
      >
        <Text style={styles.number}>{item.id}</Text>
        <View style={{ flex: 1, flexWrap: "wrap", width: '100%', justifyContent: 'flex-end' }}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={{ width: '100%', flexDirection: 'row', flexWrap: "nowrap" }}>
            <Icon name="clock" color="#FADA6B" size={normalize(13)} style={{ marginRight: 10, alignSelf: 'center' }}></Icon>
            <Text style={styles.duration}>{item.duration}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}
const AudioSections = ({ sections, handleModalOpen }) => {
  return (
    <>
      <Text style={styles.ttl}>Ενότητες</Text>
      <FlatList
        data={sections}
        renderItem={({ item, index }) => {
          return (
            <SectionBox key={index} item={item} index={index} handleOpen={handleModalOpen} />
          )
        }}
        keyExtractor={item => item.id}
        horizontal={true}
      />
    </>
  )
}

export default AudioSections;

const styles = StyleSheet.create({
  ttl: {
    color: '#fff',
    fontSize: normalize(17),
    lineHeight: normalize(20),
    letterSpacing: 1,
    fontFamily: 'AlegreyaSans_700Bold',
    marginBottom: 16,
    marginTop: 30,
    paddingLeft: 30,
  },
  sectionBox: {
    backgroundColor: 'blue',
    width: normalize(83),
    height: normalize(111),
    marginRight: normalize(12),
    borderRadius: normalize(11),
    padding: normalize(13),
    paddingTop: normalize(8),
    flex: 1,
    justifyContent: "space-between",
  },
  number: {
    fontSize: normalize(22),
    lineHeight: normalize(26),
    fontFamily: 'AlegreyaSans_700Bold',
    color: '#fff',
  },
  title: {
    color: '#fff',
    width: '100%',
    fontSize: normalize(13),
    lineHeight: normalize(18),
    fontFamily: 'AlegreyaSans_400Regular',
    marginBottom: normalize(5),
  },
  duration: {
    color: '#fff',
    fontSize: normalize(12),
  }
})