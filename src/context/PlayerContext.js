import React, { useReducer, createContext, useMemo, useState } from "react";
import { PlayerReducer } from './PlayerReducer'

const initialState = {
  audio: {},
  duration: '00:00',
  isPlaying: false,
  stop: false,
  seekTo: 0,
  clear: false,
  mini: false
}

const initialStateT = {
  playProgress: '00:00',
  playSeconds: 0,
}

export const PlayerStateContext = createContext(initialState);
export const TimerStateContext = createContext();

export const TimerProvider = ({ children }) => {
  const [playProgress, pushProgress] = useState(null);
  const [playSeconds, pushPlaySeconds] = useState(0);
  const value = useMemo(() => ({
    playProgress, pushProgress,
    playSeconds, pushPlaySeconds,
  }), [playProgress, playSeconds]);

  return (
    <TimerStateContext.Provider value={value}>
      {children}
    </TimerStateContext.Provider>
  );
}

export const PlayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PlayerReducer, initialState);

  function pushAudio(audio) {
    dispatch({
      type: 'PUSH_DATA',
      payload: audio
    })
  }
  function pushPlay(bool) {
    dispatch({
      type: 'PLAY',
      payload: bool
    })
  }

  function pushStop() {
    dispatch({
      type: 'STOP',
      payload: true
    })
  }

  function goSeek(seek) {
    dispatch({
      type: 'SEEK',
      payload: seek
    })
  }
  function pushDuration(tm) {
    dispatch({
      type: 'DURATION',
      payload: tm
    })
  }
  function clearContext(bool) {
    dispatch({
      type: 'CLEAR',
      payload: bool
    })
    dispatch({
      type: 'UNSET_CLEAR',
      payload: false
    })
  }
  function openMini(bool) {
    dispatch({
      type: 'OPEN_MINI',
      payload: bool
    })
  }
  return (
    <PlayerStateContext.Provider value={{
      audio: state.audio,
      isPlaying: state.isPlaying,
      duration: state.duration,
      seekTo: state.seekTo,
      stop: state.stop,
      clear: state.clear,
      mini: state.mini,
      pushAudio,
      pushPlay,
      pushDuration,
      goSeek,
      clearContext,
      openMini,
      pushStop
    }}>
      {children}
    </PlayerStateContext.Provider>
  );
};