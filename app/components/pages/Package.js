/* eslint-disable max-lines-per-function */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as actions from '../../actions';
import {connect} from 'react-redux';
import * as appReducer from '../../reducers/appData';
import * as reducer from '../../reducers/packagePage';
import * as Colors from '../../stylesheets/colors';
import {moderateScale} from '../../utils/scaling';

import scopeIconBlue from '../../../resources/images/icon_check_circle_blue.png';
import scopeIconBlack from '../../../resources/images/icon_check_circle_black.png';

import tasksIconBlue from '../../../resources/images/tasks_selected.png';
import tasksIconBlack from '../../../resources/images/tasks_notselected.png';

import {globalStyles} from '../../settings';
import SelectableButton from '../molecules/SelectableButton';

import _ from 'lodash';

import renderScopeStatus, {renderPunchStatus, renderTaskStatus, renderPackageStatus, highestStatus} from '../molecules/StatusRender';

import {
    View,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import {TouchableOpacity, Text, Container, ScrollView} from '../atoms/StandardComponents';

import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
    'component': {
        'flex': 1,
        'backgroundColor': 'white'
    },
    'row': {'flexDirection': 'row'},

    'summary': {
        'borderBottomWidth': 1,
        'backgroundColor': Colors.GRAY_4,
        'padding': 10,
        'paddingTop': 20,
        'paddingBottom': 20,
        'borderBottomColor': Colors.GRAY_3
    },
    'resultSummary': {
        'backgroundColor': Colors.GRAY_4,
        'padding': 10
    },
    'title': {
        'flex': 9,
        ...globalStyles.title,
        'minHeight': 40,
        'color': Colors.GRAY_1
    },

    'detail': {
        'flex': 1,
        'color': Colors.GRAY_1
    },

    'detailHeader': {
        'flex': 1,
        'color': Colors.GRAY_2,
        'paddingLeft': 20
    },
    'iconView': {
        'flex': 1,
        'paddingRight': 10,
        'paddingLeft': moderateScale(10),
        'alignSelf': 'flex-end'

    },
    'statusView': {
        'flex': 1,
        'paddingLeft': moderateScale(5),
        'paddingTop': moderateScale(2)

    },
    'scopeResult': {
        'flexDirection': 'row',
        'borderBottomWidth': 1,
        'borderBottomColor': Colors.GRAY_3,
        'paddingTop': moderateScale(20),
        'paddingBottom': moderateScale(20)

    },

    'scopeStatus': {
        'flex': 1,
        'justifyContent': 'center',
        'alignItems': 'center'
    },
    'scopeStatusText': {
        'textAlign': 'center',
        'borderColor': Colors.GRAY_2,
        'borderRadius': 4,
        'paddingTop': 4,
        'borderWidth': 2,
        'marginLeft': '5%',
        'marginRight': '15%'
    },
    'scopeImageStyle': {
        'alignSelf': 'center',
        'height': 24,
        'width': 24,
        'borderWidth': 0,
        'borderRadius': 12
    },
    'scopeDesc': {'flex': 5},
    'scopeType': {'flex': 2}
});


class DefaultPage extends Component {

    static propTypes = {
        'navigation': PropTypes.object.isRequired,
        'requestAllBookmarks': PropTypes.func,
        'selectScopes': PropTypes.func,
        'loadScope': PropTypes.func,
        'loadPunch': PropTypes.func,
        'loadTask': PropTypes.func,
        'selectTasksTask': PropTypes.func,
        'selectTasksParameters': PropTypes.func,
        'selectTasksAttachments': PropTypes.func,
        'selectTasks': PropTypes.func,
        'selectPunches': PropTypes.func,
        'allBookmarked': PropTypes.array
    }

    componentDidMount () {

        if (!this.props.allBookmarked) {

            this.props.requestAllBookmarks();

        }
        this.props.selectScopes();

    }

   static navigationOptions = ({navigation}) => ({
       'title': 'Comm ProCoSys',
       'titleStyle': {'fontFamily': globalStyles.fontFamily}
   });


   renderScopes (scopes) {

       if (!scopes || scopes.length === 0) {

           return <Text style={{
               'fontSize': 24,
               'padding': 10,
               'textAlign': 'center'
           }}>Empty scope</Text>;

       }
       return <ScrollView>
           {scopes.map((item) => <TouchableOpacity key={item.Id} onPress={() => {

               // Mock-data. Could probably be moved to api
               this.props.navigation.navigate('ScopeRoute');
               this.props.loadScope(item);


           }}>
               <View style={styles.scopeResult}>
                   {<View style={styles.scopeStatus}>{renderScopeStatus(item.Status)}</View>}
                   <Text style={styles.scopeDesc}>{item.TagNo}, {item.TagDescription}</Text>
                   <Text style={styles.scopeType}>{item.FormularType}</Text>
                   <Icon style={{
                       'paddingRight': moderateScale(15),
                       'alignSelf': 'center'
                   }} name="ios-arrow-forward" color={Colors.GRAY_2} size={(24)} />
               </View>
           </TouchableOpacity>) }
       </ScrollView>;

   }

