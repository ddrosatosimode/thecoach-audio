import { useReducer, createContext, useEffect, useRef, useState } from "react";
import { AuthReducer } from './AuthReducer'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export const geFte = async () => {
  try {
    const fte = await AsyncStorage.getItem('shownfte');
    return fte ? parseInt(fte) : 0
  } catch (error) {
    console.log('error', error);
  }
}


const initialState = {
  isLoading: true,
  isSignout: false,
  user: null,
  favorites: [],
  schedules: [],
  tos: false,
  notifications: [],
  sideFilters: false,
  downloads: [],
}

const addHelper = async (key, id) => {
  const storedData = await AsyncStorage.getItem(key);
  const ini = [id]
  if (storedData !== null && storedData) {
    const ar = storedData.toString().split(',');
    ar.push(id);
    const itemsString = ar.join(',');
    await AsyncStorage.setItem(key, itemsString);
    return ar;
  } else {
    await AsyncStorage.setItem(key, id);
    return ini;
  }
}

const removeHelper = async (key, id) => {
  const storedData = await AsyncStorage.getItem(key);
  if (storedData !== null && storedData) {
    const ar = storedData.toString().split(',');
    const removeItem = ar.filter(e => e !== id);
    const itemsString = removeItem.join(',');
    await AsyncStorage.setItem(key, itemsString);
    return removeItem;
  }
  return null;
}

export const AuthStateContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);
  const [initToken, setInitToken] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (state?.user?.id > 0) {
      if (!initToken) {
        setInitToken(true);
        registerForPushNotificationsAsync()
          .then(token => token)
          .then(tokenData => {
            let dataToSend = { user_id: state.user.id, user_token: tokenData };
            let formBody = [];
            for (let key in dataToSend) {
              let encodedKey = encodeURIComponent(key);
              let encodedValue = encodeURIComponent(dataToSend[key]);
              formBody.push(encodedKey + '=' + encodedValue);
            }
            formBody = '&' + formBody.join('&');
            return fetch('https://thecoach.gr/index.php?option=com_imodeuserplans&task=app.saveToken&format=json', {
              method: 'POST',
              body: formBody,
              headers: {
                'Content-Type':
                  'application/x-www-form-urlencoded;charset=UTF-8',
              },
            })
          })
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.id > 0) {
              dispatch({ type: 'SET_PUSH_TOKEN', payload: responseJson.token });
            }
          })
      }
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
      });

      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        //console.log(response);
      });

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, [state]);

  const checkUserSubscription = async (uid) => {
    try {
      const response = await fetch('https://thecoach.gr/index.php?option=com_imodeuserplans&task=app.checkUserSub&id=' + uid + '&format=json', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      if (json) {
        return json.status;
      }
    } catch (error) {
      console.error(error);
    }
  }

  /* Get Expo Token */
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }


  const getUser = async () => {
    try {
      const usr = await AsyncStorage.getItem('user');
      if (usr != null) {
        const authData = JSON.parse(usr);
        const subStatus = await checkUserSubscription(authData.id);
        if (subStatus) {
          const UserSettings = await AsyncStorage.getItem('userSettings');
          if (UserSettings) {
            const UserSettingsData = JSON.parse(UserSettings);
            authData.userSettings = UserSettingsData;
          }
          dispatch({ type: 'SIGN_IN', payload: authData });
        } else {
          await AsyncStorage.removeItem('user');
          dispatch({ type: 'SIGN_OUT' });
        }
      } else {
        dispatch({ type: 'LOGIN_IN' });
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  useEffect(() => {
    async function fetchFavorites() {
      const items = await AsyncStorage.getItem('favorites');
      if (items) {
        let ar = items.split(',');
        dispatch({ type: 'UPDATE_FAVS', payload: ar });
      }
    }
    fetchFavorites();
  }, []);

  useEffect(() => {
    //AsyncStorage.removeItem('AUDIO@thecoach').then(() => { console.log('clear') });
    AsyncStorage.getItem('AUDIO@thecoach').then((result) => {
      if (result != null) {
        const data = JSON.parse(result);
        dispatch({ type: 'UPDATE_USERDOWNLOADS', payload: data });
      }
    });
  }, []);

  useEffect(() => {
    async function fetchSchedule() {
      const items = await AsyncStorage.getItem('schedules');
      if (items) {
        let ar = items.split(',');
        dispatch({ type: 'UPDATE_SCH', payload: ar });
      }
    }
    fetchSchedule();
  }, []);

  const updateAsync = async (id, tp, k) => {
    let upd;
    let s = 'UPDATE_SCH';
    if (k == 'favorites') {
      s = 'UPDATE_FAVS';
    }
    if (tp == 'add') {
      upd = await addHelper(k, id);
    } else {
      upd = await removeHelper(k, id);
    }
    if (upd) {
      dispatch({ type: s, payload: upd });
    }
  }

  function signIn(user) {

    dispatch({
      type: 'SIGN_IN',
      payload: user
    })
  }
  const signOut = async () => {
    await AsyncStorage.removeItem('user');
    dispatch({
      type: 'SIGN_OUT',
    })
  }

  function openLogin() {
    dispatch({
      type: 'LOGIN_IN',
    })
  }
  const updateDownloads = async (items) => {
    await AsyncStorage.setItem('AUDIO@thecoach', JSON.stringify(items));
    dispatch({
      type: 'UPDATE_USERDOWNLOADS',
      payload: items,
    })
  }
  const updateUserSettings = async (settings) => {
    await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
    dispatch({
      type: 'UPDATE_USERSETTINGS',
      payload: settings,
    })
  }

  const updateUserFTE = async () => {
    await AsyncStorage.setItem('userFteShown', 'YES');
    dispatch({
      type: 'UPDATE_USERFTE'
    })
  }

  const updateNotifications = (data) => {
    dispatch({
      type: 'UPDATE_NOTIFICATION',
      payload: data
    })
  }

  const handleSideFilters = (bool) => {
    dispatch({
      type: 'HANDLE_SIDEBAR',
      payload: bool
    })
  }
  return (
    <AuthStateContext.Provider value={{
      user: state.user,
      isLoading: state.isLoading,
      isSignout: state.isSignout,
      favorites: state.favorites,
      schedules: state.schedules,
      downloads: state.downloads,
      tos: state.tos,
      notifications: state.notifications,
      sideFilters: state.sideFilters,
      openLogin,
      signIn,
      signOut,
      updateAsync,
      updateUserSettings,
      updateNotifications,
      updateUserFTE,
      handleSideFilters,
      updateDownloads,
    }}>
      {children}
    </AuthStateContext.Provider>
  );
}