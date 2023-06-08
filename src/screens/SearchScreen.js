import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AudioBox from "../components/AudioBox";
import AudioFilters from "../components/AudioFilters";
import { AlegreyaSans_800ExtraBold } from "@expo-google-fonts/alegreya-sans";
import { DataStateContext } from "../context/DataContext";

const SearchScreen = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [searchState, setSearchState] = useState(route.params);
  const [data, setData] = useState([]);
  const { api_data } = useContext(DataStateContext);
  const [temp, setTemp] = useState([]);
  const freeSort = (items) => {
    items.sort((a, b) => {
      if (a.availability === "free" && b.availability !== "free") {
        return -1; // a comes before b
      } else if (a.availability !== "free" && b.availability === "free") {
        return 1; // a comes after b
      } else {
        return 0; // the order remains the same
      }
    });
    return items;
  }
  const useSearch = (filters) => {
    let result = data.filter((item) => {
      for (let key in filters) {
        if (item[key + '_ids'].toString().indexOf(filters[key]) < 0 || item[key + '_ids'] === undefined) {
          return false;
        }
      }
      return true;
    });

    setTemp(freeSort(result));
  }
  useEffect(() => {
    if (api_data) {
      setData(api_data);
      setTemp(api_data);
      setLoading(false);
    }
  }, [api_data]);

  useEffect(() => {
    if (searchState) {
      useSearch(searchState);
    }
  }, [data, searchState]);

  const handleFilter = (tp, id) => {
    if (searchState?.[tp] && searchState[tp] == id) {
      let current = { ...searchState };
      delete current[tp];
      setSearchState(current);
    } else {
      setSearchState(searchState => ({ ...searchState, [tp]: id }))
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#000' translucent={false} style="light" animated={true} />
      <ScrollView style={{ flex: 1, width: '100%', paddingTop: 20 }}>
        <AudioFilters navigation={navigation} mode='dynamic' useSearch={handleFilter} searchState={searchState} pad={30} pb={0} />
        <View style={{ width: '100%', paddingTop: 20, paddingHorizontal: 30 }}>
          {isLoading ? <ActivityIndicator /> : temp.length == 0 ? <View style={{ flex: 1, width: "100%", justifyContent: 'center', alignItems: 'center', height: '100%' }}><Text style={{ color: '#fff', paddingVertical: 30, fontSize: 18 }}>Δεν βρέθηκαν αποτελέσματα</Text></View> :
            temp.map((item, index) => {
              return (
                <AudioBox key={index} item={item} index={index} tmpl='full' navigation={navigation} />
              )
            })}
        </View>
      </ScrollView>
    </SafeAreaView>

  )
}

export default SearchScreen;

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
});