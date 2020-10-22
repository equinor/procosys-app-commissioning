import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import * as appReducer from '../../reducers/appData';
import * as reducer from '../../reducers/taskItemPage';
import * as Colors from '../../stylesheets/colors';
import { moderateScale } from '../../utils/scaling';
import { renderTaskStatus } from '../molecules/StatusRender';
import { ShowImageIfReady, RequestImage, CreatePicInfo, renderPictureIcon, isPicture, getPictureData } from '../molecules/Attachments';
import Button from '../atoms/Button';
import { globalStyles } from '../../settings';
import update from 'immutability-helper';
import Moment from 'moment';
import tasksIconBlue from '../../../resources/images/tasks_selected.png';
import tasksIconBlack from '../../../resources/images/tasks_notselected.png';
import SelectableButton from '../molecules/SelectableButton';
import HTML from 'react-native-render-html';
import CNRichTextEditor, { CNToolbar, getInitialObject, convertToObject, getDefaultStyles, convertToHtmlString } from "react-native-cn-richtext-editor";
import parameterIconBlue from '../../../resources/images/parameter_selected.png';
import parameterIconBlack from '../../../resources/images/parameter_notselected.png';

import attachmentIconBlue from '../../../resources/images/attachment_selected.png';
import attachmentIconBlack from '../../../resources/images/attachment_notselected.png';

import DeviceInfo from 'react-native-device-info';

