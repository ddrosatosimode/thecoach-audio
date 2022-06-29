import { Animated, ImageBackground, StyleSheet, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const FadingImage = ({ imageOpacity, HomeBg, bgHeight, gradient = true }) => {
  return (
    <Animated.View style={{ opacity: imageOpacity, flex: 1, height: bgHeight, position: "absolute", top: 0, left: 0, width: '100%' }}>
      <ImageBackground source={HomeBg} style={styles.bgimage} resizeMode="cover">
        {gradient &&
          <LinearGradient
            colors={['rgba(22, 55, 93, 0)', '#000']}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: bgHeight }}
          />}
      </ImageBackground>
    </Animated.View>
  )
}

export default FadingImage;

const styles = StyleSheet.create({
  bgimage: {
    flex: 1,
    justifyContent: 'center',
  },
})