    cropString = (text, maxChars, postfix) => {

        if (!text || text.length <= maxChars) {

            return text;

        }
        return text.substring(0, maxChars - 1) + postfix;

    }

    renderTasks (tasks) {

        if (!tasks || tasks.length === 0) {

            return <Text style={{
                'fontSize': 24,
                'padding': 10,
                'textAlign': 'center'
            }}>No tasks</Text>;

        }
        return <ScrollView>
            {tasks.map((item) => <TouchableOpacity key={item.Id} onPress={() => {

                // Mock-data. Could probably be moved to api
                this.props.navigation.navigate('TaskRoute');
                this.props.loadTask(item);
                this.props.selectTasksTask();


            }}>
                <View style={styles.scopeResult}>
                    {<View style={styles.scopeStatus}>{renderTaskStatus(item)}</View>}
                    <View style={{'flex': 6}}>
                        <Text style={{...globalStyles.title,
                            'color': Colors.GRAY_2
                        }}>
                            {item.Number}
                        </Text>

                        <Text style={{...globalStyles.title,
                            'paddingRight': 10
                        }}>
                            {this.cropString(item.Title, 100, '...')}
                        </Text>
                    </View>
                    <Icon style={{
                        'paddingRight': moderateScale(15),
                        'alignSelf': 'center'
                    }} name="ios-arrow-forward" color={Colors.GRAY_2} size={(24)} />
                </View>
            </TouchableOpacity>) }
        </ScrollView>;

    }

    renderPunches (scopes) {

        if (!scopes || scopes.length === 0) {

            return <Text style={{
                'fontSize': 24,
                'padding': 10,
                'textAlign': 'center'
            }}>No punches in this package</Text>;

        }
        return (
            <ScrollView>
                { scopes.map((item) => <TouchableOpacity key={item.Id} onPress={() => {

                    this.props.navigation.navigate('PunchRoute');
                    this.props.loadPunch(item);

                }}>
                    <View style={{
                        'borderBottomWidth': 1,
                        'borderBottomColor': Colors.GRAY_3
                    }}>
                        <View style={{
                            'flexDirection': 'row',
                            'flex': 1,
                            'padding': 10
                        }}>
                            <View style={{
                                'flex': 1,
                                'alignSelf': 'center',
                                'paddingLeft': 3
                            }}>{renderPunchStatus(item.Status)}</View>

                            <View style={{'flex': 10}}>
                                <View style={{
                                    'flexDirection': 'row',
                                    'padding': 10,
                                    'paddingLeft': 20
                                }}>
                                    <View style={{
                                        'flexDirection': 'row',
                                        'flex': 8
                                    }}>
                                        <Text style={{
                                            'flex': 6,
                                            ...globalStyles.title
                                        }}>{(item.Cleared ? 'CLEARED: ' : '') + this.cropString(item.Description, 70, '...')}</Text>

                                    </View>
                                </View>
                                <View style={{
                                    'flexDirection': 'row',
                                    'paddingLeft': 20
                                }}>
                                    <Text style={{
                                        'flex': 1,
                                        'color': Colors.GRAY_2
                                    }}>Module</Text>
                                    <Text style={{'flex': 4}}>{item.SystemModule}</Text>
                                </View>
                                <View style={{
                                    'flexDirection': 'row',
                                    'paddingLeft': 20,
                                    'paddingBottom': 5
                                }}>
                                    <Text style={{
                                        'flex': 1,
                                        'color': Colors.GRAY_2
                                    }}>TAG</Text>
                                    <Text style={{'flex': 4}}>
                                        {`${item.TagNo}${item.TagDescription}`}
                                    </Text>
                                </View>
                            </View>
                            <View style={{'flex': 1}}></View>
                            <Icon style={{
                                'fontSize': 24,
                                'alignSelf': 'center',
                                'paddingRight': moderateScale(15)
                            }} name="ios-arrow-forward" color={Colors.GRAY_2} size={(34)} />
                        </View>
                    </View>

                </TouchableOpacity>) }
            </ScrollView>
        );

    }