import {
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import { TouchableOpacity, Text, TextInput, Image, RowContainer, ScrollView } from '../atoms/StandardComponents';

const isTablet = DeviceInfo.isTablet();
const defaultStyles = getDefaultStyles();

const styles = StyleSheet.create({
  'component': {
    'flex': 1,
    'backgroundColor': 'white'

  },
  'row': { 'flexDirection': 'row' },
  'header': {
    'backgroundColor': Colors.GRAY_4,
    'padding': 15,
    'borderBottomColor': Colors.GRAY_3,
    'borderBottomWidth': 1
  },
  'item': {
    'borderBottomWidth': 1,
    'padding': 10,
    'borderColor': Colors.GRAY_3
  },
  'itemDesc': {},
  'capture': {
    'flex': 0,
    'backgroundColor': '#fff',
    'borderRadius': 5,
    'color': '#000',
    'padding': 10,
    'margin': 40
  },
  'preview': {
    'flex': 1,
    'justifyContent': 'flex-end',
    'alignItems': 'center'
  },
  'scopeStatus': {
    'flex': 1,
    'justifyContent': 'center',
    'alignItems': 'center'
  },
  'headerLabel': {
    'flex': 1,
    ...globalStyles.title,
    'color': Colors.GRAY_2
  },
  'headerText': {
    'flex': 9,
    ...globalStyles.title,
    'color': Colors.GRAY_2
  },
  'buttonStyle': {
    'backgroundColor': Colors.BLUE,
    'width': moderateScale(120),
    'height': moderateScale(30),
    'alignSelf': 'flex-end',
    'borderRadius': 6
  },
  'secButtonStyle': {
    'backgroundColor': Colors.BLUE_LIGHT_BACKGROUND,
    'width': moderateScale(120),
    'height': moderateScale(30),
    'borderRadius': 6,
    'marginBottom': 10,
    'alignSelf': 'flex-end'
    //  'paddingBottom': 20,

  },
  'secButtonTextStyle': { 'color': Colors.BLUE },
  'cameraButton': {
    'backgroundColor': Colors.BLUE,
    'width': moderateScale(60),
    'height': moderateScale(40),
    'justifyContent': 'center',
    'alignItems': 'center'


  },
  'main': {
    flex: 1,
    marginTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 1,
    alignItems: 'stretch',
  },
  'toolbarButton': {
    fontSize: 20,
    width: 28,
    height: 28,
    textAlign: 'center'
  },
  'italicButton': {
    fontStyle: 'italic'
  },
  'boldButton': {
    fontWeight: 'bold'
  },
  'underlineButton': {
    textDecorationLine: 'underline'
  },
  'lineThroughButton': {
    textDecorationLine: 'line-through'
  },

});

const counter = (count, selected, radius) => {

  radius = radius || 40;
  const half = radius / 2;
  let width = radius;
  if (count > 9) {

    width *= 1.5;

  }
  const color = Colors.RED;

  const inside = {
    'borderRadius': half,
    // Position: 'absolute',
    'top': 0,
    'left': 0,
    width,
    'height': radius,
    'alignItems': 'center',
    'justifyContent': 'center',
    'backgroundColor': color
  };
  return (
    <View style={inside}><Text style={{
      'color': 'white',
      'backgroundColor': 'transparent'
    }}>{count}</Text></View>
  );

};

class TaskItem extends Component {

  constructor(props) {

    super(props);

    this.state = {
      expanded: false,
      //  Punch:props.task,
      takeSnap: false,
      showHtml: false,
    };

    this.richtextComment = null;
  }

  static propTypes = { 'navigation': PropTypes.object.isRequired }

  UNSAFE_componentWillUpdate(nextProps) {

    if (!this.state.task && nextProps.task) {

      this.state.task = nextProps.task;

    }

    if (!this.state.task && nextProps.task || this.state.task && nextProps.task && this.state.task.localId !== nextProps.task.localId) {

      const state = update(
        this.state,
        {
          'task': { '$set': nextProps.task }
        }
      );
      this.state = state;
      this.setState(state);

      // Nested stuff needs to be forced to update
      this.forceUpdate();

    }

    if (this.state.task) {

      if (nextProps.attachment && this.state.task.thumbnails && this.state.task.thumbnails.length > nextProps.attachment.index
        && this.state.task.thumbnails[nextProps.attachment.index]
        && this.state.task.thumbnails[nextProps.attachment.index].isLoading) {

        const state = update(
          this.state,
          {
            'task': { 'thumbnails': { [nextProps.attachment.index]: { 'isLoading': { '$set': false } } } }
          }
        );
        this.setState(state);

      }

      ShowImageIfReady(this.state, this.props, nextProps, this.setState.bind(this));


    }

  }

  static navigationOptions = ({ navigation }) => ({
    'title': 'Task', 'titleStyle': {
      'fontFamily': globalStyles.fontFamily
    }
  });

  renderHeader(task) {

    return (
      <View style={styles.header}>
        <View style={{ 'flexDirection': 'row' }}>
          <View style={{ 'flex': 1 }}>{renderTaskStatus(task)}</View>
          <Text style={styles.headerText}>{task.Title}</Text>
        </View>

      </View>
    );

  }

  onValueChanged = (value) => {
    this.setState({
        value: value
    });
  }

  canEditAndSign() {

    return !this.state.task.SignedAt && this.props.permissions.canUpdateAndSignTask;

  }

  scope = this.props.task;
  contentStyle = { 'fontSize': moderateScale(12) };

  renderAttachments = () => this.state.task.thumbnails.length === 0 ? <Text style={{
    'fontSize': 24,
    'padding': 10,
    'textAlign': 'center'
  }}>No attachments</Text> : <View style={{
    'paddingLeft': isTablet ? 40 : 10,
    'paddingTop': 10,
    'paddingBottom': 10
  }}>
      {this.state.task.thumbnails.map((item, itemIndex) =>
        <RowContainer key={item.Id} style={{
          'borderColor': Colors.GRAY_3,
          'borderBottomWidth': 1,
          'flex': 1
        }}>
          {!item.isLoading ? <TouchableOpacity style={{ flex: null }} onPress={() => {
            let info = CreatePicInfo(item, this.state.task.Id, itemIndex, 'task');
            RequestImage(this.state, this.props, info, this.setState.bind(this), 'task');
          }}>
            <RowContainer style={{
              'alignItems': 'center',
              'paddingTop': 10,
              'paddingBottom': 10
            }} >

              {renderPictureIcon(getPictureData(item), isPicture(item), item.Title || item.Uri)}
              <Text style={{
                'fontSize': isTablet ? moderateScale(13) : moderateScale(12),
                'color': Colors.BLUE,
                'paddingLeft': isTablet ? 30 : 10,
                'width': isTablet ? moderateScale(350) : moderateScale(200)
              }}>{item.Title || item.Uri}</Text>

            </RowContainer>
          </TouchableOpacity>
            : <RowContainer style={{
              'alignItems': 'center',
              'paddingTop': 10,
              'paddingBottom': 10
            }} >
              {renderPictureIcon(getPictureData(item), isPicture(item), item.Title || item.Uri)}
              <Text style={{
                'fontSize': isTablet ? moderateScale(13) : moderateScale(12),
                'color': Colors.BLUE,
                'paddingLeft': isTablet ? 30 : 10
              }}>{item.Title || item.Uri}</Text>
              <ActivityIndicator style={{ 'paddingLeft': 20 }} animating />
            </RowContainer>}

          <View style={{
            'flex': 1,
            'justifyContent': 'center',
            'paddingRight': isTablet ? 20 : 15,
            'width': 250
          }}>
            <Text style={{ 'alignSelf': 'flex-end' }}>{item.Classification}</Text>
            <Text style={{
              'alignSelf': 'flex-end',
              'color': Colors.GRAY_2
            }}>{Moment(item.CreatedAt).format('DD MMM YYYY')}</Text>
          </View>

        </RowContainer>)
      }
    </View>

  renderParameters = () =>
    this.state.task.parameters.length === 0 ? <Text style={{
      'fontSize': 24,
      'padding': 10,
      'textAlign': 'center'
    }}>No parameters</Text> : <View>
        <View style={styles.row}>
          <Text style={{ 'flex': isTablet ? 30 : 40 }}></Text>
          <View style={{
            'flex': 40,
            'padding': 10
          }}>
            <View style={styles.row}>

              <Text style={{
                'flex': 1,
                'color': Colors.GRAY_2,
                'textAlign': 'center'
              }}>Reference</Text>
              <Text style={{
                'flex': 1,
                'color': Colors.GRAY_2,
                'textAlign': 'center',
                'paddingRight': 30,
                'paddingLeft': isTablet ? 0 : 10
              }}>Measured</Text>
            </View>
          </View>
        </View>
        {this.state.task.parameters.map((item, itemIndex) =>
          <RowContainer key={item.Id} style={{
            'justifyContent': 'center',
            'alignItems': 'center',
            'borderColor': Colors.GRAY_2,
            'borderTopWidth': 1,
            'paddingTop': 20,
            'paddingBottom': 20

          }}>
            <Text style={{
              'flex': 2,
              'marginLeft': isTablet ? 16 : 5,
              'paddingRight': isTablet ? 24 : 16,
              'width': moderateScale(100)
            }}>{item.Description}</Text>

            <Text style={{
              'flex': 1,
              'marginLeft': isTablet ? 36 : 16,
              'paddingRight': isTablet ? 24 : 10,

              'width': moderateScale(100)
            }}>{item.ReferenceValue ? `${item.ReferenceValue} ${item.ReferenceUnit}` : ''}</Text>

            <View style={{
              'flex': 1,
              'justifyContent': 'flex-end',
              'alignSelf': 'flex-end',
              'flexDirection': 'row',
              'marginLeft': 0

            }}>
              {!this.canEditAndSign()
                ? <Text style={{
                  'borderWidth': 1,
                  'borderColor': Colors.GRAY_3,
                  'color': Colors.GRAY_2,
                  'width': isTablet ? moderateScale(70) : moderateScale(70),
                  'height': 40

                }}>{item.MeasuredValue}</Text>
                : <TextInput value={item.MeasuredValue} maxLength={255} style={{

                  'borderWidth': 1,
                  'width': isTablet ? moderateScale(70) : moderateScale(70),
                  'height': 40,
                  textAlignVertical: 'center', //android only


                }}
                  onChangeText={(text) => {

                    //        Cell.Value = text;
                    const state = update(
                      this.state, // Blabla
                      { 'task': { 'parameters': { [itemIndex]: { 'MeasuredValue': { '$set': text } } } } }
                    );
                    this.setState(state);

                  }}
                  onPauseText={(text) => {

                    //item.MeasuredValue = text;
                    item.MeasuredValue = this.state.task.parameters[itemIndex].MeasuredValue;
                    this.props.changeParameter(item);

                    //    This.props.changeItem({'info': this.getInfo('metaTableChanged', checkListItemIndex, rowIndex, cellIndex, text)});

                  }}
                ></TextInput>}

              <Text style={{
                'width': isTablet ? moderateScale(40) : moderateScale(20),
                'paddingLeft': 5,
                'paddingTop': 6,
                'height': 40,
                textAlignVertical: 'center'


              }}>{item.ReferenceUnit}</Text>
            </View>

          </RowContainer>)}

      </View>


  renderTaskPage = () => {

    return <View><View style={{ 'paddingTop': 10 }}>
      <View style={styles.row}>
        <Text style={{
          'flex': 20,
          'paddingTop': isTablet ? 20 : 13, 'paddingRight': 5
        }}>Description</Text>
        <View style={{ 'flex': 80 }}>

          <HTML emSize={18} baseFontStyle={this.contentStyle} html={`<div>${this.state.task.DescriptionAsHtml}</div>`} />
        </View>
      </View>
    </View>
      <View style={{ 'paddingTop': 20 }}>
        <View style={styles.row}>

          <View style={{
            'flexDirection': 'row',
            'flex': 20,
            'paddingTop': isTablet ? 30 : 23,
            'paddingRight': 5
          }}>
            <Text>Comments</Text>

          </View>

          <View style={{ 'flex': 80 }} ref={(r) => this.htmlContainer = r}>
            {!this.canEditAndSign() || !this.state.editComment ? <View style={{
              'height': !this.canEditAndSign() || !this.state.editComment ? null : 0,
              'paddingTop': 10
            }}>
              <HTML baseFontStyle={this.contentStyle} html={`<div>${this.state.task.CommentAsHtml}</div>`} />
            </View>
              : <View style={{
                'opacity': !this.state.showHtml ? 1 : 0, 'borderWidth': 1,
                'borderColor': Colors.GRAY_3,
              }}>
                <TextInput multiline={true} value={this.state.task.CommentAsHtml} 
                  onChangeText={(text) => {

                    const state = update(
                      this.state,
                      { 'task': { 'CommentAsHtml': {'$set': text} }}
                    );
                    this.setState(state);
                  }}
                />
              </View>}</View>
        </View>

        <View style={styles.row}>
          <View style={{ 'flex': 20 }}></View>
          <View style={{
            'flex': 50,
            'paddingTop': 30,
            'paddingLeft': isTablet ? 15 : 10
          }}>

            <Text style={{ 'color': Colors.GRAY_2, maxWidth: isTablet ? moderateScale(300) : moderateScale(130) }}>Updated - {Moment(this.state.task.UpdatedAt).format('DD MMM YYYY')} by {this.state.task.UpdatedByFirstName} {this.state.task.UpdatedByLastName} ({this.state.task.UpdatedByUser})</Text>
            {this.state.task.SignedAt ? <Text style={{
              'color': Colors.GRAY_2,
              'paddingTop': 15,
              maxWidth: isTablet ? moderateScale(300) : moderateScale(130)
            }}>Signed - {Moment(this.state.task.SignedAt).format('DD MMM YYYY')} by{"\n"}{this.state.task.SignedByFirstName} {this.state.task.SignedByLastName}({this.state.task.SignedByUser})</Text> : null}
          </View>
          <View style={{ 'flex': 35, 'paddingTop': 30 }}>
            {!this.state.task.SignedAt && ((this.state.editComment) || !this.state.editComment) ? 
              <Button disabled={!this.canEditAndSign()}
                      viewStyle={styles.secButtonStyle}
                      textStyle={styles.secButtonTextStyle}
                      title={this.state.editComment ? 'Save comment' : 'Edit comment'}
                      onPress={() => { this.adjustState(); }} />
            :
              !this.canEditAndSign() ?
                null
              : 
                <ActivityIndicator style={{ 'paddingLeft': 20, 'alignSelf': 'flex-start' }} animating />
            }

            {this.renderSignUnsignButton()}
            <Text style={{ 'color': Colors.RED }}>{this.state.signUnsignError}</Text>
          </View>
        </View>


      </View></View>;

  }

  renderSignUnsignButton() {
    if (!this.state.editComment) {
      return (
        <Button
          title={this.state.task.SignedAt ? 'Unsign' : 'Sign'}
          onPress={() => { this.signUnsign(); }}
          disabled={!this.props.permissions.canUpdateAndSignTask/* !hasConnectivity*/}
          viewStyle={styles.buttonStyle} />)
    }
    return null;
  }

  signUnsign() {
    if (this.state.task.SignedAt) {

      this.props.unsignTask(this.state.task);
      const state = update(
        this.state,
        { 'task': { 'changing': { '$set': true } } }
      );
      this.setState(state);


    } else {

      this.props.signTask(this.state.task);
      const state = update(
        this.state,
        { 'task': { 'changing': { '$set': true } } }
      );
      this.setState(state);

    }
  }

  adjustState() {
    if (this.state.editComment) {
      const state = update(
        this.state,
        {
          'editComment': { '$set': false },
        }
      );
      this.setState(state);
      this.props.updateComment(this.state.task);
    } else {
      const state = update(
        this.state,
        {
          'editComment': { '$set': true },
          'showHtml': { '$set': false },
        });
      this.setState(state);
    }
  }

  render() {

    if (!this.state.task) {

      return <View>
        <Text style={{
          'fontSize': 24,
          'padding': 10,

          'textAlign': 'center'
        }}>Loading task...</Text>
        <ActivityIndicator animating />
      </View>;

    }


    return (

      this.state.task
        ? <View style={styles.component}>

          <ScrollView>
            {this.renderHeader(this.state.task)}
            <View style={{
              'borderBottomColor': Colors.GRAY_3,
              'marginBottom': 800,
              'paddingBottom': 40
            }}>
              {this.props.attachmentsSelected ? this.renderAttachments() : null}

              <View style={{
                'paddingLeft': isTablet ? 40 : 10,
                'paddingRight': isTablet ? 30 : 10
              }}>
                {this.props.taskSelected ? this.renderTaskPage() : null}
                {this.props.parametersSelected ? this.renderParameters() : null}


              </View>
            </View>

          </ScrollView>
          {/* Footer */}
          <View style={{
            'position': 'absolute',
            'left': 0,
            'right': 0,
            'flexDirection': 'row',
            'flex': 1,
            'bottom': 0,
            'backgroundColor': 'white',
            'borderTopColor': Colors.GRAY_1,
            'borderTopWidth': 1,
            'padding': 10
          }}>
            <View style={{
              'flex': 1,
            }}>
              <SelectableButton title='Task' onPress={() => this.props.selectTasksTask()}
                isSelected={this.props.taskSelected} iconBlack={tasksIconBlack} iconBlue={tasksIconBlue}
              />
            </View>

            <View style={{ 'flex': 1 }}>
              <SelectableButton title='Parameters' onPress={() => this.props.selectTasksParameters()}
                isSelected={this.props.parametersSelected} iconBlack={parameterIconBlack} iconBlue={parameterIconBlue}
                count={this.state.task.parameters.length} />
            </View>


            <View style={{ 'flex': 1 }}>
              <SelectableButton title='Attachments' onPress={() => this.props.selectTasksAttachments()}
                isSelected={this.props.attachmentsSelected} iconBlack={attachmentIconBlack} iconBlue={attachmentIconBlue}
                count={this.state.task.thumbnails.length} />
            </View>


          </View>
        </View> : <View />);

  }


}
const mapStateToProps = (state) => ({
  'task': appReducer.task(state),

  'attachmentsSelected': reducer.attachmentsSelected(state),
  'taskSelected': reducer.taskSelected(state),
  'parametersSelected': reducer.parametersSelected(state),
  'attachment': reducer.attachment(state),
  'fileRequested': reducer.fileRequested(state),
  'permissions': appReducer.getPermissions(state)

});

const mapDispatchToProps = (dispatch) => ({
  'updateComment': (task) => dispatch(actions.taskCommentRequest(task)),
  'signTask': (task) => dispatch(actions.taskSignRequest(task)),
  'unsignTask': (task) => dispatch(actions.taskUnsignRequest(task)),
  'changeParameter': (parameter) => dispatch(actions.taskParameterRequest(parameter)),
  'requestAttachment': (item) => dispatch(actions.taskAttachmentRequest(item)),

  'selectTasksParameters': () => dispatch(actions.taskParametersSelected()),
  'selectTasksAttachments': () => dispatch(actions.taskAttachmentsSelected()),
  'selectTasksTask': () => dispatch(actions.taskTaskSelected())
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskItem);
