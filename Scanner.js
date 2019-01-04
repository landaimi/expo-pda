import EventEmitter from 'events';
import { AppRegistry } from 'react-native';
const scannerEvent = new EventEmitter();

export default scannerEvent;

AppRegistry.registerHeadlessTask('ScanBarCodeTaskService', () => async (data) => {
    scannerEvent.emit('scanned', data);
});
