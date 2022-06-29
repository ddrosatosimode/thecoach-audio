import { AlegreyaSans_700Bold } from "@expo-google-fonts/alegreya-sans";
import { TouchableOpacity, View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { normalize } from "../../utilities/normalize";
import Icon from "../CustomIcons";

const FilterAccordion = ({ title, icon, api_filter, activeTab, activeFilters, handleTab, handleFilter, type }) => {
  return (
    <View style={[styles.accWrap, activeTab == type ? { maxHeight: '100%' } : null]}>
      <TouchableOpacity activeOpacity={1} backgroundColor="#FFF" onPress={() => handleTab(type)} style={styles.accHead}>
        <Icon name={icon} size={normalize(19)} color="#000" style={styles.headIcon} />
        <Text style={styles.accHeadText}>{title}</Text>
        <Icon name="chevron-down" size={normalize(19)} color="#000" style={[styles.arrowIcon, activeTab == type ? { transform: [{ rotate: '180deg' }] } : null]} />
      </TouchableOpacity>
      <ScrollView style={[styles.accListWrapper,]}>
        <View style={styles.accList}>
          {api_filter.map((f, i) => {
            return (
              <TouchableOpacity activeOpacity={1} style={styles.option} key={i} onPress={() => handleFilter(type, f.id)}>
                <Text style={[styles.optionText, activeFilters?.[type] == f.id ? { backgroundColor: 'red', color: '#fff' } : null]}>{f.title}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </View >
  )
}
export default FilterAccordion;

const styles = StyleSheet.create({
  accWrap: {
    marginBottom: 10,
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#000',
    maxHeight: 60,
  },
  accHead: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingVertical: 0,
    paddingHorizontal: 15,
    minHeight: 60,
    maxHeight: 60,
  },
  headIcon: {
    marginRight: 10,
    flexGrow: 0,
  },
  arrowIcon: {
    flexGrow: 0,
  },
  accHeadText: {
    color: '#000',
    flexGrow: 1,
    fontFamily: 'AlegreyaSans_700Bold',
    fontSize: normalize(16)
  },
  accListWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff'
  },
  accList: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  option: {
    flex: 1,
    flexDirection: "row",
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  optionText: {
    color: '#000',
    fontFamily: 'AlegreyaSans_700Bold',
    fontSize: normalize(16),
    backgroundColor: '#f9f7e9',
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
    textAlign: "center",
  }
})