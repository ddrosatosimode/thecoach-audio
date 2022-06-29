import { normalize } from '../../utilities/normalize';
import { Text, TouchableOpacity, View } from "react-native";

const RadioList = ({ options, selected, handler, styles, smaller = false }) => {
  return (
    <>
      {options.map((option, k) => {
        return (
          <TouchableOpacity onPress={() => handler(option.id)} key={k} style={[styles.option, selected == option.id ? { backgroundColor: '#FADA6B' } : null, smaller ? { height: normalize(37) } : null]}>
            <Text style={[styles.optionText, selected == option.id ? { color: '#212121' } : null, smaller ? { fontSize: normalize(12) } : null]}>{option.title}</Text>
            <View style={[smaller ? styles.rb_small : styles.rb, selected == option.id ? { backgroundColor: '#FFF', borderWidth: 0, opacity: 1 } : null,]}>{selected == option.id && <View style={styles.selected}></View>}</View>
          </TouchableOpacity>
        )
      })}
    </>
  )
}
export default RadioList;