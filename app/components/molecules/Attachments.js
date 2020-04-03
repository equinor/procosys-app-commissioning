import React from 'react';
import update from 'immutability-helper';
import DocViewer from 'react-native-doc-viewer';

import deletePhoto from '../../../resources/images/deletePhoto.png';
import * as Colors from '../../stylesheets/colors';
import {
  View,
  ActivityIndicator, Alert
} from 'react-native';

import { moderateScale } from '../../utils/scaling';
import ImagePicker from 'react-native-image-picker';
import cameraButton from '../../../resources/images/cameraButton.png';
import { TouchableOpacity, Text, Image, ScrollView } from '../atoms/StandardComponents';




const removePicture = (pic, picInfo, onRemove) => {

  // Works on both iOS and Android
  Alert.alert(
    'Remove attachment',
    `Remove ${picInfo.title}?`,
    [
      {
        'text': 'Yes',
        'onPress': () => onRemove(picInfo)
      },
      {
        'text': 'Cancel',
        'onPress': () => console.log('Cancel Pressed'),
        'style': 'cancel'
      }

    ],
    { 'cancelable': false }
  );

}
export const renderPictureIcon = (pic, isImage, title) => {
  return (isImage
    ? <Image source={{ 'uri': pic }} style={{
      'width': moderateScale(50),
      'marginTop': moderateScale(10),
      'height': moderateScale(41)
    }} /> : <Text style={{
      'width': moderateScale(50),
      'marginTop': moderateScale(10),

      'padding': 10,
      'textAlign': 'center',
      'height': moderateScale(40),
      'borderWidth': 1,
      'borderRadius': 5,
      'fontSize': 8,
      'borderColor': Colors.GRAY_3
    }}>{title}</Text>)
}

const renderPicture = (pic, picInfo, onPress, canRemove, onRemove) => {
  if (!picInfo) return <View style={{
    'paddingRight': 5,
    'width': moderateScale(70),
    'height': moderateScale(50)
  }} />

  return (
    <View style={{
      'paddingRight': 5,
      'width': moderateScale(70),
      'height': moderateScale(50)
    }}>
      {!picInfo.isLoading ? <View>
        <TouchableOpacity onPress={() => onPress(picInfo)}>
          {renderPictureIcon(pic, picInfo.isImage, picInfo.title)}

        </TouchableOpacity>

        {!canRemove
          ? null :
          <TouchableOpacity style={{
            'position': 'absolute',
            'backgroundColor': 'transparent',
            'marginTop': 0,
            'paddingTop': 0,
            'marginLeft': moderateScale(40)
          }} onPress={() => removePicture(pic, picInfo, onRemove)}>
            <Image style={{
              'alignSelf': 'center',
              'height': moderateScale(20),
              'width': moderateScale(20),
              'borderRadius': 10,
              'borderWidth': 0
            }} source={deletePhoto} resizeMode="stretch" />
          </TouchableOpacity>}

      </View> : <ActivityIndicator animating />}
    </View>
  );

}

export const isPicture = (mime) => {


  switch (mime.MimeType || mime) {

    case 'image/png':
    case 'image/jpg':
    case 'image/jpeg':
    case 'image/tiff':
    case 'image/bmp':
    case 'image/gif':
      return true;

  }
  return false;

}
export const getPictureData = (pic) => pic.Uri || `data:${pic.MimeType};base64,${pic.ThumbnailAsBase64}`;

export const CreatePicInfo = (thumbnail, id, index, type) => {
  return {
    'checkListId': id,
    'punchId': id,
    'taskId': id,
    'attachmentId': thumbnail.Id,
    'type': type,
    'mimeType': thumbnail.MimeType,
    'uri': thumbnail.Uri,
    'title': thumbnail.Title,
    'isImage': thumbnail.ThumbnailAsBase64 || isPicture(thumbnail.MimeType),
    'base64': thumbnail.ThumbnailAsBase64,
    'isLoading': thumbnail.isLoading,
    'extension': thumbnail.Extension,
    index
  }
}
const Attachments = (props) => {
  let id = props.id;
  let type = props.type;
  let source = props.source;
  let onPress = props.onPress;
  let canRemove = props.canRemove;
  let onRemove = props.onRemove;


  if (!source || !source.length) {

    return null;

  }

  return <ScrollView horizontal={true}>{source.map((i, index) => <View key={i.Id}>
    {renderPicture(getPictureData(i), CreatePicInfo(i, id, index, type), onPress, canRemove, onRemove)}
  </View>)}
  </ScrollView>;

}

export const takePicture = (onTake) => {

  const options = {
    'title': 'Select photo',
    'customButtons': [],
    'storageOptions': {
      'skipBackup': true,
      'path': 'images'
    }
  };

  ImagePicker.showImagePicker(options, (response) => {

    if (response.didCancel) {

      console.log('User cancelled image picker');

    } else if (response.error) {

      console.log('ImagePicker Error: ', response.error);

    } else if (response.customButton) {

      console.log('User tapped custom button: ', response.customButton);

    } else {
      console.log('User selected a photo');
      onTake(response);

    }

  });
}

export const RequestImage = (localState, localProps, picInfo, setState, thumbnailsContainer, thumbnailsProperty) => {
  if (!localProps.requestAttachment) {
    throw "localProps.requestAttachment is not set!";
  }
  let t = {};
  let property = thumbnailsProperty ? thumbnailsProperty : 'thumbnails'
  if (thumbnailsContainer) {
    t[thumbnailsContainer] = { [property]: { [picInfo.index]: { 'isLoading': { '$set': true } } } };
  }
  else {
    t[property] = { [picInfo.index]: { 'isLoading': { '$set': true } } };
  }
  t['showFile'] = { '$set': true };

  const state = update(
    localState,
    t
  );
  setState(state);
  localProps.requestAttachment(picInfo);
}

export const ShowImageIfReady = (localState, localProps, nextProps, setState) => {
  console.log('Showing image if ready');
  if (nextProps.attachment && localState.showFile && localProps.fileRequested && !nextProps.fileRequested) {
    if (!localState.fileShown) {
      let state = update(
        localState,
        { 'fileShown': { '$set': true } }
      );
      setState(state);
      if (nextProps.attachment.base64 || nextProps.attachment.uri) {
        console.log('Opening attachment', nextProps.attachment);
        console.log('Using B64');
        DocViewer.openDocb64([{
          base64: nextProps.attachment.base64,
          fileName: nextProps.attachment.title,
          fileType: nextProps.attachment.extension,
          cache: false
        }], (error, url) => {
          if (error) {
            console.error('Error while opening attachment: ', error, url);
          }
        });
      }

      state = update(
        localState,
        {
          'showFile': { '$set': false },
          'fileShown': { '$set': false }
        }
      );
      setState(state);
    }
  }
}


export const CameraButton = () => <Image style={{
  'alignSelf': 'center',
  'height': moderateScale(40),
  'width': moderateScale(60),
  'borderWidth': 0
}} source={cameraButton} resizeMode="stretch" />


export default Attachments;
