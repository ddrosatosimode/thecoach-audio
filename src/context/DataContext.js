import { useReducer, createContext, useEffect, useContext } from "react";
import { AuthStateContext } from "./AuthContext";
import { DataReducer } from "./DataReducer";

const initialState = {
  api_data: null,
  api_filters: null,
  api_goals: null,
  api_loading: true,
}

export const DataStateContext = createContext(initialState);

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(DataReducer, initialState);
  const { user } = useContext(AuthStateContext);

  const useFullData = async () => {
    try {
      const response = await fetch('https://thecoach.gr/index.php?option=com_imodeuserplans&task=app.audiolist&full=1&format=json', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      if (json.list) {
        dispatch({
          type: 'API_DATA',
          payload: json.list,
        })
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({
        type: 'API_LOADING',
        payload: false,
      })
    }
  }

  const useFiltersMixes = async () => {
    try {
      const response = await fetch('https://thecoach.gr/index.php?option=com_imodeuserplans&task=app.getMixedFilters&format=json', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      if (json) {
        dispatch({
          type: 'API_FILTERS',
          payload: json,
        })
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({
        type: 'API_LOADING',
        payload: false,
      })
    }
  }

  const useGoals = async () => {
    try {
      const response = await fetch('https://thecoach.gr/index.php?option=com_imodeuserplans&task=app.getFilters&format=json', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      if (json) {
        dispatch({
          type: 'API_GOALS',
          payload: json,
        })
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({
        type: 'API_LOADING',
        payload: false,
      })
    }
  }

  useEffect(() => {
    if (user?.id > 0) {
      useFullData();
      useFiltersMixes();
      useGoals();

    }
  }, [user]);


  return (
    <DataStateContext.Provider value={{
      api_data: state.api_data,
      api_filters: state.api_filters,
      api_goals: state.api_goals,
      api_loading: state.api_loading,
    }}>
      {children}
    </DataStateContext.Provider>
  );
}