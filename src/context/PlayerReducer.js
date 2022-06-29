export const PlayerReducer = (state, action) => {
  switch (action.type) {
    case 'PUSH_DATA':
      return {
        ...state,
        audio: action.payload,
      }
    case 'DURATION':
      return {
        ...state,
        duration: action.payload
      }
    case 'PROGRESS':
      return {
        ...state,
        playProgress: action.payload
      }
    case 'PLAY':
      return {
        ...state,
        isPlaying: action.payload,
        stop: false,
      }
    case 'STOP':
      return {
        ...state,
        stop: true,
        audio: {
          ...state.audio,
          source: null,
          start: 1,
        },
      }
    case 'SEEK':
      return {
        ...state,
        seekTo: action.payload
      }
    case 'UNSET_CLEAR':
      return {
        ...state,
        clear: false
      }
    case 'CLEAR':
      return {
        ...state,
        audio: {},
        isPlaying: false,
        clear: true,
      }
    case 'OPEN_MINI':
      return {
        ...state,
        mini: action.payload
      }
    default:
      return state
  }
}