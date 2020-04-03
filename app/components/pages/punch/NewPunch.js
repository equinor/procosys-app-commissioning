import React, { useEffect, useState } from 'react';
import {View, ActivityIndicator} from 'react-native';
import { TouchableOpacity, Text, TextInput, ScrollView, DropdownCodeDesc } from '../../atoms/StandardComponents';
import Button from '../../atoms/Button';
import Attachments, { takePicture, CameraButton} from '../../molecules/Attachments';
import DocViewer from 'react-native-doc-viewer';

import { connect } from 'react-redux';
import commonStyles from './commonStyles';
import * as punchItemReducer from '../../../reducers/punchItemPage';
import * as appReducer from '../../../reducers/appData';

import * as actions from '../../../actions';
import PunchHeader from './PunchHeader';

const NewPunch = (props) => {

    const [punchState, setPunchState] = useState({
        typeId: null,
        description: null,
        categoryId: null,
        raisedById: null,
        clearingById: null
    });

    const [canCreatePunch, setCanCreatePunch] = useState(false);

    useEffect(() => {
        setCanCreatePunch(state => (
            props.punch && props.punch.ChecklistId 
            && punchState.description 
            && punchState.categoryId 
            && punchState.raisedById 
            && punchState.clearingById))
    },[punchState]);

    useEffect(() => {
        props.requestMetadata();
    },[]);

    const submitForm = () => {
        const formattedData = {
            CheckListId: props.punch.ChecklistId,
            CategoryId: punchState.categoryId,
            RaisedByOrganizationId: punchState.raisedById,
            ClearingByOrganizationId: punchState.clearingById,
            Description: punchState.description,
            TypeId: punchState.typeId,
            TemporaryFileIds: props.tmpThumbnails.map(att => att.Id)
        };

        props.saveNewPunch(formattedData);
    }

    const captureImage = () => {
        takePicture((response) => {
            const request = {
                file: {
                    data: response.data,
                    path: response.uri.replace('file://',''),
                    title: 'New attachment',
                    extension: response.uri.split('.').pop()
                }
            };
            props.saveTmpAttachment(request);
        });
    }

    const openAttachment = (picInfo) => {
        DocViewer.openDocb64([{
            base64: picInfo.base64,
            fileName: picInfo.title,
            fileType: picInfo.extension,
            cache: false
        }], (error, url) => {
            if (error) {
            console.error('Error while opening attachment: ', error, url);
            }
        });
    };

    const deleteAttachment = (picInfo) => {
        props.deleteTmpAttachment({ Id: picInfo.attachmentId });
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

          <View style={{ padding: 10 }}>
            <View style={commonStyles.row}>
                <Text style={commonStyles.sectionLabel}>Category</Text>
                <View style={commonStyles.sectionContent}>
                    <DropdownCodeDesc 
                        selected={punchState.categoryId} 
                        onSelect={(unknown,{item}) => setPunchState(state => ({...state, categoryId: item.Id}))}
                        ready={props.metadata && props.metadata.categories} data={() => props.metadata.categories} 
                    />
                </View>
            </View>

            <View style={commonStyles.row}>
                <Text style={commonStyles.sectionLabel}>Type</Text>
                <View style={commonStyles.sectionContent}>
                    <DropdownCodeDesc 
                        selected={punchState.typeId} 
                        onSelect={(unknown,{item}) => setPunchState(state => ({...state, typeId: item.Id}))}
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
                        style={commonStyles.descriptionInput}
                        onChangeText={(text) => {
                            setPunchState((state) => ({...state, description: text}));
                        }}
                    />
                </View>
            </View>

            <View style={commonStyles.row}>

                <View style={commonStyles.leftSideColumn}>
                    <TouchableOpacity 
                        style={commonStyles.cameraButton} 
                        onPress={captureImage} disabled={props.attachmentSaving}>
                        {props.attachmentSaving && (<ActivityIndicator animating />) || (<CameraButton />)}
                    </TouchableOpacity>
                </View>
                <View style={commonStyles.rightSideColumn}>
                    {(props.attachmentDeleting || props.attachmentSaving) && 
                        (<ActivityIndicator animating />) || 
                        (<Attachments
                            id={"attachments"}
                            type="punch"
                            source={props.tmpThumbnails}
                            onPress={openAttachment}
                            canRemove={true}
                            onRemove={deleteAttachment}
                          />)}
                </View>

            </View>

            <View style={commonStyles.row}>
                <Text style={commonStyles.sectionLabel}>Raised By</Text>
                <View style={commonStyles.sectionContent}>
                    <DropdownCodeDesc 
                        selected={punchState.raisedById} 
                        onSelect={(unknown,{item}) => setPunchState(state => ({...state, raisedById: item.Id}))}
                        ready={props.metadata && props.metadata.organizations} data={() => props.metadata.organizations} 
                    />
                </View>
            </View>

            <View style={commonStyles.row}>
                <Text style={commonStyles.sectionLabel}>Clearing by</Text>
                <View style={commonStyles.sectionContent}>
                    <DropdownCodeDesc 
                        selected={punchState.clearingById} 
                        onSelect={(unknown,{item}) => setPunchState(state => ({...state, clearingById: item.Id}))}
                        ready={props.metadata && props.metadata.organizations} data={() => props.metadata.organizations} 
                    />
                </View>
            </View>
            
            <View style={commonStyles.row}>
                <View style={commonStyles.buttonRow}>
                    <Button
                        title="Create new punch"
                        onPress={submitForm}
                        disabled={!canCreatePunch}
                        viewStyle={commonStyles.buttonStyle}
                    />
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
    punch: punchItemReducer.punch(state),
    tmpThumbnails: punchItemReducer.tmpThumbnails(state),
    attachment: punchItemReducer.attachment(state),
    attachmentSaving: punchItemReducer.attachmentSaving(state),
    attachmentDeleting: punchItemReducer.attachmentDeleting(state),
    permissions: appReducer.getPermissions(state),
});

const mapDispatchToProps = (dispatch) => ({
    requestMetadata: () => dispatch(actions.punchMetadataRequest()),
    saveNewPunch: (item) => dispatch(actions.newPunchCreateRequest(item)),
    deleteTmpAttachment: (item) => dispatch(actions.newPunchTmpAttachmentDeleteRequest(item)),
    saveTmpAttachment: (item) => dispatch(actions.newPunchTmpAttachmentSaveRequest(item))
})

export default connect(mapStateToProps, mapDispatchToProps)(NewPunch);