import Filter from "./filter"
import { FlatList, ScrollView, ActivityIndicator } from "react-native"
import { useState, useEffect, useContext } from "react";
import { DataStateContext } from "../../context/DataContext";
const AudioFilters = ({ navigation, mode = false, useSearch = false, searchState = {}, pad = 30, pb = 30 }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const { api_filters } = useContext(DataStateContext);
  useEffect(() => {
    if (api_filters) {
      setData(api_filters.all_filters);
      setLoading(false);
    }
  }, [api_filters]);

  if (!data) return <ActivityIndicator />
  const numColumns = Math.ceil(data.length / 2);
  return (
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: pb, paddingLeft: pad, backgroundColor: '#000' }}>
      {isLoading ? <ActivityIndicator /> : (
        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            return (
              <Filter key={index} item={item} navigation={navigation} mode={mode} useSearch={useSearch} searchState={searchState} />
            )
          }}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{
            alignSelf: 'flex-start',
          }}
          numColumns={numColumns}
        />)}
    </ScrollView>
  )
}

export default AudioFilters