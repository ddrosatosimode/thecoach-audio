export const DataReducer = (state, action) => {
  switch (action.type) {
    case 'API_DATA':
      return {
        ...state,
        api_data: action.payload,
        api_loading: false,
      }
    case 'API_FILTERS':
      return {
        ...state,
        api_filters: action.payload,
      }
    case 'API_GOALS':
      return {
        ...state,
        api_goals: action.payload,
      }
    case 'API_LOADING':
      return {
        ...state,
        api_loading: action.payload,
      }
  }
}