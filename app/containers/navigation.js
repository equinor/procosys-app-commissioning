import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, NavigationActions } from 'react-navigation';
import LoginPage from '../components/pages/LoginPage';
import LogoutPage from '../components/pages/LogoutPage';
import DefaultPage from '../components/pages/DefaultPage';
import SettingsPage from '../components/pages/Settings';
import AboutPage from '../components/pages/AboutPage';
import SearchPage from '../components/pages/SearchPage';
import SelectPlantPage from '../components/pages/SelectPlantPage';
import SelectProjectPage from '../components/pages/SelectProjectPage';
import Package from '../components/pages/Package';
import ScopeItem from '../components/pages/ScopeItem';
import PunchItem from '../components/pages/PunchItem';
import TaskItem from '../components/pages/TaskItem';

const commonOptions = {
  gesturesEnabled: false,
  headerTitleStyle: {
    color: 'white',
    padding: 15,
  },
  headerStyle: {
    backgroundColor: '#323232',
  },
  headerBackTitle: 'Back',
  headerBackTitleStyle: {
    color: 'white',
    paddingRight: 20
  },
  headerTintColor: 'white',

}

const MainRoute = createStackNavigator({
  DefaultRoute: { screen: DefaultPage },
  SearchRoute: { screen: SearchPage },
  PackageRoute: { screen: Package },
  ScopeRoute: { screen: ScopeItem },
  PunchRoute: { screen: PunchItem },
  TaskRoute: { screen: TaskItem },

  SettingsRoute: { screen: SettingsPage },
  PlantRoute: { screen: SelectPlantPage },
  ProjectRoute: { screen: SelectProjectPage },
  AboutRoute: { screen: AboutPage },
},
  {
    navigationOptions: {
      // gesturesEnabled: false,
      ...commonOptions
    },
  }
);

const App = createAppContainer(createStackNavigator({
    MainRoute: { screen: MainRoute },
    LogoutRoute: {screen: LogoutPage },
    LoginRoute: { screen: LoginPage },
  },
  {
    navigationOptions: {
      gesturesEnabled: false,
    },
    headerMode: 'none',
    animationEnabled: true,
    lazy: false,
    initialRouteName: 'LoginRoute',
  }
));

export default App;

const navigateOnce = (getStateForAction) => (action, state) => {
  const { type, routeName } = action;
  return (
    state &&
    type === NavigationActions.NAVIGATE &&
    routeName === state.routes[state.routes.length - 1].routeName
  ) ? state : getStateForAction(action, state);
  // you might want to replace 'null' with 'state' if you're using redux (see comments below)
};

App.router.getStateForAction = navigateOnce(App.router.getStateForAction);
MainRoute.router.getStateForAction = navigateOnce(MainRoute.router.getStateForAction);
