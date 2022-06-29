import { AlegreyaSans_400Regular, AlegreyaSans_700Bold } from "@expo-google-fonts/alegreya-sans";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import logobig from "../../assets/coach_logo_big.png";
import Icon from "../components/CustomIcons";
import RadioList from "../components/RadioList";
import { AuthStateContext } from "../context/AuthContext";
import { normalize } from "../utilities/normalize";
import bgimage from '../../assets/bg_fte.jpg';
import ConditionalWrapper from "../components/ConditionalWrapper";
import { DataStateContext } from "../context/DataContext";

const UserPreferences = ({ navigation, route }) => {
  const [data, setData] = useState(null);
  const { api_goals } = useContext(DataStateContext);
  const [loading, setLoading] = useState(true);
  const { updateUserSettings, user, updateUserFTE } = useContext(AuthStateContext);
  const [selectedGoal, setSelectedGoal] = useState(user?.userSettings?.goal ? user.userSettings.goal : 0);
  const [selectedLevel, setSelectedLevel] = useState(user?.userSettings?.level ? user.userSettings.level : 0);
  const [selectedAge, setSelectedAge] = useState(user?.userSettings?.age ? user.userSettings.age : 0);
  const [selectedGender, setSelectedGender] = useState(user?.userSettings?.gender ? user.userSettings.gender : 0);
  const [step, setStep] = useState(user?.userSettings ? 2 : 0);
  useEffect(() => {
    if (api_goals) {
      setData(api_goals);
      setLoading(false);
    }
  }, [api_goals])

  const handleDecline = () => {
    updateUserFTE();
    navigation.navigate('Home');
  }
  const handleStep = (s) => {
    setStep(s);
  }
  const handleSkip = () => {
    let nextStep = step + 1;
    if (nextStep > 4) {
      updateUserFTE();
      navigation.navigate('Home');
    } else {
      setStep(nextStep);
    }

  }
  const handleNext = async (ctx) => {
    if (ctx == 'level') {
      if (!selectedLevel > 0) {
        return;
      }
    }
    if (ctx == 'goal') {
      if (!selectedGoal > 0) {
        return;
      }
    }
    if (ctx == 'ages') {
      if (!selectedGender > 0 || !selectedAge > 0) {
        return;
      }
    }
    let nextStep = step + 1;
    if (nextStep > 4) {
      updateUserSettings({ goal: selectedGoal, level: selectedLevel, age: selectedAge, gender: selectedGender });
      updateUserFTE();
      navigation.navigate('Home');
    } else {
      setStep(nextStep);
    }
  }
  const handleLevel = (x) => {
    setSelectedLevel(x)
  };
  const handleGoal = (x) => {
    setSelectedGoal(x)
  };
  const handleAge = (x) => {
    setSelectedAge(x)
  };
  const handleGender = (x) => {
    setSelectedGender(x)
  };
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
      <ConditionalWrapper
        condition={step == 0 && !user?.userSettings ? true : false}
        wrapper={children => <ImageBackground source={bgimage} resizeMode="cover" style={[styles.container, { paddingTop: 60, paddingHorizontal: 0, paddingBottom: normalize(90), width: "100%" }]}>{children}</ImageBackground>}
        wrapper2={children => <LinearGradient colors={['#1E5391', '#090A0C']} start={{ x: 0, y: 0 }} end={{ x: 0.9, y: 0.9 }} style={[styles.container, { paddingTop: 60 }]}>{children}</LinearGradient>}
      >
        <Image style={{ width: 170, height: 60 }} source={logobig} />
        {step == 0 && !user?.userSettings ?
          <>
            <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}>
              <Text style={[styles.StepSub, { marginTop: 22 }]}>Καλό απόγευμα</Text>
              {user?.name ? <Text style={styles.btitle}>{user.name}</Text> : null}
            </View>
            <Text style={[styles.intro, { maxHeight: 26 }]}>Ξεκίνα Τώρα</Text>
            <TouchableOpacity style={styles.opac} onPress={() => handleStep(1)}><Text style={[styles.StepTitle, { marginTop: 0, marginBottom: 0 }]}>Outdoor Running</Text></TouchableOpacity>
          </>
          :
          step == 1 ?
            <>
              <Text style={[styles.btitle, { textAlign: "center", marginTop: 30, lineHeight: normalize(29) }]}>Your Outdoor {"\n"}Experience</Text>
              <Text style={styles.bluesub}>Ξεκίνα Τώρα</Text>
              <Text style={styles.intro}>Για να κάνουμε την εμπειρία προπόνησης σου ακόμα πιο συναρπαστική &amp; αποδοτική, θέλουμε να μάθουμε περισσότερα για σένα.</Text>
              <TouchableOpacity style={styles.button} onPress={() => handleStep(2)}><Text style={styles.buttonText}>Ερωτήσεις</Text></TouchableOpacity>
              <TouchableOpacity style={{ marginBottom: normalize(31) }} onPress={() => handleDecline()}><Text style={styles.plainText}>Δεν ενδιαφέρομαι</Text></TouchableOpacity>
            </>
            : step == 2 ?
              <>
                <Text style={styles.StepTitle}>Επίπεδο 1/3</Text>
                <Text style={styles.StepSub}>Επίλεξε το επίπεδο που βρίσκεσαι τώρα</Text>
                <ScrollView style={styles.listview}>
                  <RadioList options={levels} selected={selectedLevel} handler={handleLevel} styles={styles}>
                  </RadioList>
                </ScrollView>
                <TouchableOpacity style={styles.roundBtn} onPress={() => { handleNext('level') }}><Icon name="arrow-right" color="white" size={24}></Icon></TouchableOpacity>
                <TouchableOpacity style={{ marginVertical: normalize(31) }} onPress={() => handleSkip()}><Text style={styles.plainText}>Παράλειψη</Text></TouchableOpacity>
              </>
              : step == 3 ?
                <>
                  <Text style={styles.StepTitle}>Στόχος 2/3</Text>
                  <Text style={styles.StepSub}>Επίλεξε τον στόχο σου</Text>
                  <ScrollView style={styles.listview}>
                    {!loading && data ?
                      <RadioList options={data} selected={selectedGoal} handler={handleGoal} styles={styles} /> : null}
                  </ScrollView>
                  <TouchableOpacity style={styles.roundBtn} onPress={() => { handleNext('goal') }}><Icon name="arrow-right" color="white" size={24}></Icon></TouchableOpacity>
                  <TouchableOpacity style={{ marginVertical: normalize(31) }} onPress={() => handleSkip()}><Text style={styles.plainText}>Παράλειψη</Text></TouchableOpacity>
                </>
                : step == 4 ?
                  <>
                    <Text style={[styles.StepTitle, { marginTop: 0 }]}>Πες μας για εσένα 3/3</Text>
                    <ScrollView style={[styles.listview, { marginTop: normalize(12) }]}>
                      <Text style={styles.radioTitle}>Είσαι:</Text>
                      <RadioList options={genders} selected={selectedGender} handler={handleGender} styles={styles} smaller={true}>
                      </RadioList>
                      <Text style={styles.radioTitle}>Ηλικίας:</Text>
                      <RadioList options={ages} selected={selectedAge} handler={handleAge} styles={styles} smaller={true}>
                      </RadioList>
                    </ScrollView>
                    <TouchableOpacity style={styles.roundBtn} onPress={() => { handleNext('ages') }}><Icon name="arrow-right" color="white" size={24}></Icon></TouchableOpacity>
                    <TouchableOpacity style={{ marginVertical: normalize(31) }} onPress={() => handleSkip()}><Text style={styles.plainText}>Παράλειψη</Text></TouchableOpacity>
                  </>
                  : null}
      </ConditionalWrapper>
    </View>
  )
}

