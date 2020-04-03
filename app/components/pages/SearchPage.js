import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as actions from '../../actions';
import {connect} from 'react-redux';
import * as reducer from '../../reducers/searchPage';
import * as Colors from '../../stylesheets/colors';
import {moderateScale} from '../../utils/scaling';
import {renderPackageStatus} from '../molecules/StatusRender';
import * as appReducer from '../../reducers/appData';
import {globalStyles} from '../../settings';

import {
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import {TouchableOpacity, Text, ScrollView, RowContainer} from '../atoms/StandardComponents';

import SearchBar from '../molecules/SearchBar';

const styles = StyleSheet.create({
  'component': {
    'flex': 1,
    'backgroundColor': 'white'
  },
  'result': {
    'flexDirection': 'row',
    // BorderBottomWidth: 1,
    // BorderBottomColor: Colors.GRAY_3,
    'padding': 10
  },
  'resultSummary': {
    'backgroundColor': Colors.GRAY_3,
    'textAlign': 'center',
    'padding': 10
  },
  'status': {'flex': 1},
  'no': {
    'flex': 2,
    'fontSize': moderateScale(13)
  },
  'desc': {
    'flex': 5,
    'fontSize': moderateScale(11)
  },
  'descContainer': {'flex': 5}
});

class DefaultPage extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    'navigation': PropTypes.object.isRequired,
    'search': PropTypes.string,
    'requestQuery': PropTypes.func

  }

  UNSAFE_componentWillUpdate(nextProps) {

    if (nextProps.data !== this.props.data) {
      // Do whatever you want
    }

  }

  static navigationOptions = ({navigation}) => ({
    'title': navigation.state.params.title || 'Search',
    'titleStyle': {'fontFamily': globalStyles.fontFamily},
    'headerStyle': {
      'backgroundColor': Colors.BLUE,
      'borderBottomColor': Colors.BLUE,
      'color': '#FFF'
    },
    headerBackTitleStyle: {
      color: '#FFF'
    }
  });


  render() {

    return (
      <View style={styles.component}>
        <ScrollView keyboardShouldPersistTaps={true}>
          <SearchBar query={this.props.search} onSearchTextUpdate={(q) => {

            if (q.length >= 2) {

              this.props.requestQuery(q);

            }

          }}
          />

          {!!this.props.searching
            ? <ActivityIndicator animating /> : <View />}
          {!!this.props.searchResult
            ? <View style={{'marginBottom': 350}}>
              <Text style={styles.resultSummary}>Displaying {this.props.searchResult.Items.length} of {this.props.searchResult.MaxAvailable} packages</Text>

              {this.props.searchResult.Items.map((item) =>

                <TouchableOpacity style={{
                  'padding': 15,
                  'borderBottomColor': Colors.GRAY_3,
                  'borderBottomWidth': 1
                }} key={item.CommPkgNo} onPress={() => {

                  this.props.navigation.navigate('PackageRoute');
                  this.props.loadPackage(item);

                }}>

                  {!this.props.project || !this.props.project.Id ? (<View style={styles.result}>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.desc}></Text>
                      <View style={styles.status}>{renderPackageStatus(item, 2)}</View>

                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.desc}></Text>
                      <Text style={styles.no}>{item.CommPkgNo}</Text>
                    </View>
                    <View style={styles.descContainer}>
                      <Text style={{ ...styles.desc, flex: 1, color: Colors.GRAY_2 }}>{item.ProjectDescription}</Text>
                      <Text style={{ ...styles.desc, flex: 1 }}>{item.Description}</Text>

                    </View></View>) : (<View style={styles.result}>

                      <View style={styles.status}>{renderPackageStatus(item, 2)}</View>
                      <Text style={styles.no}>{item.CommPkgNo}</Text>
                      <Text style={styles.desc}>{item.Description}</Text>
                    </View>)
                  }

                </TouchableOpacity>)}

            </View> : <View />}
        </ScrollView>
      </View>);

  }

}
const mapStateToProps = (state) => ({
  'searching': reducer.getSearching(state),
  'searchFailed': reducer.getSearchFailed(state),
  'searchResult': reducer.getSearchResult(state),
  'search': reducer.getQuery(state),
  'project': appReducer.getProject(state)

});

const mapDispatchToProps = (dispatch) => ({

  'requestQuery': (query) => dispatch(actions.searchPcsRequested({ query })),
  'sendFeedback': (message) => dispatch(actions.postFeedback({ message})),
  'loadPackage': (searchResult) => dispatch(actions.loadPcs(searchResult))

});

export default connect(mapStateToProps, mapDispatchToProps)(DefaultPage);
