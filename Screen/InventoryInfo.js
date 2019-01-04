import React from 'react';
import {
    View, Text, Dimensions, StyleSheet, Image, ScrollView,
    BackHandler, TouchableOpacity, TextInput, ToastAndroid,
    Alert, KeyboardAvoidingView, Keyboard,
} from 'react-native';
import { Container, Header, Content, Form, Item, Picker } from 'native-base';
import API from './Api';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;

const style = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#E1FFFF',
    },
    pageContent: {
        paddingTop: 30,
    },
    f1: {
        flex: 1,
    },
    list: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 6,
    },
    icon: {
        width: 18, height: 18, marginRight: 16,
    },
    img: {
        position: 'absolute', top: 0, right: 0, width: 56, height: 56,
    },
    opc: {
        opacity: 1,
    },
    content: {
        minHeight: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        borderColor: '#ddd',
        backgroundColor: '#E1FFFF',
    },
    width: {
        width: 105,
    },
    loadMoreFooter: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -10,
    },
    mgr_5: {
        marginRight: 5,
        textAlign: 'right',
        fontWeight: 'bold'
    },
    btnStyle: {
        backgroundColor: '#3385ff', height: 45, width: SCREEN_WIDTH - 32, top: 150, position: 'absolute', margin: 16,
    },

    tag: {
        backgroundColor: '#fff',
        borderRadius: 5,
        minHeight: 22,
        padding: 10,
        marginRight: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#3385ff',
    },
    btnGray: {
        backgroundColor: '#ddd',
        borderRadius: 5,
        minHeight: 22,
        padding: 10,
        marginRight: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    btnPrimary: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    formInput: {
        borderRadius: 5,
        borderWidth: 1,
        height: 50,
        backgroundColor: '#fff',
    },

    container: {
        flex: 1,
        backgroundColor: '#E1FFFF',
        justifyContent: 'center',
        paddingHorizontal: 5,
        paddingTop: 0,
    },
    formInput: {
        height: 40,
        marginTop: 5,
        marginBottom: 5
    },
});

class InventoryInfo extends React.Component {
    constructor(props) {
        super(props);
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
        this.state = {
            code: null,
            userId: null,
            planId: null,
            type: null,
            itemId: null,
            itemInfo: null,
            loading: true,
            dict1: [],
            dict1Index: undefined,
            dict2: [],
            dict2Index: undefined,
            resultCode: null,
            remark: null,
            errorCode: null,
            position: null,
            submitSuccess: false,
            keyboardHeight: 0,
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
            this.urlConfig = 'http://111.198.65.223:8091';
        } else {
            this.urlConfig = config.url;
        }
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', event => this._keyboardDidShow(event));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this._keyboardDidHide());
        this.setState({ data: this.props.navigation.state.params });
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
        const paramData = this.props.navigation.state.params;
        const { data, userId, planId, type, itemInfo, itemId, dict1, dict2 } = paramData;
        this.setState({ code: data, userId, planId, type, itemInfo, itemId, dict1, dict2, });
        if (type === 2) {
            const dict = [
                {
                    typename: "合格",
                    typecode: "1"
                },
                {
                    typename: "不合格",
                    typecode: "2"
                },
            ];
            this.setState({ dict1: dict, });
        }
    }

    _keyboardDidShow(event) {
        this.setState({ keyboardHeight: event.endCoordinates.height });
    }

    _keyboardDidHide() {
        this.setState({ keyboardHeight: 0 });
    }

