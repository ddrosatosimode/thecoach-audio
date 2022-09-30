import { AlegreyaSans_400Regular } from "@expo-google-fonts/alegreya-sans";
import { LinearGradient } from "expo-linear-gradient"
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { normalize } from "../../utilities/normalize";
import Icon from '../CustomIcons';

const Filter = ({ item, navigation, mode = false, useSearch = false, searchState = {} }) => {
  let tp = item.type;
  return (
    <LinearGradient
      colors={['#1E5391', '#090A0C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.9, y: 0.9 }}
      style={[styles.gradient, searchState?.[tp] && searchState[tp] == item.id ? { opacity: 0.5 } : null]}>
      <TouchableOpacity style={styles.flex} onPress={() => {
        if (mode == 'dynamic') {
          useSearch(item.type, item.id);
        } else {
          navigation.navigate('Search', {
            [item.type]: item.id,
          })
        }
      }}>
        <Icon size={normalize(17)} color={item.color} name={item.icon} />
        <Text style={[styles.filterText]}>{item.title}</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}
export default Filter

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10),
    marginRight: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: 'rgba(228, 228, 228, 0.5)',
    borderRadius: normalize(8),
    alignItems: "center",
    marginBottom: 10,
    flexGrow: 0,
  },
  filterText: {
    color: '#fff',
    fontSize: normalize(13),
    fontFamily: 'AlegreyaSans_400Regular',
    marginLeft: 15,
  }
})