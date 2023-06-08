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
export const useApiDataList = (api_data, cat = 0, schedules = null, userlist = false, path = null, user = null, setData, setLoading, limit = 0) => {
  if (cat > 0 && path == 'target') {
    const filtered = api_data.filter(item => item.target_ids.includes(cat.toString()))
    let sorted = freeSort(filtered);
    if (limit > 0) {
      let limited = sorted.slice(0, 10);
      setData(limited);
    }
    else {
      setData(sorted);
    }
    setLoading(false);
  }
  if (cat > 0 && path == 'level') {
    let filtered = api_data.filter(item => item.level_ids.includes(cat.toString()))
    let sorted = freeSort(filtered);
    if (limit > 0) {
      let limited = sorted.slice(0, 10);
      setData(limited);
    }
    else {
      setData(sorted);
    }
    setLoading(false);
  }
  if (cat > 0 && path == 'category') {
    const filtered = api_data.filter(item => item.category_ids.includes(cat.toString()));
    let sorted = freeSort(filtered);
    if (limit > 0) {
      let limited = sorted.slice(0, 10);
      setData(limited);
    }
    else {
      setData(sorted);
    }
    setLoading(false);
  }
  if (userlist) {
    const filtered = api_data.filter(item => {
      return schedules.includes(item.id)
    })
    let sorted = freeSort(filtered);
    if (limit > 0) {
      let limited = sorted.slice(0, 10);
      setData(limited);
    }
    else {
      setData(sorted);
    }
    setLoading(false);
  }
  if (path == 'featured' && user?.id) {
    if (user?.userSettings?.goal && user?.userSettings?.level) {
      const filtered = api_data.filter(item => {
        return item.target_ids.toString().indexOf(user.userSettings.goal) >= 0 && item.level_ids.toString().indexOf(user.userSettings.level) >= 0
      })
      let sorted = freeSort(filtered);
      if (limit > 0) {
        let limited = sorted.slice(0, 10);
        setData(limited);
      }
      else {
        setData(sorted);
      }
      setLoading(false);
    } else {
      const shuffled = api_data.sort(() => 0.5 - Math.random());
      let filtered = shuffled.slice(0, 10);
      let sorted = freeSort(filtered);
      // Sort the filtered array with "free" availability items first
      setData(sorted);
      setLoading(false);
    }
  }
  if (path == 'random') {
    const shuffled = api_data.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 10);
    let sorted = freeSort(selected);
    setData(sorted);
    setLoading(false);
  }
}

export const useDataByIds = (api_data, ids, setData, setLoading) => {
  const filtered = api_data.filter(item => {
    //return ids.toString().indexOf(item.id) >= 0
    return ids.includes(item.id)
  })
  setData(filtered);
  setLoading(false);
}

export const useSingleAudio = (api_data, id, setData, setLoading) => {
  const filtered = api_data.filter(item => {
    return item.id === id
  })
  setData(filtered[0]);
  setLoading(false);
}