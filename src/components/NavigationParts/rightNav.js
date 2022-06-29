import { View, TouchableOpacity } from "react-native";
import Icon from '../CustomIcons';
import { useNavigation } from '@react-navigation/native';
import { normalize } from "../../utilities/normalize";
import { useContext, useState, useEffect } from "react";
import { AuthStateContext } from "../../context/AuthContext";

const RightNav = () => {
  const { notifications } = useContext(AuthStateContext);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    if (notifications.length > 0) {
      setData(notifications);
    } else {
      setData([]);
    }
  }, [notifications])

  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", paddingRight: 30, paddingTop: 0, paddingBottom: 0 }}>
      <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
        <Icon name="notification" color="white" size={normalize(19)}></Icon>
        {data.length > 0 ? <View style={{ position: "absolute", top: 0, right: 0, width: 6, height: 6, backgroundColor: 'red', borderRadius: 50 }}></View> : null}
      </TouchableOpacity>
    </View>
  )
}
export default RightNav