import React from 'react';
import {
    View,
    SectionList,
    StyleSheet
} from 'react-native';
import {globalStyles,BuildConfiguration, ApiBaseUrl, ApiVersion} from '../../settings';

import {Text} from '../atoms/StandardComponents';

import DeviceInfo from 'react-native-device-info';
import SimpleInfoItem from '../molecules/SimpleInfoItem';
import * as Colors from '../../stylesheets/colors';

const SEPARATOR_HEIGHT = StyleSheet.hairlineWidth;

const aboutListTitle = 'About app';

const styles = StyleSheet.create({
    'container': {
        'flex': 1,
        'backgroundColor': 'white',
        'paddingTop': 10
    },
    'header': {'paddingHorizontal': 20},
    'headerText': {
        'lineHeight': 30,
        'fontSize': 18,
        'color': Colors.GRAY_1,
        'fontWeight': '500'
    },
    'item': {
        'paddingHorizontal': 20,
        'marginTop': 10
    },
    'separator': {
        'marginTop': 10,
        'height': SEPARATOR_HEIGHT,
        'backgroundColor': 'rgb(200, 199, 204)'
    }
});

const AboutPage = () => {

    const SeparatorComponent = () =>
        <View style={styles.separator} />;

    /* eslint react/prop-types: 0 */
    const renderSectionHeader = ({section}) =>
        <View style={styles.header}>
            <Text style={styles.headerText}>{section.key}</Text>
        </View>;
    const renderItem = ({item}) =>
        <View style={styles.item}>
            <SimpleInfoItem item={item} />
        </View>;
    /* eslint-enable react/prop-types */

    const sections = [
        {
            'key': 'Client',
            renderItem,
            'data': [
                {
                    'key': 'BuildConfig',
                    'label': 'Configuration',
                    'text': BuildConfiguration
                },
                {
                    'key': 'BuildNr',
                    'label': 'BuildNr',
                    'text': DeviceInfo.getBuildNumber().toString()
                },
                {
                    'key': 'AppVersion',
                    'label': 'App version',
                    'text': DeviceInfo.getReadableVersion()
                }
            ]
        },
        {
            'key': 'Api',
            renderItem,
            'data': [
                {
                    'key': 'ApiBaseUrl',
                    'label': 'Endpoint',
                    'text': ApiBaseUrl.toString()
                },
                {
                    'key': 'ApiVersion',
                    'label': 'Api version',
                    'text': ApiVersion.toString()
                }

            ]
        }
    ];

    return (
        <SectionList
            style={styles.container}
            sections={sections}
            renderSectionHeader={renderSectionHeader}
            SectionSeparatorComponent={SeparatorComponent}
            removeClippedSubviews={false}
        />
    );

};

AboutPage.navigationOptions = () => ({
    'title': aboutListTitle,
    'titleStyle': {'fontFamily': globalStyles.fontFamily}
});

export default AboutPage;
