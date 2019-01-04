import React from 'react';
import {
    StyleSheet, Text, View, Dimensions, TextInput, Alert, AsyncStorage,
} from 'react-native';
import ButtonView from './ButtonView';
import API from './Api';
import Storage from 'react-native-storage';

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24 * 7,
    defaultExpires: null,
    enableCache: true,
})
// 全局变量
global.storage = storage

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            configUrl: "",
        };
    }

    async componentDidMount() {
        let config;
        try {
            config = await global.storage.load({
                key: 'config'
            });
        } catch (e) {

        }
        if (!config) {
            global.storage.save({
                key: 'config',
                data: { url: 'http://111.198.65.223:8091' },
                expires: null
            });
            this.setState({ configUrl: 'http://111.198.65.223:8091' });
        } else {
            this.setState({ configUrl: config.url });
        }
    }

    _onClickConfig = async () => {
        const { configUrl, userPW } = this.state;
        if (!configUrl) {
            Alert.alert('提示', '请输入URL！', [{ text: '确定', onPress: () => console.log('configUrl is null') },]);
            return;
        }
        global.storage.save({
            key: 'config',
            data: { url: configUrl },
            expires: null
        });
        this.props.navigation.navigate('Login');
    };

    _onClickCancel = async () => {
        this.props.navigation.navigate('Login');
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.lineStyle, { top: 0 }]} />
                <View style={styles.BGViewStyle}>
                    <View style={[styles.inputCellStyle, { height: 49.75, top: 0, right: 0, }]}>
                        <Text style={styles.welcome}>
                            URL
            </Text>
                        <TextInput style={styles.inputViewStyle}
                            onChangeText={(text) => {
                                this.setState({ configUrl: text });
                            }}
                            placeholder="请输入URL"
                            autoFocus={true}
                            value={this.state.configUrl}
                        />
                    </View>

                </View>
                <ButtonView
                    btnName='确定'
                    btnStyle={styles.loginBtnStyle}
                    onPress={this._onClickConfig}
                />
                <ButtonView
                    btnName='取消'
                    btnStyle={styles.cancelBtnStyle}
                    onPress={this._onClickCancel}
                />

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        flexDirection: 'column',
    },
    BGViewStyle: {
        position: 'absolute',
        top: 150,
        left: 0,
        right: 0,
        height: 50,
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    inputCellStyle: {
        left: 0, backgroundColor: 'white', flexDirection: 'row', position: 'absolute', alignItems: 'center',
    },
    lineStyle: {
        height: 0.5, backgroundColor: '#D6D6D6', position: 'absolute', left: 0, right: 0
    },
    inputViewStyle: {
        height: 49.5, right: 0, left: 80, top: 0, borderColor: 'white', borderWidth: 1, position: 'absolute'
    },
    loginBtnStyle: {
        backgroundColor: '#3385ff', height: 45, width: SCREEN_WIDTH - 32, top: 200, position: 'absolute', margin: 16,
    },
    cancelBtnStyle: {
        backgroundColor: '#3385ff', height: 45, width: SCREEN_WIDTH - 32, top: 250, position: 'absolute', margin: 16,
    },
    forgetPWStyle: {
        margin: 16,
        position: 'absolute',
        right: 0,
        top: 310,
        width: 150,
        height: 30,
        alignItems: 'flex-end',
        backgroundColor: '#F5FCFF',
    },
    SIMBtnStyle: {
        position: 'absolute',
        top: 260,
        height: 30,
        width: SCREEN_WIDTH - 32,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 14,
        textAlign: 'left',
        margin: 10,
        height: 16.5,
        width: 100,
    },
});
