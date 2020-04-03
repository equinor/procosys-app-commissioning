import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const landscape = width > height;
const guidelineBaseWidth = landscape ? 680 : 350;
const guidelineBaseHeight = landscape ? 350 : 680;

const scale = (size) => Math.round(width / guidelineBaseWidth * size);
const verticalScale = (size) => Math.round(height / guidelineBaseHeight * size);
const moderateScale = (size, factor = 0.5) => Math.round(size + (scale(size) - size) * factor);

export {scale, verticalScale, moderateScale};
