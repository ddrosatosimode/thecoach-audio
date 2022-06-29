import { StyleSheet, View, useWindowDimensions, TouchableOpacity, Animated, Text, ScrollView } from "react-native";
import { normalize } from "../../utilities/normalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SvgClose from "./svgClose";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { DataStateContext } from "../../context/DataContext";
import { AuthStateContext } from "../../context/AuthContext";
import { PanGestureHandler } from 'react-native-gesture-handler';
import FilterAccordion from "./FilterAccordion";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

const SideBarFilters = ({ nav }) => {

  const { api_filters } = useContext(DataStateContext);
  const { sideFilters, handleSideFilters } = useContext(AuthStateContext);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [activeFilters, setActiveFilters] = useState(null);
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  let available = height - insets.top;
  const SlideAnim = useRef(new Animated.Value(-300)).current;

  const slideIn = () => {
    Animated.timing(SlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(SlideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    setOpen(sideFilters);
    if (sideFilters) {
      slideIn();
    } else {
      slideOut();
    }
  }, [sideFilters])

  const handleGestureDragging = ({ nativeEvent }) => {
    if (nativeEvent.translationX < -100) {
      slideOut();
      handleSideFilters(false);
    }
  }
  const onPanGestureEvent = useCallback(

    Animated.event(
      [
        {
          nativeEvent: {
            translationX: SlideAnim,
          },
        },
      ],
      {
        useNativeDriver: true,
      }
    ),
    [],
  );


  const handleFilter = (tp, id) => {
    if (activeFilters?.[tp] && activeFilters[tp] == id) {
      let current = { ...activeFilters };
      delete current[tp];
      setActiveFilters(current);
    } else {
      setActiveFilters(activeFilters => ({ ...activeFilters, [tp]: id }))
    }
  }

  const handleTab = (tp) => {
    if (tp == activeTab) {
      setActiveTab(null)
    } else {
      setActiveTab(tp)
    }

  }

  const handleSubmit = () => {
    if (nav.isReady()) {
      setOpen(false);
      handleSideFilters(false);
      slideOut();
      let tofilter = activeFilters;
      setActiveFilters(null);
      setActiveTab(null)
      nav.navigate('Search', tofilter);
    }
  }
  const handleClose = () => {
    setOpen(false);
    handleSideFilters(false);
    slideOut();
  }

  return (
    <View style={[styles.wrapper, open ? { zIndex: 5 } : null, { top: insets.top, maxHeight: available }]}>
      <PanGestureHandler onGestureEvent={onPanGestureEvent} onHandlerStateChange={handleGestureDragging}>
        <Animated.View style={[styles.inner, { transform: [{ translateX: SlideAnim }] }]}>
          <View style={styles.closeWrapper}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => handleClose()}><SvgClose /></TouchableOpacity>
          </View>
          <View style={styles.filtersWrapper}>
            {api_filters ?
              <>

                <FilterAccordion title='ΔΙΑΡΚΕΙΑ' icon='clock' activeTab={activeTab} activeFilters={activeFilters} handleTab={handleTab} handleFilter={handleFilter} api_filter={api_filters.duration_filters} type="duration" />
                <FilterAccordion title='ΕΙΔΟΣ ΠΡΟΠΟΝΗΣΗΣ' icon='running' activeTab={activeTab} activeFilters={activeFilters} handleTab={handleTab} handleFilter={handleFilter} api_filter={api_filters.categories_filters} type="category" />
                <FilterAccordion title='ΕΠΙΠΕΔΟ' icon='intensity' activeTab={activeTab} activeFilters={activeFilters} handleTab={handleTab} handleFilter={handleFilter} api_filter={api_filters.level_filters} type="level" />
                <FilterAccordion title='ΣΤΟΧΟΣ' icon='hearts' activeTab={activeTab} activeFilters={activeFilters} handleTab={handleTab} handleFilter={handleFilter} api_filter={api_filters.target_filters} type="target" />
              </>
              : null}
          </View>
          <TouchableOpacity onPress={() => handleSubmit()} style={styles.searchButton}><Text style={styles.buttonText}>ΑΝΑΖΗΤΗΣΗ</Text></TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

export default SideBarFilters;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: -1,
  },
  inner: {
    backgroundColor: '#f9f7e9',
    maxWidth: 300,
    flex: 1,
    padding: normalize(12),

  },
  closeWrapper: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: "center",
  },
  closeBtn: {
    width: normalize(24),
  },
  filtersWrapper: {
    flex: 5,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  searchButton: {
    width: '100%',
    maxWidth: 289,
    borderRadius: 50,
    height: normalize(46),
    maxHeight: normalize(46),
    backgroundColor: '#0176FF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: normalize(15),
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(14),
    fontFamily: 'AlegreyaSans_700Bold',
  },
})