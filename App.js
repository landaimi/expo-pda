import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import Login from './Screen/Login';
import Home from './Screen/Home';
import BarcodeScannerView from './Screen/BarcodeScannerView';
import InventoryInfo from './Screen/InventoryInfo';
import Config from './Screen/Config';

const TabNavigator = createSwitchNavigator({
  Login: {
    screen: Login,
  },
  Home: {
    screen: Home,
  },
  Scanner: {
    screen: BarcodeScannerView,
  },
  InventoryInfo: {
    screen: InventoryInfo,
  },
  Config: {
    screen: Config,
  },
});

export default createAppContainer(TabNavigator);
