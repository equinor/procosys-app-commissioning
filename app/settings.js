import { Resources } from './settings.json';
import { scale, moderateScale, verticalScale} from './utils/scaling';

export {
  AzureADTenantId,
  AzureADClientId,
  AzureADRedirectUrl,
  BuildConfiguration,
  ApiBaseUrl,
  ApiVersion,
  BuildNumber,
  ApiResourceIdentifier
} from './settings.json';

// Global style settings
export const globalStyles = ({

  fontFamily: 'Equinor-Regular',
  title:{
    fontSize:moderateScale(13),
  },

  viewProps : {
    flex:1
  },
  containerProps: {
    flex:1,
    paddingLeft:moderateScale(10),
    paddingRight:moderateScale(10),
    backgroundColor:'white'


  },
  textInputProps : {
      paddingVertical: 5,
      paddingHorizontal: 10,
      fontSize: moderateScale(11),
      borderColor:'#E4E4E4',
      borderWidth:1,
      backgroundColor:'rgba(228, 228, 228, 0.16)',
      textAlignVertical: 'top' //android only
  },

  textProps : {
      fontSize:moderateScale(11),
      color: 'black'
  },

  imageProps : {
    //resizeMode: 'stretch'
  },

  touchableOpacityProps : {
  }
})


export const getResource = name => Resources[name];
