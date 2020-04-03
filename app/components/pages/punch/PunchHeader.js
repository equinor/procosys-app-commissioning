import React from 'react';
import {View, Text} from 'react-native';
import { combineTwo } from '../../../utils/misc';

import commonStyles from './commonStyles';


const PunchHeader = ({punch}) => {
    return (
        <View style={commonStyles.header}>
            <View style={{ 'flexDirection': 'row' }}>
                <Text style={commonStyles.headerLabel}>Module</Text>
                <Text style={commonStyles.headerText}>{punch.SystemModule}</Text>
            </View>
            <View style={{ 'flexDirection': 'row' }}>
                <Text style={commonStyles.headerLabel}>Tag</Text>
                <Text style={commonStyles.headerText}>{combineTwo(punch.TagNo, punch.TagDescription)}</Text>
            </View>
        </View>
    );
}

export default PunchHeader;