import {StyleSheet} from 'react-native';
import * as Colors from '../../../stylesheets/colors';
import { globalStyles } from '../../../settings';
import { moderateScale } from '../../../utils/scaling';



const styles = StyleSheet.create({
    component: {
      flex: 1,
      backgroundColor: 'white'
  
    },
    row: { flexDirection: 'row', padding: 10 },
    header: {
      backgroundColor: Colors.GRAY_4,
      padding: 15,
      borderBottomColor: Colors.GRAY_3,
      borderBottomWidth: 1
    },
    item: {
      borderBottomWidth: 1,
      padding: 10,
      borderColor: Colors.GRAY_3
    },
    itemDesc: {},
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      color: '#000',
      padding: 10,
      margin: 40
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    scopeStatus: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    headerLabel: {
      flex: 2,
      ...globalStyles.title,
      color: Colors.GRAY_2
    },
    headerText: {
      flex: 5,
      ...globalStyles.title,
      color: Colors.GRAY_2
    },
    buttonStyle: {
      backgroundColor: Colors.BLUE,
      width: moderateScale(100),
      height: moderateScale(30),
      marginLeft: 10,
  
      borderRadius: 6
    },
    buttonRow: {
        flex: 70,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    cameraButton: {
      backgroundColor: Colors.BLUE,
      width: moderateScale(60),
      height: moderateScale(40),
      justifyContent: 'center',
      alignItems: 'center'
    },
    sectionContent: {
        flex: 70
    },
    sectionLabel: {
        flex: 30,
        alignSelf: 'center'
    },
    sectionContainer: {
        borderBottomColor: Colors.GRAY_3,
        borderBottomWidth: 1,
        marginBottom: 350
    },
    descriptionInput: {
        flex: 70,
        height: 160,
        marginLeft: 10,
        padding: 10,
        borderWidth: 1
    },
    leftSideColumn: {
        flex: 30,
        alignSelf: 'flex-end'
    },
    rightSideColumn: {
        flex: 70
    },
    errorText: {
        flex: 70,
        textAlign: 'right',
        color: Colors.RED
    },
    loadingText: {
        fontSize: 24,
        padding: 10,
        textAlign: 'center'
    }
  
  });

  export default styles;