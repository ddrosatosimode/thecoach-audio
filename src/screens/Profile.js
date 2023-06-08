import { AlegreyaSans_400Regular, AlegreyaSans_700Bold } from "@expo-google-fonts/alegreya-sans";
import React, { useContext, useState, useEffect, useLayoutEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TouchableHighlight, ActivityIndicator, Alert, AppState } from "react-native";
import { AuthStateContext } from "../context/AuthContext";
import { PlayerStateContext } from "../context/PlayerContext";
import { normalize } from "../utilities/normalize";
import { StatusBar } from "expo-status-bar";
import RadioList from "../components/RadioList";
import { DataStateContext } from "../context/DataContext";
import Purchases from "react-native-purchases";
import * as Linking from 'expo-linking';
import SubscriptionItem from "../components/Subscription/line";

const ProfileScreen = ({ navigation, route }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { openMini } = useContext(PlayerStateContext)
  const { user, signOut, updateUserSettings, updateUser } = useContext(AuthStateContext);
  const { api_goals } = useContext(DataStateContext);
  const [selectedGoal, setSelectedGoal] = useState(user?.userSettings?.goal ? user.userSettings.goal : 0);
  const [selectedLevel, setSelectedLevel] = useState(user?.userSettings?.level ? user.userSettings.level : 0);
  const [selectedAge, setSelectedAge] = useState(user?.userSettings?.age ? user.userSettings.age : 0);
  const [selectedGender, setSelectedGender] = useState(user?.userSettings?.gender ? user.userSettings.gender : 0);
  const [tab, setTab] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [subscriptions, setSubscriptions] = useState(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current ? appState.current : null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const checkSubscription = async () => {
          try {
            const customerInfo = await Purchases.getCustomerInfo();
            if (customerInfo.activeSubscriptions.length > 0) {
              setSubscriptions(customerInfo)
            } else {
              await updateUser(false);
            }
          } catch (e) {
            Alert.alert('Error getting user data', e.message);
          }
        }
        checkSubscription();
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const checkSubscription = async () => {
        try {
          const customerInfo = await Purchases.getCustomerInfo();
          if (customerInfo.activeSubscriptions.length > 0) {
            setSubscriptions(customerInfo)
          }
        } catch (e) {
          Alert.alert('Error getting user data', e.message);
        }
      }
      checkSubscription();
    }
  }, [user])

  useEffect(() => {
    if (api_goals) {
      setData(api_goals);
      setLoading(false);
    }
  }, [api_goals])

  useEffect(() => {
    if (updating) {
      handleChange();
    }
  }, [updating])

  const handleLogout = () => {
    openMini(false);
    signOut();
  }
  const handleChange = () => {
    updateUserSettings({ goal: selectedGoal, level: selectedLevel, age: selectedAge, gender: selectedGender });
    setUpdating(false);
  }
  const handleLevel = (x) => {
    setSelectedLevel(x);
    setUpdating(true);

  };
  const handleGoal = (x) => {
    setSelectedGoal(x);
    setUpdating(true);
  };
  const handleAge = (x) => {
    setSelectedAge(x);
    setUpdating(true);
  };
  const handleGender = (x) => {
    setSelectedGender(x);
    setUpdating(true);
  };
  const handleTab = (s) => {
    setTab(s);
  }
  const levels = [
    {
      id: '1',
      title: 'Αρχάριος'
    },
    {
      id: '2',
      title: 'Μέτριος'
    },
    {
      id: '3',
      title: 'Προχωρημένος'
    },
  ];
  const genders = [
    {
      id: '1',
      title: 'Άνδρας'
    },
    {
      id: '2',
      title: 'Γυναίκα'
    },
    {
      id: '3',
      title: 'Άλλο'
    }
  ];
  const ages = [
    {
      id: '1',
      title: '18-24'
    },
    {
      id: '2',
      title: '25-34'
    },
    {
      id: '3',
      title: '35-50',
    },
    {
      id: '4',
      title: '50+',
    }
  ];
  return (
    <View style={styles.container}>
      <StatusBar translucent={true} setBackgroundColor={'transparent'} style='light'></StatusBar>
      <ScrollView style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 30, width: '100%' }}>
        <Text style={styles.text}>Όνομα: {user.name}</Text>
        <Text style={styles.text}>Email: {user.email}</Text>
        <TouchableOpacity onPress={() => handleLogout()} style={styles.button}><Text style={styles.buttonText}>Αποσύνδεση</Text></TouchableOpacity>
        {subscriptions ?
          <View style={{ flex: 1, marginTop: 30 }}>
            <Text style={[styles.text, { fontSize: 24 }]}>Συνδρομες</Text>
            {subscriptions.activeSubscriptions.map((sub, index) => {
              return (<SubscriptionItem name={sub} item={subscriptions.allExpirationDates} key={index} />)
            })}
            <TouchableOpacity onPress={() => { Linking.openURL(subscriptions.managementURL) }} style={styles.button}><Text style={styles.buttonText}>Ακύρωση Συνδρομής</Text></TouchableOpacity>
          </View>
          : null}
        <View style={styles.ctabs}>
          <TouchableHighlight style={styles.hl} onPress={() => handleTab(0)}><View style={[styles.tabPill, tab == 0 ? { backgroundColor: '#0176FF', borderRadius: normalize(10) } : null]}><Text style={styles.pillText}>Επίπεδο</Text></View></TouchableHighlight>
          <TouchableHighlight style={styles.hl} onPress={() => handleTab(1)}><View style={[styles.tabPill, tab == 1 ? { backgroundColor: '#0176FF', borderRadius: normalize(10) } : null]}><Text style={styles.pillText}>Στόχος</Text></View></TouchableHighlight>
          <TouchableHighlight style={styles.hl} onPress={() => handleTab(2)}><View style={[styles.tabPill, tab == 2 ? { backgroundColor: '#0176FF', borderRadius: normalize(10) } : null]}><Text style={styles.pillText}>Φύλο</Text></View></TouchableHighlight>
          <TouchableHighlight style={styles.hl} onPress={() => handleTab(3)}><View style={[styles.tabPill, tab == 3 ? { backgroundColor: '#0176FF', borderRadius: normalize(10) } : null]}><Text style={styles.pillText}>Ηλικία</Text></View></TouchableHighlight>
        </View>
        {!updating ?
          <>
            <View style={[styles.stepWrapp, tab == 0 ? styles.stepWrappVisible : null]}>
              <View style={styles.listview}>
                <RadioList options={levels} selected={selectedLevel} handler={handleLevel} styles={styles}>
                </RadioList>
              </View>
            </View>
            <View style={[styles.stepWrapp, tab == 1 ? styles.stepWrappVisible : null]}>
              <View style={styles.listview}>
                {!loading && data ?
                  <RadioList options={data} selected={selectedGoal} handler={handleGoal} styles={styles} /> : null}
              </View>
            </View>
            <View style={[styles.stepWrapp, tab == 2 ? styles.stepWrappVisible : null]}>
              <View style={styles.listview}>
                <RadioList options={genders} selected={selectedGender} handler={handleGender} styles={styles} />
              </View>
            </View>
            <View style={[styles.stepWrapp, tab == 3 ? styles.stepWrappVisible : null]}>
              <View style={styles.listview}>
                <RadioList options={ages} selected={selectedAge} handler={handleAge} styles={styles} />
              </View>
            </View>
          </>
          : <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", minHeight: 200 }}><ActivityIndicator /></View>}
      </ScrollView>
    </View>
  )
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: normalize(15),
    lineHeight: normalize(19),
    marginBottom: 15,
    fontFamily: 'AlegreyaSans_400Regular',
  },
  button: {
    maxHeight: normalize(40),
    height: normalize(40),
    width: '100%',
    backgroundColor: '#ff3838',
    borderRadius: 50,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: normalize(14),
    fontFamily: 'AlegreyaSans_700Bold',
    color: '#fff',
  },
  ctabs: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: normalize(30),
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(5),
    borderRadius: normalize(10),
  },
  hl: {
    width: '25%',
    paddingHorizontal: normalize(5),
  },
  tabPill: {
    flex: 1,
    justifyContent: "center",
    flexGrow: 1,
    paddingVertical: normalize(10),
  },
  pillText: {
    color: '#FFF',
    fontSize: normalize(14),
    textAlign: "center",
  },
  stepWrapp: {
    flex: 1,
    width: '100%',
    transform: [{ scale: 0 }],
    height: 0,
    width: 0,
  },
  stepWrappVisible: {
    transform: [{ scale: 1 }],
    height: '100%',
    width: '100%',
    paddingVertical: normalize(12),
  },
  StepTitle: {
    marginTop: 22,
    marginBottom: 5,
    color: '#fff',
    fontSize: normalize(22),
    fontFamily: 'AlegreyaSans_700Bold',
  },
  listview: {
    flex: 1,
    marginTop: normalize(20),
    width: '100%',
  },
  option: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: normalize(14),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: normalize(12),
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    height: normalize(53),
    paddingHorizontal: normalize(21),
  },
  optionText: {
    color: '#fff',
    fontSize: normalize(14),
    fontFamily: 'AlegreyaSans_700Bold',
  },
  rb: {
    width: normalize(19),
    maxWidth: normalize(19),
    height: normalize(19),
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: '#fff',
    opacity: 0.3,
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 50,
  },
  rb_small: {
    width: normalize(14),
    maxWidth: normalize(14),
    height: normalize(14),
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: '#fff',
    opacity: 0.3,
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 50,
  },
  selected: {
    width: normalize(10),
    height: normalize(10),
    borderRadius: 50,
    backgroundColor: '#0176FF',
  },
})


