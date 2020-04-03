import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Colors from '../../stylesheets/colors';
import {moderateScale} from '../../utils/scaling';
import debounce from 'lodash/debounce';


const isTablet = DeviceInfo.isTablet();
const plantSelectToggle = false;
const filterToggle = false;

const styles = StyleSheet.create({
  'searchContainer': {
    'flexDirection': 'row',
    'backgroundColor': Colors.BLUE,
    'paddingTop': 10,
    'paddingBottom': isTablet ? 20 : 10,
    'paddingHorizontal': isTablet ? 20 : 10,
    'elevation': 6
  },
  'searchFieldContainer': {
    'flex': 1,
    'flexDirection': 'row',
    'height': moderateScale(36),
    'alignItems': 'flex-end',
    'paddingBottom': 0,
    'paddingTop': isTablet ? 10 : 0

  },
  'searchField': {
    'flex': 4,
    'borderBottomWidth': 1,
    'height': isTablet ? moderateScale(32) : moderateScale(34),
    'borderBottomColor': 'white',
    'flexDirection': 'row'
  },
  'searchIcon': {
    'width': moderateScale(30),
    'height': isTablet ? moderateScale(32) : moderateScale(28),

    'paddingTop': 7,
    'paddingLeft': 10,
    'justifyContent': 'center',
    'alignItems': 'center',
  },
  'clearButtonContainer': {},
  'clearButton': {
    'paddingLeft': 15,
    'paddingRight': 15,

    'alignSelf': 'center'
  },
  'searchInput': {

    'fontSize': moderateScale(15),
    'flex': 1,
    'paddingLeft': 10,
    'paddingRight': 10,
    'height': isTablet ? moderateScale(32) : moderateScale(36),
    'color': 'white',

  },
  'searchButton': {'flex': 2},
  'searchCriteriaContainer': {
    'flex': 1,
    'flexDirection': 'row',
    'height': 36,
    'alignItems': 'flex-end'
  },
  'searchCriteriaUnderline': {
    'flex': 1,
    'borderBottomWidth': 1,
    'borderBottomColor': 'white',
    'marginHorizontal': 20,
    'flexDirection': 'row'
  },
  'searchCriteria': {
    'height': 36,
    'flex': 1,
    'color': 'white'
  }
});

class SearchBar extends Component {

  constructor (props) {

    super(props);

    this.state = {'searchQuery': this.props.query || ''};
    this.search = debounce(this.search,500);

  }

  static propTypes = {
  //  OnSearch: PropTypes.func.isRequired,
    'onSearchTextUpdate': PropTypes.func.isRequired
  }

  componentDidMount () {

    this.timer = setTimeout(() => {

      this.textInput.focus();

    }, 300);

  }
  searchChanged(e){
    this.setState({searchQuery:e});
    this.search(e)
  }

  search(searchQuery){

    // Const query = searchQuery.replace(/[^0-9]/g, '');

    this.props.onSearchTextUpdate(searchQuery);

  }
  componentWillUnmount () {

    clearTimeout(this.timer);

  }

  textInput = null;

  renderClearButton = () => <TouchableOpacity style={styles.clearButton}
    onPress={() => {

      this.setState({'searchQuery': ''});
      this.props.onSearchTextUpdate('');
      this.textInput.focus();

    }}><Icon
      name="ios-close"
      size={moderateScale(25)} color="white"

    /></TouchableOpacity>;

  render () {

    const {
      searchContainer,
      searchFieldContainer,
      searchField,
      searchInput,
      searchIcon,
      searchCriteriaContainer,
      searchCriteriaUnderline,
      searchCriteria
    } = styles;

    const anyFilters = plantSelectToggle || filterToggle;
    return (
      <View style={[searchContainer]}>
        { anyFilters
          ? <View style={searchCriteriaContainer}>
            {plantSelectToggle ? <View style={searchCriteriaUnderline}>
              <TextInput
                style={searchCriteria}
                placeholder="@Agotnes"
                placeholderTextColor={Colors.GRAY_3}
                underlineColorAndroid="rgba(0,0,0,0)"
              />
            </View> : null }
            {filterToggle ? <View style={searchCriteriaUnderline}>
              <TextInput
                style={searchCriteria}
                placeholder="Ends with"
                placeholderTextColor={Colors.GRAY_3}
                underlineColorAndroid="rgba(0,0,0,0)"
              />
            </View> : <View/> }
          </View>
          : null }
        <View style={searchFieldContainer} >
          <View style={searchField}>
            <View style={searchIcon} >
              <Icon name="ios-search" size={moderateScale(20)} color="white" />
            </View>

            <TextInput
              ref={(input) => {

                this.textInput = input;

              }}
              style={searchInput}
              placeholder="Type to search"
              tintColor="white"
              selectionColor={Colors.PINK_LIGHT}
              autoCorrect={false}
              onChangeText={this.searchChanged.bind(this)}
              blurOnSubmit
              onSubmitEditing={() => {

                /*
                 * Track(metricKeys.SEARCH_REQUEST);
                 * This.props.onSearch(this.state.searchQuery);
                 */
              }}
              value={this.state.searchQuery}
              placeholderTextColor={Colors.GRAY_3}
              keyboardType="numbers-and-punctuation"
              returnKeyType="search"
              underlineColorAndroid="rgba(0,0,0,0)"
            />
            {this.state.searchQuery.length ? this.renderClearButton() : <View/>}
          </View>
        </View>

      </View>
    );

  }

}

export default SearchBar;
