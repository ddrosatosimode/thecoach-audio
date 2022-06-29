import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import Logo from "../components/Logo";
import Icon from '../components/CustomIcons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { HeaderStyleInterpolators } from '@react-navigation/stack';
const Drawer = createDrawerNavigator();
const DrawerLeft = ({ navigation, route }) => {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation, route }) => ({
        headerTitle: (props) => <Logo {...props} />,
        headerTitleAlign: 'center',
        headerTransparent: true,
        headerStyle: { borderBottomWidth: 0, backgroundColor: '#000' },
        headerLeft: () => (
          <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingLeft: 30 }}>
            <TouchableOpacity style={{ backgroundColor: "transaparent" }} onPress={() => navigation.openDrawer()}>
              <Icon mode="text" name="menu" color="white" size={24} ></Icon>
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", paddingRight: 30 }}>
            <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate('Settings')}>
              <Icon name="filters" color="white" size={24}></Icon>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Icon name="notification" color="white" size={24}></Icon>
            </TouchableOpacity>
          </View>
        ),
      })}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ headerStyleInterpolator: HeaderStyleInterpolators.forNoAnimation }} />
    </Drawer.Navigator>
  );
}
export default DrawerLeft;