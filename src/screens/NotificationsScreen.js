import Swipeable from 'react-native-gesture-handler/Swipeable'
import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Animated } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthStateContext } from "../context/AuthContext";
import { normalize } from "../utilities/normalize";
import { AlegreyaSans_400Regular, AlegreyaSans_700Bold } from "@expo-google-fonts/alegreya-sans";

const NotificationsScreen = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData,] = useState([]);
  const { notifications, updateNotifications } = useContext(AuthStateContext);
  const RenderRight = (progress, dragX) => {
    const opacity = dragX.interpolate({
      inputRange: [-50, 0.5],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    })

    const Style = {
      opacity,
    }

    return (
      <View style={{ width: 80, alignItems: "center", justifyContent: 'center' }}>
        <Animated.Text style={[Style, { color: 'red', fontSize: 14, paddingBottom: 10 }]}>Delete</Animated.Text>
      </View>
    )
  }
  const deleteItem = (dt) => {
    const temp = data.filter(item => item.date !== dt);
    setData(temp);
    updateNotifications(temp);
  }

  useEffect(() => {
    if (notifications.length > 0) {
      setData(notifications);
    } else {
      setData([]);
    }
  }, [notifications]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#000' translucent={false} style="light" animated={true} />
      <ScrollView style={{ flex: 1, width: '100%', paddingHorizontal: 30 }}>
        <Text style={styles.defaultH1}>Notifications</Text>
        <View style={{ width: '100%', paddingTop: 16, flex: 1, }}>
          {data.length > 0 ?
            data.map((notification, i) => {
              return (
                <Swipeable useNativeAnimations overshootLeft={8} overshootRight={8} onSwipeableOpen={() => deleteItem(notification.date)} renderRightActions={RenderRight} key={notification.date}>
                  <View style={styles.notiBox}>
                    {notification.request.content.title ?
                      <Text style={styles.notiTitle}>{notification.request.content.title}</Text>
                      : null}
                    {notification.request.content.body ?
                      <Text style={styles.notiContent}>{notification.request.content.body}</Text>
                      : null}
                  </View>
                </Swipeable>
              )
            })
            : <Text style={{ color: '#fff', paddingVertical: 60, fontSize: 16, textAlign: "center" }}>Δεν υπάρχουν νέες ειδοποιήσεις</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#000',
  },
  defaultH1: {
    fontSize: 31,
    color: '#fff',
    fontFamily: 'AlegreyaSans_800ExtraBold',
  },
  notiBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  notiTitle: {
    fontSize: normalize(20),
    fontFamily: 'AlegreyaSans_700Bold',
    marginBottom: 8,
    color: '#000',
    flexGrow: 1,
    width: '100%',
  },
  notiContent: {
    fontSize: normalize(16),
    fontFamily: 'AlegreyaSans_400Regular',
    color: '#000',
    flexGrow: 1,
    width: '100%',
  }
});