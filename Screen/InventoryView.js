import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import API from './Api';

const styles = StyleSheet.create({
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
    height: 125,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8 ,
    backgroundColor: '#E1FFFF',
  },
  width: {
    width: 70,
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
  },
});

export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      userId: null,
      loading: true,
      type: 1,
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
    }else{
      this.urlConfig = config.url;
    }
    await this.init();
  }

  async componentWillReceiveProps(props){
    await this.init();
  }

  async init(){
    let user;
    try {
      user = await global.storage.load({
        key: 'token'
      })
    } catch (e) {

    }
    if(!user){
      this.props.navigation.navigate('Login');
    }
    this.setState({userId: user.userId});
    const { userId } = user;
    const param = this.props.navigation.state;
    const { key } = param;
    let type;
    if(key === 'InventoryView'){
      type = 1;
    }
    if(key === 'CheckView'){
      type = 2;
    }
    if(key === 'MaintainView'){
      type = 3;
    }
    this.setState({ type });
    if(type === 3){
      return;
    }
    if (userId) {
      this.setState({ userId });
      let formData = new FormData();
      formData.append("userId",userId);
      const that = this;
      let url ;
      if(type === 1){
        url = this.urlConfig+API.location+"pandianPlanList";
      }
      if(type === 2){
        url = this.urlConfig+API.location+"xunjianPlanList";
      }
      fetch(url, {
        method: "POST",
        body: formData,
      }).then(function (res) {
        if (res.ok) {
          res.json().then(function (json) {
            if (json.success) {
              const { obj } = json;
              if(obj.planList){
                that.setState({data: obj.planList, loading: false});
              }
            } else if (json.msg) {
              Alert.alert('提示', json.msg, [{ text: '确定', onPress: () => console.warn(json) },]);
            }
          });
        } else {
          Alert.alert('提示', '请求失败', [{ text: '确定', onPress: () => console.warn('request failed! res=', res) },]);
        }
      }).catch(function (e) {
        console.error("fetch error!", e);
        Alert.alert('提示', '系统错误', [{ text: '确定', onPress: () => console.error('request error!') },]);
      });
    }else{
      this.props.navigation.navigate('Login');
    }
  }
  gotoItem(planId) {
    const { userId, type } = this.state;
    this.props.navigation.navigate('Scanner', { type, planId, userId });
  }

  render() {
    const { data, loading, type } = this.state;
    if (type === 3) {
      return (
        <View style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text>敬请期待！</Text>
        </View>
      );
    }
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F8F8FF' }}
      // onScroll={e => this.onScroll(e)}
      >
        {data ? data.map(i => (
          <TouchableOpacity onPress={() => this.gotoItem(i.id)} key={i.id}>
            <View style={styles.content}>
              <View style={{ flex: 1 }}>
                <View style={styles.list}>
                  <Text style={{ fontSize: 15, color: '#39333d',fontWeight:'bold' }}>
                    {i.name}
                  </Text>
                </View>
                <View style={styles.list}>
                  <Text style={{ fontSize: 15, color: '#39333d' }}>
                    开始时间：{i.startDate}
                  </Text>
                </View>
                <View style={styles.list}>
                  <Text style={{ fontSize: 15, color: '#39333d' }}>
                    结束时间：{i.endDate}
                  </Text>
                </View>
                <View style={styles.list}>
                  <Text style={{ fontSize: 15, color: '#39333d' }}>
                    {type === 1 ? '巡检进度' : (type === 2 ? '盘点进度' : '') }：

                  </Text>
                  <Text style={{ fontSize: 15, color: 'red' }}>
                  {i.finishedNum || '0'}
                  </Text>
                  <Text style={{ fontSize: 15, color: '#39333d' }}>
                  /
                  </Text>
                  <Text style={{ fontSize: 15, color: '#39333d' }}>
                  {i.totalNum || '0'}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )) : loading
        ? <Text style={[styles.opc, styles.width, styles.mgr_5, { fontSize: 15, color: '#39333d' }]}>
          正在加载...
          </Text>
        : <Text style={[styles.opc, styles.width, styles.mgr_5, { fontSize: 15, color: '#39333d' }]}>
          没有数据
          </Text>}
      </ScrollView>
    );
  }
}
