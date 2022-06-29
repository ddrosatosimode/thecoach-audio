import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { normalize } from '../../utilities/normalize';
const SvgClose = () => {
  return (
    <Svg width={normalize(14)} height={normalize(14)} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><Path fill='#FFF' d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" /></Svg>
  )
}

export default SvgClose;
