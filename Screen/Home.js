import { createStackNavigator, createMaterialTopTabNavigator,
  Text,View,Platform } from 'react-navigation'; // 1.0.0-beta.27
import InventoryView from './InventoryView';

const HomeScreen = createMaterialTopTabNavigator(
  {
    InventoryView: {
      screen: InventoryView,
      navigationOptions: () => ({
        title: "设备盘点",
        tabBarOnPress: (obj) =>{
          const {navigation} = obj;
          navigation.navigate(navigation.state.key,{init: true});
        },
      }),

    },
    CheckView: {
      screen: InventoryView,
      navigationOptions: () => ({
        title: '设备巡检',
        tabBarOnPress: (obj) =>{
          const {navigation} = obj;
          navigation.navigate(navigation.state.key,{init: true});
        },
      }),
    },
    MaintainView: {
      screen: InventoryView,
      navigationOptions: () => ({
        title: '设备保养',
        tabBarOnPress: (obj) => {
          const { navigation } = obj;
          navigation.navigate(navigation.state.key, { init: true });
        },
      }),
    },
  },{
    lazy: true,
    optimizationsEnabled: true,
    showLabel: true,
  }
);


const MainStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    }
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#29aae3',
        height: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);


export default  RootStack;

// const styles = StyleSheet.create({
//   tabBarImage: {
//       width: 24,
//       height: 24,
//   },
//   tabBar: {
//       backgroundColor: 'white',
//   },
//   tabBarLabel: {
//       fontSize: 12,
//   },
//   tabBarItem: {
//       height: 56,
//   },
// })
