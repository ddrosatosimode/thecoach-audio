import { View, Image } from 'react-native';
import logoimg from "../../../assets/Logo-white.png";
import { normalize } from '../../utilities/normalize';

const Logo = () => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop: 0 }}>
      <Image style={{ width: normalize(66), height: normalize(23) }} source={logoimg} />
    </View>
  )
}
export default Logo;