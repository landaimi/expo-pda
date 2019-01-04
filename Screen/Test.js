import React from 'react';
import { StyleSheet, Text, View, AppRegistry,Alert  } from 'react-native';
export default class Test extends React.Component {
  constructor(props){
    super(props);
    this.state={barCode: null}
  }

  componentWillMount() {
    const that = this;

  }

  render() {
    const{barCode} = this.state;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {barCode}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
