import React, {useEffect} from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as appReducer from '../../reducers/appData';
import * as punchItemReducer from '../../reducers/punchItemPage';
import ViewPunch from './punch/ViewPunch';
import NewPunch from './punch/NewPunch';
import EditPunch from './punch/EditPunch';

const PunchItem = (props) => {
  const {punch, permissions, newPunch: isNewPunchItem} = props;

  useEffect(() => {
    if (props.verified && !props.isFetching) {
      props.navigation && props.navigation.goBack();
    }
  },[props.verified, props.isFetching])

  if  (!punch && !isNewPunchItem) {
    return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator animating />
      <Text>Loading Punch</Text>
    </View>);
  }

  if (!permissions || !permissions.canEditPunchItem) { // If no edit rights, just return view
    return <ViewPunch />;
  }
  if (isNewPunchItem) {
    return <NewPunch />;
  }
  if (punch.ClearedAt || punch.IsRestrictedForUser) {
    return <ViewPunch />;
  }
  // return <OldPunchItemView navigation={props.navigation} />
  return <EditPunch />;

}

const styles = StyleSheet.create({
  loadingContainer: {
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

});

const mapStateToProps = (state) => ({
  permissions: appReducer.getPermissions(state),
  punch: punchItemReducer.punch(state),
  newPunch: punchItemReducer.newPunch(state),
  verified: punchItemReducer.verified(state),
  isFetching: punchItemReducer.isFetching(state),
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(PunchItem);