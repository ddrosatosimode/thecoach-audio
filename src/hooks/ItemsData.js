export const useApiDataList = (api_data, cat = 0, schedules = null, userlist = false, path = null, user = null, setData, setLoading, limit = 0) => {
  if (cat > 0 && path == 'target') {
    const filtered = api_data.sort(() => 0.5 - Math.random()).filter(item => {
      return item.target_ids.toString().indexOf(cat) >= 0
    })
    if (limit > 0) {
      let limited = filtered.slice(0, 10);
      setData(limited);
    }
    else {
      setData(filtered);
    }
    setLoading(false);
  }
  if (cat > 0 && path == 'level') {
    const filtered = api_data.filter(item => {
      return item.level_ids.toString().indexOf(cat) >= 0
    })
    if (limit > 0) {
      let limited = filtered.slice(0, 10);
      setData(limited);
    }
    else {
      setData(filtered);
    }
    setLoading(false);
  }
  if (cat > 0 && path == 'category') {
    const filtered = api_data.sort(() => 0.5 - Math.random()).filter(item => {
      return item.category_ids.toString().indexOf(cat) >= 0
    })
    if (limit > 0) {
      let limited = filtered.slice(0, 10);
      setData(limited);
    }
    else {
      setData(filtered);
    }
    setLoading(false);
  }
  if (userlist) {
    const filtered = api_data.filter(item => {
      return schedules.toString().indexOf(item.id) >= 0
    })
    if (limit > 0) {
      let limited = filtered.slice(0, 10);
      setData(limited);
    }
    else {
      setData(filtered);
    }
    setLoading(false);
  }
  if (path == 'featured' && user?.id) {
    if (user?.userSettings?.goal && user?.userSettings?.level) {
      const filtered = api_data.filter(item => {
        return item.target_ids.toString().indexOf(user.userSettings.goal) >= 0 && item.level_ids.toString().indexOf(user.userSettings.level) >= 0
      })
      if (limit > 0) {
        let limited = filtered.slice(0, 10);
        setData(limited);
      }
      else {
        setData(filtered);
      }
      setLoading(false);
    } else {
      const shuffled = api_data.sort(() => 0.5 - Math.random());
      let filtered = shuffled.slice(0, 10);
      setData(filtered);
      setLoading(false);
    }
  }
  if (path == 'random') {
    const shuffled = api_data.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 10);
    setData(selected);
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