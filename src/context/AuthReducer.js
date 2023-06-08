export const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...state,
        isSignout: false,
        isLoading: false,
        user: action.payload,
      }
    case 'LOGIN_IN':
      return {
        ...state,
        isLoading: false,
      }
    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        user: null,
        isLoading: false,
      }
    case 'UPDATE_FAVS':
      return {
        ...state,
        favorites: action.payload,
      }
    case 'UPDATE_SCH':
      return {
        ...state,
        schedules: action.payload,
      }
    case 'UPDATE_USERSUBSCRIPTION':
      return {
        ...state,
        user: { ...state.user, activeSub: action.payload }
      }
    case 'UPDATE_USERSETTINGS':
      return {
        ...state,
        user: { ...state.user, userSettings: action.payload }
      }
    case 'UPDATE_USERDOWNLOADS':
      return {
        ...state,
        downloads: action.payload,
      }
    case 'SET_PUSH_TOKEN':
      return {
        ...state,
        user: { ...state.user, pushToken: action.payload }
      }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      }
    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: action.payload,
      }
    case 'HANDLE_SIDEBAR':
      return {
        ...state,
        sideFilters: action.payload,
      }
    case 'UPDATE_USERFTE':
      return {
        ...state,
        user: { ...state.user, userFteShown: true }
      }
    case 'SET_ACTIVE_SUB':
      return {
        ...state,
        user: {
          ...state.user,
          activeSub: action.payload
        }
      }
    default:
      return state;
  }
}