    onBackButtonPressAndroid = () => {
        const { type, userId } = this.state;
        if (type === 1) {
            this.props.navigation.navigate('InventoryView', { userId });
        } else if (type === 2) {
            this.props.navigation.navigate('CheckView', { userId });
        } else if (type === 3) {
            this.props.navigation.navigate('MaintainView', { userId });
        }
        return true;

    };

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();

    }

    onSubmit() {
        const { dict1Index, dict2Index, remark, position, userId, itemId, type } = this.state;
        console.log('dict1Index', dict1Index, dict2Index);
        if (dict1Index === undefined) {
            if(type===1){
                Alert.alert('提示', "请选择盘点结果！", [{
                    text: '确定',
                    onPress: () => console.log("请选择盘点结果！")
                },]);
            }else{
                Alert.alert('提示', "请选择巡检结果！", [{
                    text: '确定',
                    onPress: () => console.log("请选择巡检结果！")
                },]);
            }
            return;
        }
        if(type === 1 && dict2Index === undefined){
            Alert.alert('提示', "请选择盘点位置！", [{
                text: '确定',
                onPress: () => console.log("请选择盘点位置！")
            },]);
            return;
        }
        if (dict1Index == 0 && type === 2 && dict2Index === undefined) {
            Alert.alert('提示', "请选择设备位置说明！", [{
                text: '确定',
                onPress: () => console.log("请选择设备位置说明！")
            },]);
            return;
        }
        let formData = new FormData();
        let url;
        if (type === 2) {
            url = this.urlConfig + API.location + "xunjianSubmit";
            formData.append("userId", userId);
            formData.append("itemId", itemId);
            formData.append("result", dict1Index);
            formData.append("report", remark);
            formData.append("position", position);
        }
        if (type === 1) {
            url = this.urlConfig + API.location + "pandianSubmit";
            formData.append("userId", userId);
            formData.append("itemId", itemId);
            formData.append("report", dict1Index);
            formData.append("position", dict2Index);
        }
        const that = this;
        fetch(url, {
            method: "POST",
            body: formData,
        }).then(function (res) {
            if (res.ok) {
                res.json().then(function (json) {
                    if (json.success) {
                        Alert.alert('提示', json.msg, [{
                            text: '确定',
                            onPress: () => that.onBackButtonPressAndroid()
                        },]);
                    } else if (json.msg) {
                        Alert.alert('提示', json.msg, [{
                            text: '确定',
                            onPress: () => console.warn('request fail ! res=', json)
                        },]);
                    }
                });
            } else {
                Alert.alert('提示', '请求失败', [{ text: '确定', onPress: () => console.warn('request failed! res=', res) },]);
            }
        }).catch(function (e) {
            console.error("fetch error!", e);
            Alert.alert('提示', '系统错误', [{ text: '确定', onPress: () => console.error('request error!') },]);
        });
    }

    onValueChange1(value) {
        this.setState({
            dict1Index: value
        });
    }
    onValueChange2(value) {
        this.setState({
            dict2Index: value
        });
    }

    render() {
        const sty = style;
        const { itemInfo, dict1, dict1Index,
            dict2, dict2Index, type,} = this.state;
        return (
            <View style={[sty.page, sty.pageContent, { paddingBottom: this.state.keyboardHeight }]}>
                <ScrollView ref={(ref) => { this.scrollView = ref; }}
                    style={sty.f1}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                >
                    <View style={sty.content}>
                        <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                            设备名称：
                        </Text>
                        <View style={[{ flex: 1 }, sty.list]}>
                            <Text style={{ fontSize: 15, color: '#39333d' }}>
                                {itemInfo ? itemInfo.name : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={sty.content}>
                        <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                            资产类型：
                        </Text>
                        <View style={[{ flex: 1 }, sty.list]}>
                            <Text style={{ fontSize: 15, color: '#39333d' }}>
                                {itemInfo ? itemInfo.deviceType : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={sty.content}>
                        <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                            院内资产编码：
                        </Text>
                        <View style={[{ flex: 1 }, sty.list]}>
                            <Text style={{ fontSize: 15, color: '#39333d' }}>
                                {itemInfo ? itemInfo.code : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={sty.content}>
                        <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                            所属科室：
                        </Text>
                        <View style={[{ flex: 1 }, sty.list]}>
                            <Text style={{ fontSize: 15, color: '#39333d' }}>
                                {itemInfo ? itemInfo.dept : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={sty.content}>
                        <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                            规格型号：
                        </Text>
                        <View style={[{ flex: 1 }, sty.list]}>
                            <Text style={{ fontSize: 15, color: '#39333d' }}>
                                {itemInfo ? itemInfo.format : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={sty.content}>
                        <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                            品牌：
                        </Text>
                        <View style={[{ flex: 1 }, sty.list]}>
                            <Text style={{ fontSize: 15, color: '#39333d' }}>
                                {itemInfo ? itemInfo.brand : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={sty.content}>
                        <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                            供应商：
                        </Text>
                        <View style={[{ flex: 1 }, sty.list]}>
                            <Text style={{ fontSize: 15, color: '#39333d' }}>
                                {itemInfo ? itemInfo.supplier : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={sty.content}>
                        <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                            安装日期：
                        </Text>
                        <View style={[{ flex: 1 }, sty.list]}>
                            <Text style={{ fontSize: 15, color: '#39333d' }}>
                                {itemInfo ? itemInfo.installDate : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={sty.content}>
                        <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                            设备序列号：
                        </Text>
                        <View style={[{ flex: 1 }, sty.list]}>
                            <Text style={{ fontSize: 15, color: '#39333d' }}>
                                {''}
                            </Text>
                        </View>
                    </View>
                    <View style={[sty.content]}>
                        <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                            设备保管人：
                        </Text>
                        <View style={[{ flex: 1 }, sty.list]}>
                            <Text style={{ fontSize: 15, color: '#39333d' }}>
                                {itemInfo ? itemInfo.manager : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={[sty.content, { borderBottomColor: '#003333', borderBottomWidth: 1, paddingBottom: 15 }]}>
                        <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                            是否计量设备：
                        </Text>
                        <View style={[{ flex: 1 }, sty.list]}>
                            <Text style={{ fontSize: 15, color: '#39333d' }}>
                                {itemInfo ? itemInfo.isMeasurement : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={sty.content}>
                        <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                            {type === 1 ? '盘点结果': '巡检结果'}
                        </Text>
                        <View style={[{ flex: 1, width: SCREEN_WIDTH - 120, flexWrap: 'wrap' }, sty.list]}>
                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    style={{ width: undefined }}
                                    placeholder={'请选择'+(type === 1 ? '盘点结果': '巡检结果')}
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    backgroundColor="#fff"
                                    selectedValue={dict1Index}
                                    onValueChange={this.onValueChange1.bind(this)}
                                >
                                    <Picker.Item label={'请选择'+(type === 1 ? '盘点结果': '巡检结果')} value="" style={{ color: "#007aff", fontSize: 25 }} />
                                    {dict1.map(i => (
                                        <Picker.Item label={i.typename} value={i.typecode} />
                                    ))}
                                </Picker>
                            </Item>
                        </View>
                    </View>
                    {type === 2 ?
                        <View style={sty.content}>
                            <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                                巡检位置：
                        </Text>
                            <View style={[{ flex: 1 }, sty.list]}>
                                <Item picker>
                                    <KeyboardAvoidingView behavior="padding" style={sty.container}>
                                        <TextInput
                                            placeholder="请输入巡检位置"
                                            style={sty.formInput}
                                            onChangeText={(text) => {
                                                this.setState({ position: text });
                                            }}
                                        />
                                    </KeyboardAvoidingView>
                                </Item>
                            </View>
                        </View>
                        : null}
                    {type === 1?
                        <View style={sty.content}>
                            <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                                盘点位置：
                        </Text>
                            <View style={[{ flex: 1, width: SCREEN_WIDTH - 120, flexWrap: 'wrap' }, sty.list]}>
                                <Item picker>
                                    <Picker
                                        mode="dropdown"
                                        style={{ width: undefined }}
                                        placeholder="请选择盘点位置"
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        backgroundColor="#fff"
                                        selectedValue={dict2Index}
                                        onValueChange={this.onValueChange2.bind(this)}
                                    >
                                        <Picker.Item label="请选择盘点位置" value="" style={{ color: "#007aff", fontSize: 25 }} />
                                        {dict2.map(i => (
                                            <Picker.Item label={i.typename} value={i.typecode} />
                                        ))}
                                    </Picker>
                                </Item>
                            </View>
                        </View>
                        : null}
                    {type === 2 ?
                        <View style={[sty.content]}>
                            <Text style={[sty.opc, sty.width, sty.mgr_5, { fontSize: 15, color: '#39333d' }]}>
                                备注：
                        </Text>
                            <View style={[{ flex: 1 }, sty.list]}>
                                <Item picker>
                                    <KeyboardAvoidingView behavior="padding" style={sty.container}>
                                        <TextInput
                                            placeholder="请输入备注"
                                            style={sty.formInput}
                                            onChangeText={(text) => {
                                                this.setState({ remark: text });
                                            }}
                                        />
                                    </KeyboardAvoidingView>
                                </Item>
                            </View>
                        </View>
                    : null}
                    <View style={[sty.content, { justifyContent: 'center' }]}>
                        <TouchableOpacity onPress={() => this.onSubmit()}>
                            <View style={[sty.tag, { backgroundColor: '#3385ff' }, sty.btnPrimary]}>
                                <Text style={{ fontSize: 15, color: '#39333d' }}>
                                    提交
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onBackButtonPressAndroid()}>
                            <View style={[sty.tag, { backgroundColor: '#3385ff' }, sty.btnPrimary]}>
                                <Text style={{ fontSize: 15, color: '#39333d' }}>
                                    取消
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

}


export default InventoryInfo;
