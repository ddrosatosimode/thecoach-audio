import { View, TouchableOpacity } from "react-native";
import Icon from '../CustomIcons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useContext } from "react";
import { AuthStateContext } from "../../context/AuthContext";
import { normalize } from "../../utilities/normalize";
const LeftNav = () => {
  const { handleSideFilters } = useContext(AuthStateContext);
  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingLeft: 30, paddingTop: 0, paddingBottom: 0 }}>
      <TouchableOpacity style={{ marginRight: 20 }} onPress={() => handleSideFilters(true)} >
        <Icon name="filters" color="white" size={normalize(19)}></Icon>
      </TouchableOpacity>
    </View >
  )
}
export default LeftNav