import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgMask = ({ w, h }) => {
  return (
    <Svg width={w} height={h} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 394 62"><Path fill="#000000" d="M14,0C6.3,0,0,6.3,0,14v34c0,7.7,6.3,14,14,14h150.7c6.7-10.8,18.7-18,32.3-18s25.6,7.2,32.3,18H380
   c7.7,0,14-6.3,14-14V14c0-7.7-6.3-14-14-14H14z"/>
    </Svg>
  )
}

export default SvgMask;
