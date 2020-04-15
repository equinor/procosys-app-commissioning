import { NavigationActions } from 'react-navigation';

let _navigator;

/**
 * Set which top-level navigator to use when dispatching actions
 *
 * @param {*} navigatorRef - React Component Reference
 */
function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  if (!_navigator) throw new Error('Missing reference to Navigator');
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

function getCurrentRouteKey() {
  if (!_navigator) throw new Error('Missing reference to Navigator');
  let {index, routes} = _navigator.state.nav;
  return routes[index].key;
}

export default { navigate, setTopLevelNavigator, getCurrentRouteKey };
