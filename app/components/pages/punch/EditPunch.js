import React, { useEffect, useState } from 'react';
import {View, ActivityIndicator} from 'react-native';
import { TouchableOpacity, Text, TextInput, ScrollView, DropdownCodeDesc } from '../../atoms/StandardComponents';
import Button from '../../atoms/Button';
import Attachments, { takePicture, CameraButton} from '../../molecules/Attachments';
import DocViewer from 'react-native-doc-viewer';
import Moment from 'moment';

import { connect } from 'react-redux';
import commonStyles from './commonStyles';
import * as punchItemReducer from '../../../reducers/punchItemPage';
import * as appReducer from '../../../reducers/appData';

import * as actions from '../../../actions';
import PunchHeader from './PunchHeader';

const EditPunch = (props) => {

    const [punchState, setPunchState] = useState({
        typeCode: props.punch.TypeCode,
        description: props.punch.Description,
        status: props.punch.Status,
        raisedByCode: props.punch.RaisedByCode,
        clearingByCode: props.punch.ClearingByCode
    });

    const [openOnNextAttachmentUpdate, setOpenOnNextAttachmentUpdate] = useState(false);

    /**
     * Everytime the punch updates, we set out local state values
     * using local state values ensures quicker user feedback in the UI
     * instead of waiting for the updated punch item everytime. 
     */
    useEffect(() => {
        const {punch} = props;
        setPunchState({
            typeCode: punch.TypeCode,
            description: punch.Description,
            status: punch.Status,
            raisedByCode: punch.RaisedByCode,
            clearingByCode: punch.ClearingByCode
        });
    }, [props.punch]);

    /**
     * Attachment is tied to the redux scope instead of local to the 
     * component. 
     * So we need to listen for changes on attachment in order to know when
     * to view the attachement
     */
    useEffect(() => {
        if (openOnNextAttachmentUpdate && props.attachment != null) {
        console.log('Opening attachment')

             console.log('Opening attachment');
             try {
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
             } catch (err) {
                 console.log('Error occured during opening of attachment', err);
             } finally {
                 setOpenOnNextAttachmentUpdate(false);
             }

            setOpenOnNextAttachmentUpdate(false);
            
        }
        
    },[props.attachment]);

    /**
     * Request some data up-front.
     */
    useEffect(() => {
        if (props.attachmentDeleting || props.attachmentSaving) return;
        props.requestAttachments({
            id: props.punch.Id,
        });
    }, [props.attachmentDeleting, props.attachmentSaving]);

    useEffect(() => {
        if (!props.metadataRequested) props.requestMetdata();
    },[]);

    const updatePunchField = (field, value) => {
        console.log('Updating field: ', props.punch);
        props.updatePunch({
            Id: props.punch.Id,
            field: field,
            data: value
        });
    }

    const captureImage = () => {
        takePicture((response) => {
            const request = {
                punchItemId: props.punch.Id,
                file: {
                    data: response.data,
                    path: response.uri.replace('file://',''),
                    title: 'title'
                }
            };
            props.saveAttachment(request);
        });
    }

    if (!props.metadata || !props.punch) {
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
                    <DropdownCodeDesc 
                        selected={punchState.status} 
                        onSelect={(unknown,{item}) => updatePunchField('Category', item.Id)}
                        ready={props.metadata && props.metadata.categories} data={() => props.metadata.categories} 
                    />
                </View>
            </View>

            <View style={commonStyles.row}>
                <Text style={commonStyles.sectionLabel}>Type</Text>
                <View style={commonStyles.sectionContent}>
                    <DropdownCodeDesc 
                        selected={punchState.typeCode} 
                        onSelect={(unknown,{item}) => updatePunchField('Type', item.Id)}
                        ready={props.metadata && props.metadata.types} data={() => props.metadata.types} 
                    />
                </View>
            </View>

            <View style={commonStyles.row}>
                <Text style={commonStyles.sectionLabel}>Description</Text>
                <View style={commonStyles.sectionContent}>
                <TextInput placeholder="Add description" 
                        value={punchState.description} 
                        multiline={true} 
                        pauseDelay={3000}
                        style={commonStyles.descriptionInput}
                        onChangeText={(text) => {
                            setPunchState((state) => ({...state, description: text}));
                        }}
                        onPauseText={() => {
                            console.log('Updating text: ', props.punch);
                            updatePunchField('Description', punchState.description)
                        }}
                    />
                </View>
            </View>

            <View style={commonStyles.row}>

                <View style={commonStyles.leftSideColumn}>
                    <TouchableOpacity 
                        style={commonStyles.cameraButton} 
                        onPress={captureImage} >
                        {props.attachmentSaving && (<ActivityIndicator animating />) || (<CameraButton />)}
                    </TouchableOpacity>
                </View>
                <View style={commonStyles.rightSideColumn}>
                    {(props.thumbnailsRequested || props.attachmentDeleting) && 
                        (<ActivityIndicator animating />) || 
                        (<Attachments
                              id={props.punch.Id}
                              type="punch"
                              source={props.thumbnails}
                              onPress={(picInfo) => {
                                setOpenOnNextAttachmentUpdate(true);
                                props.requestAttachment(picInfo);
                              }}
                              canRemove={true}
                              onRemove={(picInfo) => props.deleteAttachment({
                                PunchItemId: props.punch.Id,
                                AttachmentId: picInfo.attachmentId
                              })}
                        
                            />)}
                </View>

            </View>

            <View style={commonStyles.row}>
                <Text style={commonStyles.sectionLabel}>Raised By</Text>
                <View style={commonStyles.sectionContent}>
                    <DropdownCodeDesc 
                        selected={punchState.raisedByCode} 
                        onSelect={(unknown,{item}) => updatePunchField('RaisedBy', item.Id)}
                        ready={props.metadata && props.metadata.organizations} data={() => props.metadata.organizations} 
                    />
                </View>
            </View>

            <View style={commonStyles.row}>
                <Text style={commonStyles.sectionLabel}>Clearing by</Text>
                <View style={commonStyles.sectionContent}>
                    <DropdownCodeDesc 
                        selected={punchState.clearingByCode} 
                        onSelect={(unknown,{item}) => updatePunchField('ClearingBy', item.Id)}
                        ready={props.metadata && props.metadata.organizations} data={() => props.metadata.organizations} 
                    />
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

                {props.permissions.canClearPunchItem && !props.punch.ClearedAt && !props.punch.VerifiedAt ? <Button
                    title="Clear"

                    onPress={() => props.clearPunch({Id: props.punch.Id})}
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
    metadata: punchItemReducer.metadata(state),
    metadataRequested: punchItemReducer.metadataRequested(state),
    punch: punchItemReducer.punch(state),

    attachment: punchItemReducer.attachment(state),
    attachmentSaving: punchItemReducer.attachmentSaving(state),
    attachmentDeleting: punchItemReducer.attachmentDeleting(state),

    permissions: appReducer.getPermissions(state),
    
    thumbnails: punchItemReducer.thumbnails(state),
    thumbnailsRequested: punchItemReducer.thumbnailsRequested(state),
});

const mapDispatchToProps = (dispatch) => ({
    updatePunch: (item) => dispatch(actions.punchUpdateRequest(item)),
    requestMetdata: () => dispatch(actions.punchMetadataRequest()),
    
    saveAttachment: (item) => dispatch(actions.attachmentSaveRequestPunch(item)),
    requestAttachments: (item) => dispatch(actions.attachmentsRequestPunch(item)),
    requestAttachment: (item) => dispatch(actions.attachmentRequestPunch(item)),
    deleteAttachment: (item) => dispatch(actions.attachmentDeleteRequestPunch(item)),
    verifyPunch: (item) => dispatch(actions.punchVerifyRequest(item)),
    clearPunch: (item) => dispatch(actions.punchClearRequest(item)),
    unclearPunch: (item) => dispatch(actions.punchUnClearRequest(item)),
    rejectPunch: (item) => dispatch(actions.punchRejectRequest(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPunch);