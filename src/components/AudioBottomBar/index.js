import React, { useState, useEffect, useContext } from 'react';
import { AlegreyaSans_400Regular } from "@expo-google-fonts/alegreya-sans";
import { View, Text, StyleSheet, TouchableOpacity, Share, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from '../CustomIcons';
import SvgBack from './svgBack';
import { AuthStateContext } from '../../context/AuthContext';
import { PlayerStateContext } from '../../context/PlayerContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { normalize } from '../../utilities/normalize';
import Toast from 'react-native-root-toast';

const AudioBottomBar = ({ onlyPlayer = false, ww, handleModalOpen, inside = false, aid, sharer, url, setToastMessage, setToastVisible }) => {
  const insets = useSafeAreaInsets();
  const [scheduler, setScheduler] = useState('');
  const [favs, setFavs] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [progressP, setProgressP] = useState(false);
  const { favorites, updateAsync, schedules, updateDownloads, downloads } = useContext(AuthStateContext);
  const { isPlaying, audio } = useContext(PlayerStateContext);
  const handleScheduleAdd = () => {
    let tp = 'add';
    let msg = 'Προστέθηκε στο Πρόγραμμα'
    if (schedules.indexOf(aid) > -1) {
      tp = 'remove';
      msg = 'Επιτυχής Αφαίρεση';
    }
    updateAsync(aid, tp, 'schedules');
    Toast.show(msg, {
      duration: 2000,
      position: 0,
      shadow: false,
      animation: false,
      hideOnPress: true,
      backgroundColor: 'green',
      textColor: '#FFF',
      delay: 50,
      opacity: 1,
    });
  }

  const handleFavAdd = () => {
    let tp = 'add';
    let msg = 'Προστέθηκε στα Αγαπημένα'
    if (favorites.indexOf(aid) > -1) {
      tp = 'remove';
      msg = 'Επιτυχής Αφαίρεση';
    }
    updateAsync(aid, tp, 'favorites');
    Toast.show(msg, {
      duration: 2000,
      position: 0,
      shadow: false,
      animation: false,
      hideOnPress: true,
      backgroundColor: 'green',
      textColor: '#FFF',
      delay: 50,
      opacity: 1,
    });
  }

  const handleSave = () => {
    if (downloading) {
      return;
    }
    setDownloading(true);
    const uri = url;
    let fileUri = FileSystem.documentDirectory + url.split('/').pop();

    const callback = downloadProgress => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      setProgressP(progress);
    };

    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      callback
    );

    downloadResumable.downloadAsync()
      .then(({ uri }) => {
        const d = {
          id: aid,
          uri: uri,
        };
        downloads.push(d);
        updateDownloads(downloads);
        Toast.show('Download Complete', {
          duration: 2000,
          position: 0,
          shadow: false,
          animation: false,
          hideOnPress: true,
          backgroundColor: 'green',
          textColor: '#FFF',
          delay: 50,
          opacity: 1,
        });
        setDownloading(false);
        //shareFile(uri);
      })
      .catch(error => {
        console.error(error);
      })
  }
  const shareFile = async (fileUri) => {
    setDownloading(false);
    const fileDetails = {
      extension: '.mp3',
      shareOptions: {
        mimeType: 'audio/mpeg',
        dialosTitle: 'Check out this audio!',
        UTI: 'audio/mpeg',
      },
    };
    if (!(await Sharing.isAvailableAsync())) {
      alert('No Sharing available')
      return;
    }
    await Sharing.shareAsync(fileUri, fileDetails.shareOptions);
  }
  const idexists = () => {
    return downloads.some(item => { return item.id == aid })
  }

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'TheCoach App | ' + sharer,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }
  return (
    <>

      {!onlyPlayer ?
        <View style={[styles.bottomWrapper, inside ? styles.dark : null]}>

          {!inside && (aid != audio.id || (!isPlaying && aid == audio.id)) ? <SvgBack tp="curved" stl={{ position: 'absolute', bottom: -normalize(8), left: 0, width: '100%', height: 'auto' }} ww={ww}></SvgBack> : null}
          <TouchableOpacity style={styles.bottomCol} onPress={() => handleScheduleAdd()}>
            <Icon name="calendar-add" size={normalize(19)} color={schedules.indexOf(aid) > -1 ? "#0176FF" : "#fff"} />
            <Text style={styles.bottomText}>Πρόγραμμα</Text>
          </TouchableOpacity>
          {downloads && downloads.length > 0 && idexists() ?
            <View style={[styles.bottomCol, { marginRight: 10 }]}>
              <Icon name="download" size={normalize(19)} color="#fff" />
              <Text style={[styles.bottomText, { color: '#9adf35' }]}>Αποθηκευμένο</Text>
            </View>
            :
            <TouchableOpacity style={[styles.bottomCol, { marginRight: 10 }]} onPress={() => handleSave()}>
              {downloading && progressP && progressP < 1 ? <Text style={styles.progressText}>{parseInt(progressP * 100)}%</Text> : <Icon name="download" size={normalize(19)} color="#fff" />}
              <Text style={styles.bottomText}>Αποθήκευση</Text>
            </TouchableOpacity>
          }
          <TouchableOpacity style={[styles.bottomCol, { marginLeft: 10 }]} onPress={() => handleShare()}>
            <Icon name="share" size={normalize(19)} color="#fff" />
            <Text style={styles.bottomText}>Μοιράσου το</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomCol} onPress={() => handleFavAdd()}>
            <Icon name="favorites-add" size={normalize(19)} color={favorites.indexOf(aid) > -1 ? "#ff3838" : "#fff"} />
            <Text style={styles.bottomText}>Αγαπημένα</Text>
          </TouchableOpacity>
          {handleModalOpen && (aid != audio.id || (!isPlaying && aid == audio.id)) ?
            <TouchableOpacity style={[styles.bigPlay, { transform: [{ translateX: -normalize(28) }, { translateY: -normalize(28) }] }]} onPress={() => handleModalOpen()}><Icon name="play" size={normalize(19)} color="#fff" /></TouchableOpacity> : null}
        </View>
        : null}
    </>
  )
}
export default AudioBottomBar;

const styles = StyleSheet.create({
  bottomWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxHeight: normalize(81),
    paddingTop: normalize(15),
    paddingBottom: normalize(15),
    zIndex: 2,
    elevation: 2,
  },
  progressText: {
    fontSize: normalize(17),
    color: '#fff',
  },
  dark: {
    backgroundColor: '#000',
    paddingBottom: normalize(15),
  },
  bottomCol: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    alignSelf: 'center',
  },
  bottomText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'AlegreyaSans_400Regular',
    marginTop: 8,
  },
  bigPlay: {
    width: normalize(53),
    height: normalize(53),
    borderRadius: 50,
    backgroundColor: '#0176FF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    top: normalize(8),
    left: '50%',
    elevation: 3,
    zIndex: 3,
  }
})