export default UserPreferences;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
  },
  intro: {
    color: '#fff',
    fontSize: normalize(17),
    fontFamily: 'AlegreyaSans_700Bold',
    textAlign: "center",
    paddingHorizontal: normalize(23),
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: normalize(46),
  },
  radioTitle: {
    fontSize: normalize(15),
    fontFamily: 'AlegreyaSans_700Bold',
    lineHeight: normalize(19),
    color: '#E4E4E4',
    marginTop: 0,
    marginBottom: 9,
    textAlign: "center",
  },
  opac: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    height: normalize(66),
    maxHeight: normalize(66),
    width: 300,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: normalize(14),
    marginTop: 16,
  },
  button: {
    width: 300,
    maxWidth: 300,
    borderRadius: 50,
    height: normalize(46),
    maxHeight: normalize(46),
    backgroundColor: '#0176FF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: normalize(31),
  },
  bluesub: {
    fontSize: normalize(19),
    fontFamily: 'AlegreyaSans_700Bold',
    color: '#0176FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(14),
    fontFamily: 'AlegreyaSans_700Bold',
  },
  plainText: {
    color: '#fff',
    fontSize: normalize(13),
    fontFamily: 'AlegreyaSans_400Regular',
  },
  btitle: {
    fontSize: normalize(28),
    color: '#fff',
    marginTop: 6,
    fontFamily: 'AlegreyaSans_700Bold',
  },
  StepTitle: {
    marginTop: 22,
    marginBottom: 5,
    color: '#fff',
    fontSize: normalize(22),
    fontFamily: 'AlegreyaSans_700Bold',
  },
  StepSub: {
    color: '#E4E4E4',
    fontSize: normalize(12),
    fontFamily: 'AlegreyaSans_400Regular'
  },
  listview: {
    flex: 1,
    marginTop: 30,
    paddingHorizontal: normalize(23),
    width: '100%',
  },
  option: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: normalize(14),
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
  roundBtn: {
    width: normalize(63),
    height: normalize(63),
    maxHeight: normalize(63),
    maxWidth: normalize(63),
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#0176FF',
    borderRadius: 50,
  }
})