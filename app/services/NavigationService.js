import { NavigationActions, StackActions } from 'react-navigation';
import * as actions from '../actions';


let _container; // eslint-disable-line
let _inPlay = false;

function setContainer(container) {
  _container = container;
}

function reset(routeName, params) { // Adds a delay just in case reset is fired all over the place
  console.log('Navigating: ', _container);
  if (_inPlay == false){
      _inPlay = true;
      setTimeout(() => {_container.dispatch(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              type: 'Navigation/NAVIGATE',
              routeName,
              params,
            }),
          ],
        }),
      );

      _inPlay = false;
    }, 200)
  }
}

function navigate(routeName, params) {
  _container.dispatch(
    NavigationActions.navigate({
      type: 'Navigation/NAVIGATE',
      routeName,
      params,
    }),
  );
}

function navigateDeep(actions) {
  _container.dispatch(
    actions.reduceRight(
      (prevAction, action) =>
        NavigationActions.navigate({
          type: 'Navigation/NAVIGATE',
          routeName: action.routeName,
          params: action.params,
          action: prevAction,
        }),
      undefined,
    ),
  );
}

function getCurrentRoute() {
  if (!_container || !_container.state.nav) {
    return null;
  }

  return _container.state.nav.routes[_container.state.nav.index] || null;
}

export default {
  setContainer,
  navigateDeep,
  navigate,
  reset,
  getCurrentRoute,
};
