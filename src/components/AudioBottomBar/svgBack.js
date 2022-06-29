import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { normalize } from '../../utilities/normalize';
const SvgBack = ({ tp, stl, ww }) => {
  return (
    <Svg width={normalize(320)} height={normalize(81)} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 414 105" style={stl}>
      <Path d="M207 42C224.676 42 239.801 31.081 245.999 15.6201C249.287 7.41806 256.163 0 265 0H414V105H0V0H149C157.837 0 164.713 7.41807 168.001 15.6201C174.199 31.081 189.324 42 207 42Z" fill="#212121" />
    </Svg>
  )
}

export default SvgBack;
