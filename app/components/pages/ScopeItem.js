import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as actions from '../../actions';
import {connect} from 'react-redux';
import * as appReducer from '../../reducers/appData';
import * as reducer from '../../reducers/scopeItemPage';
import * as Colors from '../../stylesheets/colors';
import { moderateScale } from '../../utils/scaling';
import Attachments, {takePicture, CameraButton, ShowImageIfReady, RequestImage} from '../molecules/Attachments';
import Moment from 'moment';
import _ from 'lodash';
import renderScopeStatus from '../molecules/StatusRender';
import Button from '../atoms/Button';
import {globalStyles} from '../../settings';
import update from 'immutability-helper';
import DeviceInfo from 'react-native-device-info';

import {
  View,
  StyleSheet,
  ActivityIndicator, FlatList, NativeEventEmitter, NativeModules
} from 'react-native';

import {TouchableOpacity, Text, TextInput, Container, RowContainer, ScrollView} from '../atoms/StandardComponents';

import Icon from 'react-native-vector-icons/Ionicons';
const isTablet = DeviceInfo.isTablet();
const styles = StyleSheet.create({
  'component': {
    'flex': 1,
    'backgroundColor': 'white'

  },
  'row': {'flexDirection': 'row'},
  'header': {
    'flexDirection': 'row',
    'backgroundColor': Colors.GRAY_4,

    'padding': 15,
    'borderBottomColor': Colors.GRAY_3,
    'borderBottomWidth': 1
  },
  'item': {

    'borderBottomWidth': 1,
    'paddingBottom': 10,
    'paddingTop': 10,
    'borderColor': Colors.GRAY_3

  },
  'itemDesc': {'marginLeft': 10},
  'capture': {
    'flex': 0,
    'backgroundColor': 'transparent',
    'borderRadius': 5,

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
  'scopeDesc': {
    'flex': 5,
    ...globalStyles.title,
    'color': Colors.GRAY_1
  },
  'scopeType': {
    'flex': 2,
    ...globalStyles.title,
    'color': Colors.GRAY_1
  },
  'buttonStyle': {
    'backgroundColor': Colors.BLUE,
    'width': moderateScale(90),
    'height': 40,
    'borderRadius': 6
  },
  'cameraButton': {
    'backgroundColor': Colors.BLUE,
    'width': moderateScale(60),
    'height': moderateScale(40),
    'marginTop': moderateScale(10),
    'borderRadius': 6,
    'justifyContent': 'center',
    'alignItems': 'center'

  }

});

class ScopeItem extends Component {

  constructor (props) {

    super(props);

    this.state = {
      'expanded': false,
      'scope': props.scope,
      'takeSnap': false,
      'mock': false
    };


  }

  goToNewPunch () {

    this.props.navigation.navigate('PunchRoute', {'title': 'New punch'});
    this.props.setNewPunch({
      'Id': this.state.scope.CheckList.Id,
      'SystemModule': this.state.scope.CheckList.SystemModule,
      'TagNo': this.state.scope.CheckList.TagNo,
      'TagDescription': this.state.scope.CheckList.TagDescription
    });

  }

  componentDidMount () {

    this.props.navigation.setParams({'newPunch': () => this.goToNewPunch(), canCreatePunchItem: this.props.permissions.canCreatePunchItem});

  }

  static navigationOptions = ({navigation}) => {

    const {params = {}} = navigation.state;
    return {
      'title': 'Scope',
      'titleStyle': {'fontFamily': globalStyles.fontFamily},

      'headerRight':
         params.canCreatePunchItem ? <Button viewStyle={{...styles.buttonStyle, height: 'auto'}} title = "New punch" onPress ={ () => {

           params.newPunch && params.newPunch();

         }}/> : null

    };

  }

  UNSAFE_componentWillUpdate (nextProps) {

    if (nextProps.data !== this.props.data) {
      // Do whatever you want
    }
    if (!this.state.scope && nextProps.scope || this.state.scope && nextProps.scope && this.state.scope.localId !== nextProps.scope.localId) {

      const state = update(
        this.state,
        {
          'thumbnails': {'$set': null},
          'scope': {'$set': nextProps.scope},
          'item': {'$set': null},
          'itemChangedFailed': {'$set': null},
          'listChanged': {'$set': null},
          'listChangedFailed': {'$set': null}
        // ShowFile:{$set:true}
        }
      );
      this.state = state;
      this.setState(state);

      // Nested stuff needs to be forced to update
      this.forceUpdate();

    }

    if (this.state.scope) {

      if (nextProps.itemChanged) {

        if (!this.state.item || this.state.item.hash !== nextProps.itemChanged.hash) {

          this.state.item = nextProps.itemChanged;
          this.updateCheckItem(this.state.item);

        }

      }

      if (nextProps.itemChangedFailed) {

        if (!this.state.itemChangedFailed || this.state.itemChangedFailed.hash !== nextProps.itemChangedFailed.hash) {

          this.state.itemChangedFailed = nextProps.itemChangedFailed;
          this.updateCheckItemFailed(this.state.itemChangedFailed);

        }

      }

      if (nextProps.listChanged) {

        if (!this.state.listChanged || this.state.listChanged.hash !== nextProps.listChanged.hash) {

          this.state.listChanged = nextProps.listChanged;
          this.updateChecklist(this.state.listChanged);

        }

      }

      if (nextProps.listChangedFailed) {

        if (!this.state.listChangedFailed || this.state.listChangedFailed.hash !== nextProps.listChangedFailed.hash) {

          this.state.listChangedFailed = nextProps.listChangedFailed;
          this.updateChecklistFailed(this.state.listChangedFailed);

        }

      }

      if (!this.props.thumbnails && !this.props.thumbnailsRequested && !nextProps.thumbnailsRequested || this.state.thumbnails && !nextProps.thumbnails) {

        this.props.requestAttachments({
          'type': 'scope',
          'id': this.state.scope.CheckList.Id
        });

      } else if ((!this.props.thumbnails || !this.state.thumbnails) && nextProps.thumbnails) {

        this.state.thumbnails = nextProps.thumbnails;

      }
      if (!this.props.refreshThumbnails && nextProps.refreshThumbnails) {

        this.props.requestAttachments({
          'type': 'scope',
          'id': this.state.scope.CheckList.Id
        });

      }

      if (nextProps.attachment && this.state.thumbnails && this.state.thumbnails.length > nextProps.attachment.index && this.state.thumbnails[nextProps.attachment.index] && this.state.thumbnails[nextProps.attachment.index].isLoading) {

        const state = update(
          this.state,
          {
            'thumbnails': {[nextProps.attachment.index]: {'isLoading': {'$set': false}}}
            // ShowFile:{$set:true}
          }
        );
        this.setState(state);

      }

      ShowImageIfReady(this.state, this.props, nextProps, this.setState.bind(this));

    }

  }


    static propTypes = {'navigation': PropTypes.object.isRequired}

    updateCheckItem (payload) {

      const field = payload.checkListItem;
      const info = payload.info;

      const index = _.findIndex(this.state.scope.CheckItems, (item) => item.Id === info.checkListItemId);

      if (info.type === 'checkedChange') {

        const state = update(
          this.state,
          {
            'scope': {
              'CheckItems': {
                [index]: {
                  'IsOk': {'$set': field.IsOk},
                  'IsNotApplicable': {'$set': field.IsNotApplicable},
                  'changing': {'$set': false}
                }
              }
            }
          }
        );
        this.setState(state);

      } else if (info.type === 'metaTableChanged') {


      }

    }

    isReadOnly() {
      return this.state.scope.CheckList.SignedAt || !this.props.permissions.canEditChecklistItem;
    }

    canAttach() {
      return !this.state.scope.CheckList.SignedAt && this.props.permissions.canAttachChecklistItem;

    }



    updateCheckItemFailed (field) {

      const index = _.findIndex(this.state.scope.CheckItems, (item) => item.Id === field.info.checkListItemId);

      if (index < 0) {

        return;

      }

      const state = update(
        this.state,
        {'scope': {'CheckItems': {[index]: {'changing': {'$set': false}}}}}
      );
      this.setState(state);

    }

    updateChecklist (field) {

      field.changing = false;
      const state = update(
        this.state,
        {
          'scope': {'CheckList': {'$set': field}},
          'signUnsignError': {'$set': null}
        }
      );

      this.setState(state);

    }

    updateChecklistFailed (field) {

      this.state.scope.CheckList.changing = false;
      const state = update(
        this.state,
        {
          'scope': {'CheckList': {'changing': {'$set': false}}},
          'signUnsignError': {'$set': field.signUnsignFailure}
        }
      );
      this.setState(state);

    }


    renderHeader (scope) {

      return (
        <View style={styles.header}>
          {<View style={styles.scopeStatus}>{renderScopeStatus(scope.CheckList.Status)}</View>}

          <Text style={styles.scopeDesc}>{scope.CheckList.TagNo}, {scope.CheckList.TagDescription}</Text>
          <Text style={styles.scopeType}>{scope.CheckList.FormularType}</Text>
        </View>
      );

    }

    renderSingleTableHeader (header, cellIndex) {

      return <RowContainer style={{
        'width': moderateScale(100 + 220),
        'paddingLeft': 26 + (cellIndex === 0 ? moderateScale(36) + 30 : 0)
      }}>
        <Text style={{'flex': 1}}>{header.Label}</Text>

      </RowContainer>;

    }


    renderMetaTableHeaderFromIndex (headers, index, rowIndex) {

      return !headers || headers.length < 1 || headers.length < index
        ? null
        : <RowContainer key={headers[index].Id} style={{}}><RowContainer style={{}}/>
          {this.renderSingleTableHeader(headers[index], index)}
        </RowContainer>;

    }

    renderMetaTableHeader (header) {

      return !header || header.length < 1
        ? null
        : <RowContainer style={{
          'paddingLeft': 10,
          'paddingRight': 10
        }}><RowContainer style={{
            'flex': 30,
            'marginLeft': 16
          }}/>
          {header.map((i) => this.renderSingleTableHeader(i))}
        </RowContainer>;

    }

    getInfo (type, checkListItemIndex, metaRowIndex, metaColumnIndex) {

      const res = {
        'checkListId': this.state.scope.CheckList.Id,
        type
      };
      if (checkListItemIndex !== undefined) {

        const item = this.state.scope.CheckItems[checkListItemIndex];
        res.checkListItemId = item.Id;

        if (metaRowIndex !== undefined && item.MetaTable) {

          const metaRow = item.MetaTable.Rows[metaRowIndex];
          res.metaRowId = metaRow.Id;

          if (metaColumnIndex !== undefined) {

            const metaColumn = metaRow.Cells[metaColumnIndex];
            res.metaColumnId = metaColumn.ColumnId;
            res.metaValue = metaColumn.Value;

          }

        }

      }
      return res;

    }

    renderSingleMetaTableRowCell (meta, cellIndex, rowIndex, headers, checkListItemIndex) {

      if (meta.Rows.length <= rowIndex) {

        return null;

      }
      const row = meta.Rows[rowIndex];

      if (row.Cells.length <= cellIndex) {

        return null;

      }
      const cell = row.Cells[cellIndex];
      // TODO: boundaty check aboive

      return <View key={`${checkListItemIndex}_${rowIndex}_${cellIndex}`} style={{
        'flex': 1,
        'flexDirection': 'column'
      }}>
        {rowIndex === 0 ? this.renderMetaTableHeaderFromIndex(headers, cellIndex, rowIndex) : null}

        <RowContainer style={{
          'justifyContent': 'center',
          'alignItems': 'center'
        }}>

          {cellIndex === 0

            ? <Text style={{
              'flex': 1,
              'width': isTablet ? moderateScale(100) : moderateScale(60),
              'marginLeft': isTablet ? 16 : 5,
              'paddingRight': isTablet ? 24 : 5,
            }}>{meta.Rows[rowIndex].Label}</Text> : null}
          {this.isReadOnly()
            ? <Text style={{
              // 'flex': 80,
              'height': 40,
              'marginLeft': 0,
              'marginTop': 5,
              'marginBottom': 4,
              'paddingTop': 10,
              'paddingLeft': 11,
              'borderWidth': 1,
              'borderColor': Colors.GRAY_3,
              'color': Colors.GRAY_2,
              'width': isTablet ?  moderateScale(220) : moderateScale(150)
            }}>{cell.Value}</Text>
            : <TextInput value={cell.Value} style={{
              // 'flex': 80,
              'height': 40,
              'marginLeft': 0,
              'marginTop': 5,
              'marginBottom': 5,
              'padding': 5,
              'borderWidth': 1,

              textAlignVertical: 'center', //android only
              'width': isTablet ?  moderateScale(220) : moderateScale(150)
            }}
            onChangeText={(text) => {

              //        Cell.Value = text;
              const state = update(
                this.state, // update just this value
                {
                  'scope': {
                    'CheckItems': {
                      [checkListItemIndex]: {
                        'MetaTable': {
                          'Rows': {
                            [rowIndex]: {
                              'Cells': {
                                [cellIndex]: {
                                  'Value': {'$set': text},
                                  'test': {'$set': 'test'}
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              );
              this.setState(state);

            }}
            onPauseText={(text) => {

              this.props.changeItem({'info': this.getInfo('metaTableChanged', checkListItemIndex, rowIndex, cellIndex, text)});

            }}
            ></TextInput>}
          <Text style={{
            // 'flex': 20,
            'marginLeft': isTablet ? 10 : 10,
            'width': moderateScale(60)
          }}>{cell.Unit}</Text>
        </RowContainer>
      </View>;

    }

    renderMetaTableColumn (meta, index, headers, checkItemIndex) {

      const cells = [];
      for (let i = 0; i < meta.Rows.length; i++) {

        const row = meta.Rows[i];
        cells.push(this.renderSingleMetaTableRowCell(meta, index, i, headers, checkItemIndex));

      }

      return <Container>
        {cells}
      </Container>;


    }

    maxCells (meta) {

      let cells = 0;
      for (let i = 0; i < meta.Rows.length; i++) {

        const rowCells = meta.Rows[i].Cells;
        if (rowCells.length > cells) {

          cells = rowCells.length;

        }

      }
      const data = [];


      for (var i = 0; i < cells; i++) {

        data.push({});

      }

      return data;

    }

    renderMetaTable (meta, checkItemIndex) {

      if (this.state.mock) {

        meta.Rows = [
          {
            'Id': 1,
            'Label': 'Row 1',
            'Cells': [
              {
                'Value': 'Row 1 Value1',
                'Unit': 'MoHm'
              },
              {
                'Value': 'Row 1 Column 2',
                'Unit': 'MoHm'
              },
              {
                'Value': 'Row 1 Col 3 Even Longer value',
                'Unit': 'mom'
              }

            ]
          },
          {
            'Id': 2,
            'Label': 'Row 2',
            'Cells': [
              {
                'Value': 'Row 2 Column 1 with longer valie',
                'Unit': 'n2'
              },
              {
                'Value': 'Row 2 Column 2 Longer value',
                'Unit': 'n2'
              },
              {
                'Value': 'Row 2 Column 3 Eveneven Longer value',
                'Unit': 'n33'
              }
            ]
          }
        ];
        meta.ColumnLabels = [
          {
            'Id': 1,
            'Label': 'Header 1'
          },
          {
            'Id': 2,
            'Label': 'Header 2'
          },
          {
            'Id': 3,
            'Label': 'Header 3'
          }
        ];

      }
      return <View>
        <View style={{
          'flexDirection': 'row',
          'paddingLeft': 10,
          'paddingRight': 10
        }}>
          <RowContainer>
            <View style={{'flex': 100}}>
              <FlatList horizontal={true} data={this.maxCells(meta)}
                renderItem={(i) => <RowContainer style={{'flex': 1}}>{this.renderMetaTableColumn(meta, i.index, meta.ColumnLabels, checkItemIndex)}</RowContainer>}
                keyExtractor={(item, index) => index}
              />
            </View>
          </RowContainer>

        </View>
      </View>;

    }

    flipChecked (toBeFlipped, checkItemIndex) {

      const field = {...toBeFlipped};
      field.IsOk = !field.IsOk;
      if (field.IsOk && field.IsNotApplicable) {

        field.IsNotApplicable = false;

      }
      toBeFlipped.changing = true;

      this.props.changeItem({
        'checkListItem': field,
        'info': this.getInfo('checkedChange', checkItemIndex)
      });

      const state = update(
        this.state,
        {'scope': {'CheckItems': {[checkItemIndex]: {'changing': {'$set': true}}}}}
      );
      this.setState(state);

    }

    flipNa (toBeFlipped, checkItemIndex) {

      const field = {...toBeFlipped};
      field.IsNotApplicable = !field.IsNotApplicable;
      if (field.IsOk && field.IsNotApplicable) {

        field.IsOk = false;

      }
      toBeFlipped.changing = true;

      this.props.changeItem({
        'checkListItem': field,
        'info': this.getInfo('checkedChange', checkItemIndex)
      });

      const state = update(
        this.state,
        {'scope': {'CheckItems': {[checkItemIndex]: {'changing': {'$set': true}}}}}
      );
      this.setState(state);

    }

    isEmptyOrWhitespace (field) {

      return field === null || field.trim() === '';

    }

    renderFieldHeader (field) {

      if (this.isEmptyOrWhitespace(field.DetailText) === false) {

        return <TouchableOpacity style={{
          'flex': 72,
          'flexDirection': 'row'
        }} onPress={() => {

          field.expanded = !field.expanded; this.setState({'scope': {...this.state.scope}});

        }}>
          <Text style={{
            'flex': 90,
            ...styles.itemDesc,
            'marginLeft': 20,
            'fontWeight': field.IsHeading ? 'bold' : 'normal'
          }}>{field.Text}</Text>

          <View style={{
            'flex': 10,
            'paddingLeft': 10
          }}>
            {field.expanded ? <Icon name="ios-arrow-up" color={Colors.GRAY_2} size={moderateScale(18)} /> : <Icon name="ios-arrow-down" color={Colors.GRAY_2} size={moderateScale(18)} />}
          </View>
        </TouchableOpacity>;

      }

      return <View style={{
        'flex': 72,
        'flexDirection': 'row'
      }} onPress={() => {

        field.expanded = !field.expanded; this.setState({'scope': {...this.state.scope}});

      }}>
        <Text style={{
          'flex': 90,
          ...styles.itemDesc,
          'marginLeft': 20,
          'fontWeight': field.IsHeading ? 'bold' : 'normal'
        }}>{field.Text}</Text>
        <View style={{
          'flex': 10,
          'paddingLeft': 10
        }}/>
      </View>;

    }

    renderField (field, checkItemIndex) {

      return (
        this.isEmptyOrWhitespace(field.Text) === false
          ? <View key={field.Id} style={styles.item}>

            <View style={{
              'paddingLeft': 10,
              'paddingRight': 20,
              'paddingBottom': field.IsHeading ? 0 : 30,
              'paddingTop': field.IsHeading ? 0 : 30
            }}>
              <View style={styles.row}>
                {this.renderFieldHeader(field)}
                <View style={{
                  'flex': 28,
                  'marginLeft': 0
                }}>

                  {!field.IsHeading
                    ? !field.changing ? <View style={styles.row}>
                      <TouchableOpacity style={{
                        'flex': 1,
                        'justifyContent': 'center',
                        'alignItems': 'center',
                        'paddingLeft': 10,
                        'paddingRight': 10
                      }} disabled={this.isReadOnly()} onPress={() => {

                        this.flipChecked(field, checkItemIndex); /* This.setState({'scope': {...this.state.scope}});*/

                      }}>
                        {field.IsOk ? <Icon name="ios-checkmark-circle" color={Colors.BLUE} size={moderateScale(18)} /> : <Icon name="ios-radio-button-off" color={this.isReadOnly() ? 'transparent' : Colors.GRAY_2} size={moderateScale(18)} />}
                      </TouchableOpacity>
                      <TouchableOpacity disabled={this.isReadOnly()} style={{
                        'flex': 1,
                        'justifyContent': 'center',
                        'marginLeft': 5,
                        'alignItems': 'center',
                        'paddingLeft': 10,
                        'paddingRight': 10
                      }} onPress={() => {

                        this.flipNa(field, checkItemIndex); /* This.setState({'scope': {...this.state.scope}});*/

                      }}>
                        {field.IsNotApplicable ? <Icon name="ios-checkmark-circle" color={Colors.BLUE} size={moderateScale(18)} /> : <Icon name="ios-radio-button-off" color={this.isReadOnly() ? 'transparent' : Colors.GRAY_2} size={moderateScale(18)} />}
                      </TouchableOpacity>
                    </View> : <ActivityIndicator style={{'height': moderateScale(18)}}/>
                    : <View/>}

                </View>
              </View>
            </View>
            {field.expanded
              ? <View style={{
                'paddingLeft': 20,
                'backgroundColor': Colors.GRAY_3
              }}><Text style={{
                  ...styles.itemDesc,
                  'backgroundColor': Colors.GRAY_3
                }}>{field.DetailText}</Text></View>
              : null}
            {field.MetaTable

              ? <View style={{
                'borderTopWidth': 0,
                'borderColor': Colors.GRAY_3,
                'paddingLeft': 20,
                'paddingTop': 0,
                'paddingBottom': 0
              }}>{this.renderMetaTable(field.MetaTable, checkItemIndex)}</View> : null}


          </View>
          : <View key={field.Id} ></View>
      );

    }

    canSign () {

      const notSet = _.find(this.state.scope.CheckItems, (item) => !item.IsOk && !item.IsNotApplicable);
      if (notSet || !this.props.permissions.canSignChecklistItem) {

        return false;

      }

      return true;

    }


    render () {

      const scope = this.props.scope;

      if (!this.state.scope) {

        return <View>
          <Text style={{
            'fontSize': 24,
            'padding': 10,
            'textAlign': 'center'
          }}>Loading checklist...</Text>
          <ActivityIndicator animating />
        </View>;

      }


      return (
        <View style={styles.component}>
          <ScrollView>

            {this.renderHeader(this.state.scope)}

            <View style={{
              'borderBottomColor': Colors.GRAY_3,
              'borderBottomWidth': 1
            }}>

              <View style={styles.row}>
                <Text style={{
                  'flex': 60,
                  ...styles.itemDesc
                }}></Text>
                <Text style={{'flex': 10}}></Text>
                <View style={{
                  'flex': 30,
                  'padding': 10
                }}>
                  <View style={styles.row}>

                    <Text style={{
                      'flex': 1,
                      'color': Colors.GRAY_2,
                      'textAlign': 'center'
                    }}>Checked</Text>
                    <Text style={{
                      'flex': 1,
                      'color': Colors.GRAY_2,
                      'textAlign': 'center'
                    }}>N/A</Text>
                  </View>
                </View>
              </View>
            </View>

            {this.state.scope.CheckItems.map((item, index) => this.renderField(item, index))}

            <View style={{'padding': 30}}>
              <View style={styles.row}>
                <View style={{
                  'flex': 25,
                  'paddingLeft': 0
                }}>

                  {!this.canAttach() ? null : <TouchableOpacity style={styles.cameraButton} onPress={() => {

                    takePicture((response) => {

                      this.props.saveAttachment({
                        'checkListId': this.state.scope.CheckList.Id,
                        'file': {
                          'data': response.data,
                          'path': response.uri.replace('file://', ''),
                          'title': 'title'
                        }
                      });

                      const state = update(
                        this.state,
                        {
                          'takeSnap': {'$set': false},
                          'refreshingThumbnails': {'$set': false}
                        }
                      );
                      this.setState(state);

                    });

                  }}>
                    <CameraButton/>
                  </TouchableOpacity>}
                </View>
                <View style={{
                  'flex': 75,
                  'paddingLeft': moderateScale(25)
                }}>
                  <View style={styles.row}>
                    <Attachments
                      id={this.state.scope.CheckList.Id}
                      type="scope"
                      source={this.state.thumbnails}
                      onPress={(picInfo) => {

                        if (picInfo) {
                          RequestImage(this.state, this.props, picInfo, this.setState.bind(this));
                        }

                      }}
                      canRemove={!this.isReadOnly() && this.canAttach()}
                      onRemove={(picInfo) => this.props.deleteAttachment({
                        'ChecklistId': this.state.scope.CheckList.Id,
                        'AttachmentId': picInfo.attachmentId
                      })}

                    />


                    {/* This.renderAttachements()*/}
                  </View>
                </View>
              </View>
            </View>

            <View style={{'padding': 30}}>
              <View style={styles.row}>
                <Text style={{'flex': 30}}>Comments</Text>
                {this.isReadOnly()
                  ? <Text style={{
                    // 'flex': 80,
                    'flex': 70,
                    'height': 70,
                    'marginLeft': 2,
                    'padding': 10,
                    'borderWidth': 1,
                    'borderColor': Colors.GRAY_3,
                    'color': Colors.GRAY_2
                  }}>{this.state.scope.CheckList.Comment}</Text>
                  : <TextInput placeholder="Add description" value={this.state.scope.CheckList.Comment} multiline={true} style={{
                    'flex': 70,
                    'height': 70,
                    'marginLeft': 2,
                    'padding': 10,
                    'borderWidth': 1

                  }} maxLength={499} onChangeText={(text) => {

                    const state = update(
                      this.state,
                      {'scope': {'CheckList': {'Comment': {'$set': text}}}}
                    );
                    this.setState(state);

                  }}

                  onPauseText={(text) => {

                    this.props.comment(this.state.scope.CheckList);

                  }}
                  />}
              </View>
            </View>

            <View style={{
              'padding': 10,
              'paddingRight': 30,
              'marginBottom': 500
            }}>
              <View style={{
                'alignContent': 'flex-end',
                'alignItems': 'flex-end',
                'flex': 1
              }}>
                {/* <Text>{JSON.stringify(this.state.scope.CheckList)}</Text>*/}
                {this.state.scope.CheckList.changing
                  ? <ActivityIndicator animating />
                  : <View style={{
                    'alignItems': 'flex-end',
                    'alignContent': 'flex-end'
                  }}>
                    <RowContainer>
                      {this.state.scope.CheckList.SignedAt ? <Text multiline={true} style={{
                        'color': Colors.GRAY_2,
                        'paddingRight': 15,

                      }}>Signed - {Moment(this.state.scope.CheckList.SignedAt).format('DD MMM YYYY')} by{"\n"}{this.state.scope.CheckList.SignedByFirstName} {this.state.scope.CheckList.SignedByLastName} ({this.state.scope.CheckList.SignedByUser})</Text> : null}
                      <Button
                        title={this.state.scope.CheckList.SignedAt ? 'Unsign' : 'Sign'}
                        onPress={() => {

                          if (this.state.scope.CheckList.SignedAt) {

                            this.props.unSign(this.state.scope.CheckList);
                            const state = update(
                              this.state,
                              {'scope': {'CheckList': {'changing': {'$set': true}}}}
                            );
                            this.setState(state);


                          } else {

                            this.props.sign(this.state.scope.CheckList);
                            const state = update(
                              this.state,
                              {'scope': {'CheckList': {'changing': {'$set': true}}}}
                            );
                            this.setState(state);

                            // This.setState({'scope': {...this.state.scope}});

                          }

                        }}
                        disabled={!this.canSign()/* !hasConnectivity*/}
                        viewStyle={styles.buttonStyle}
                      />
                    </RowContainer>
                    <Text style={{'color': Colors.RED}}>{this.state.signUnsignError}</Text>

                  </View>
                }
              </View>
            </View>

          </ScrollView>
        </View>
      );

    }

}
const mapStateToProps = (state) => ({
  'scope': appReducer.scope(state),
  'checkChangeRequest': reducer.checklistItemChangeRequest(state),
  'itemChanged': reducer.checklistItemChanged(state),
  'itemChangedFailed': reducer.checklistItemChangedFailed(state),
  'listChanged': reducer.checklistChanged(state),
  'listChangedFailed': reducer.checklistChangedFailed(state),
  'thumbnails': reducer.thumbnails(state),
  'thumbnailsRequested': reducer.thumbnailsRequested(state),
  'attachment': reducer.attachment(state),
  'fileRequested': reducer.fileRequested(state),
  'attachmentSaving': reducer.attachmentSaving(state),
  'refreshThumbnails': reducer.refreshThumbnails(state),
  'attachmentDeleting': reducer.attachmentDeleting(state),
  'pcs': appReducer.pcs(state),
  'loadingPcs': appReducer.loadingPcs(state),
  'permissions': appReducer.getPermissions(state)

/*
 *  'attachmentSaved':reducer.attachmentSaved(state),
 *'attachmentSavedFailed':reducer.attachmentSavedFailed(state),
 */


});

const mapDispatchToProps = (dispatch) => ({
  'changeItem': (item) => dispatch(actions.checklistItemChangeRequest(item)),
  'sign': (item) => dispatch(actions.checklistSignRequest(item)),
  'unSign': (item) => dispatch(actions.checklistUnsignRequest(item)),
  'comment': (item) => dispatch(actions.checklistCommentRequest(item)),
  'requestAttachments': (item) => dispatch(actions.attachmentsRequest(item)),
  'requestAttachment': (item) => dispatch(actions.attachmentRequest(item)),
  'saveAttachment': (item) => dispatch(actions.attachmentSaveRequest(item)),
  'deleteAttachment': (item) => dispatch(actions.attachmentDeleteRequest(item)),
  'setNewPunch': (item) => dispatch(actions.setNewPunch(item))
  // 'refreshPackage': (pcs) => dispatch(actions.loadPcs(pcs))

});

export default connect(mapStateToProps, mapDispatchToProps)(ScopeItem);
