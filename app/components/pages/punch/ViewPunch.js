import React, { useEffect, useState } from 'react';
import {View, ActivityIndicator} from 'react-native';
import { Text, ScrollView } from '../../atoms/StandardComponents';
import Button from '../../atoms/Button';
import Attachments from '../../molecules/Attachments';
import DocViewer from 'react-native-doc-viewer';
import Moment from 'moment';

import { connect } from 'react-redux';
import { combineTwo } from '../../../utils/misc';
import commonStyles from './commonStyles';
import * as punchItemReducer from '../../../reducers/punchItemPage';
import * as appReducer from '../../../reducers/appData';

import * as actions from '../../../actions';
import PunchHeader from './PunchHeader';

const ViewPunch = (props) => {

    const [openOnNextAttachmentUpdate, setOpenOnNextAttachmentUpdate] = useState(false);

    /**
     * Attachment is tied to the redux scope instead of local to the 
     * component. 
     * So we need to listen for changes on attachment in order to know when
     * to view the attachement
     */
    useEffect(() => {
        if (openOnNextAttachmentUpdate && props.attachment != null) {
            DocViewer.openDocb64([{
                base64: props.attachment.base64,
                fileName: props.attachment.title,
                fileType: props.attachment.extension,
                cache: false
              }], (error, url) => {
                if (error) {
                  console.error('Error while opening attachment: ', error, url);
                }
              });
              setOpenOnNextAttachmentUpdate(false);
        }
        
    },[props.attachment]);

    if (!props.punch) {
        return (
            <View>
                <Text style={commonStyles.loadingText}>Loading punch item...</Text>
                <ActivityIndicator animating />
            </View>)
    }
    return (
      <View style={commonStyles.component}>

      <ScrollView>
        <PunchHeader punch={props.punch} />
        <View style={commonStyles.sectionContainer}>

          <View style={{ 'padding': 10 }}>
            <View style={commonStyles.row}>
                <Text style={commonStyles.sectionLabel}>Category</Text>
                <View style={commonStyles.sectionContent}>
                    <Text>
                        {props.punch.Status}
                    </Text>
                </View>
            </View>

            <View style={commonStyles.row}>
                <Text style={commonStyles.sectionLabel}>Type</Text>
                <View style={commonStyles.sectionContent}>
                    <Text>
                        {combineTwo(props.punch.TypeCode, props.punch.TypeDescription)}
                    </Text>
                </View>
            </View>

            <View style={commonStyles.row}>
                <Text style={commonStyles.sectionLabel}>Description</Text>
                <View style={commonStyles.sectionContent}>
                <Text>
                        {props.punch.Description}
                    </Text>
                </View>
            </View>

            <View style={commonStyles.row}>

                <View style={commonStyles.leftSideColumn}>
                    {/* Left blank for spacing */}
                </View>
                <View style={commonStyles.rightSideColumn}>
                    {(props.thumbnailsRequested) && 
                        (<ActivityIndicator animating />) || 
                        (<Attachments
                              id={props.punch.Id}
                              type="punch"
                              source={props.thumbnails}
                              onPress={(picInfo) => {
                                setOpenOnNextAttachmentUpdate(true);
                                props.requestAttachment(picInfo);
                              }}
                              canRemove={false}
                            />)}
                </View>

            </View>

            <View style={commonStyles.row}>
                <Text style={commonStyles.sectionLabel}>Raised By</Text>
                <View style={commonStyles.sectionContent}>
                    <Text>
                        {combineTwo(props.punch.RaisedByCode, props.punch.RaisedByDescription)}
                    </Text>
                </View>
            </View>

            <View style={commonStyles.row}>
                <Text style={commonStyles.sectionLabel}>Clearing by</Text>
                <View style={commonStyles.sectionContent}>
                    <Text>
                        {combineTwo(props.punch.ClearingByCode, props.punch.ClearingByDescription)}
                    </Text>
                </View>
            </View>

            <View style={commonStyles.row}>
                <Text style={commonStyles.leftSideColumn}>Signatures</Text>
                <Text style={commonStyles.rightSideColumn}>
                    {props.punch.ClearedAt ? `Cleared at ${Moment(props.punch.ClearedAt).format('DD MMM YYYY')} by ${props.punch.ClearedByFirstName} ${props.punch.ClearedByLastName} (${props.punch.ClearedByUser})` : ''}
                </Text>
            </View>
            
            <View style={commonStyles.row}>
                <View style={commonStyles.buttonRow}>
                    {props.permissions.canUnclearPunchItem && props.punch.ClearedAt && !props.punch.VerifiedAt ? <Button
                    title="Unclear"

                    onPress={() => props.unclearPunch({Id: props.punch.Id})}
                    disabled={props.punch.StatusControlledBySwcr}
                    viewStyle={commonStyles.buttonStyle} /> : null}

                {props.permissions.canRejectPunchItem && props.punch.ClearedAt && !props.punch.VerifiedAt ? <Button
                    title="Reject"

                    onPress={() => props.rejectPunch({Id: props.punch.Id})}
                    disabled={props.punch.StatusControlledBySwcr}
                    viewStyle={commonStyles.buttonStyle} /> : null}

                {props.permissions.canVerifyPunchItem && props.punch.ClearedAt && !props.punch.VerifiedAt ? <Button
                    title="Verify"

                    onPress={() => props.verifyPunch({Id: props.punch.Id})}
                    disabled={props.punch.StatusControlledBySwcr}
                    viewStyle={commonStyles.buttonStyle} /> : null}

                </View>
            </View>

            <View styles={commonStyles.row}>
                <Text style={commonStyles.errorText}>{props.error}</Text>
            </View>

          </View>
        </View>

      </ScrollView>
    </View>
    )

}

const mapStateToProps = (state) => ({
    punch: punchItemReducer.punch(state),
    attachment: punchItemReducer.attachment(state),
    permissions: appReducer.getPermissions(state),
    thumbnails: punchItemReducer.thumbnails(state),
    thumbnailsRequested: punchItemReducer.thumbnailsRequested(state),
});

const mapDispatchToProps = (dispatch) => ({
    verifyPunch: (item) => dispatch(actions.punchVerifyRequest(item)),
    unclearPunch: (item) => dispatch(actions.punchUnClearRequest(item)),
    rejectPunch: (item) => dispatch(actions.punchRejectRequest(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ViewPunch);