    render () {

        if (!this.props.pcs || this.props.loadingPcs || !this.props.allBookmarked) {

            return <View style={styles.component}>

                <Text style={{
                    'fontSize': 24,
                    'padding': 10,
                    'textAlign': 'center'
                }}>Loading package...</Text>
                <ActivityIndicator animating />
            </View>;

        }
        return (
            <View style={styles.component}>
                {/* Header */}
                <View style={styles.summary}>

                    <View style={{
                        'paddingLeft': 20,
                        'paddingRight': 20,
                        'paddingBottom': 4
                    }}>
                        <View style={styles.row}>
                            <Text style={styles.title}>{this.props.pcs.Description}</Text>

                            <View style={styles.statusView}>
                                {renderPackageStatus(this.props.pcs, 2)}
                                {/* <Icon name="md-help" color="black" padding={10} size={(24)} />  */}
                            </View>
                            {_.find(this.props.allBookmarked, (item) => item.Id === this.props.pcs.Id)
                                ? <TouchableOpacity onPress={() => this.props.removeBookmark(this.props.pcs)}>
                                    <View style={styles.iconView}>
                                        <Icon name="ios-bookmark" color={Colors.BLUE} padding={10} paddingRight={20} size={moderateScale(25)} />
                                    </View>
                                </TouchableOpacity>
                                : <TouchableOpacity onPress={() => this.props.addBookmark(this.props.pcs)}>
                                    <View style={styles.iconView}>
                                        <Icon name="ios-bookmark" color={Colors.BLUE_LIGHT} padding={10} paddingRight={20} size={moderateScale(25)} />
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.detailHeader}>COM PKG</Text>
                        <Text style={styles.detail}>{this.props.pcs.CommPkgNo}</Text>
                        <Text style={styles.detailHeader}>  MC status</Text>
                        <Text style={styles.detail}>{this.props.pcs.McStatus}</Text>
                    </View>

                    {
                        // Not available yet   <View style={styles.row}>
                        //     <Text style={styles.detailHeader}>{/*RFCC*/}</Text>
                        //     <Text style={styles.detail}>{/*{{this.props.pcs.RfccComplete}/{this.props.pcs.RfccTotal} accepted*/}</Text>
                        //     <Text style={styles.detailHeader}> {/* RFOC*/}</Text>
                        //     <Text style={styles.detail}>{/*{{this.props.pcs.RfocComplete}/{this.props.pcs.RfocTotal} accepted*/}</Text>
                        //     </View>
                    }
                </View>

                <View style={styles.component}>
                    <Container style={{'marginBottom': 100}}>
                        {this.props.punchesSelected ? this.renderPunches(this.props.pcs.punches) : null}
                        {this.props.scopesSelected ? this.renderScopes(this.props.pcs.scopes) : null}
                        {this.props.tasksSelected ? this.renderTasks(this.props.pcs.tasks) : null}

                    </Container>
                </View>

                {/* Footer */}
                <View style={{
                    'position': 'absolute',
                    'left': 0,
                    'height': 100,
                    'right': 0,
                    'flexDirection': 'row',
                    'flex': 1,
                    'bottom': 0,
                    'borderTopColor': Colors.GRAY_1,
                    'borderTopWidth': 1,
                    'padding': 10
                }}>
                    <View style={{'flex': 1}}>
                        <SelectableButton title="Scope" onPress={() => this.props.selectScopes()}
                            isSelected = {this.props.scopesSelected} iconBlack={scopeIconBlack} iconBlue={scopeIconBlue}
                            count={this.props.pcs.scopes.length}/>
                    </View>

                    <View style={{'flex': 1}}>
                        <SelectableButton title="Tasks" onPress={() => this.props.selectTasks()}
                            isSelected = {this.props.tasksSelected} iconBlack={tasksIconBlack} iconBlue={tasksIconBlue}
                            count={this.props.pcs.tasks.length}/>
                    </View>

                    <View style={{'flex': 1}}>
                        <SelectableButton title="Punch list" onPress={() => this.props.selectPunches()}
                            isSelected = {this.props.punchesSelected} iconImage={renderPunchStatus(highestStatus(this.props.pcs.punches), this.props.punchesSelected)}
                            count={this.props.pcs.punches.length}/>

                    </View>


                </View>
            </View>);

    }

}
const mapStateToProps = (state) => ({
    'loadingPcs': appReducer.loadingPcs(state),
    'pcs': appReducer.pcs(state),
    'loadingPcsFailed': appReducer.loadingPcsFailed(state),
    'tasksSelected': reducer.tasksSelected(state),
    'punchesSelected': reducer.punchesSelected(state),
    'scopesSelected': reducer.scopesSelected(state),
    'allBookmarked': appReducer.allBookmarked(state)

});

const mapDispatchToProps = (dispatch) => ({
    'selectTasks': () => dispatch(actions.tasksSelected()),
    'selectPunches': () => dispatch(actions.punchesSelected()),
    'selectScopes': () => dispatch(actions.scopesSelected()),
    'addBookmark': (pcs) => dispatch(actions.addBookmark(pcs)),
    'removeBookmark': (pcs) => dispatch(actions.removeBookmark(pcs)),
    'requestAllBookmarks': () => dispatch(actions.allBookmarkedRequested()),
    'selectTasksTask': () => dispatch(actions.taskTaskSelected()),
    'loadScope': (scope) => dispatch(actions.scopeRequest(scope)),
    'loadPunch': (punch) => dispatch(actions.punchRequest(punch)),
    'loadTask': (task) => dispatch(actions.taskRequest(task))


});

export default connect(mapStateToProps, mapDispatchToProps)(DefaultPage);
