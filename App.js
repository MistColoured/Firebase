/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Text, View, FlatList, TouchableHighlight, YellowBox } from 'react-native';
import { SearchBar } from "react-native-elements";
import Swipeout from 'react-native-swipeout';
import _ from 'lodash'

import firebase, { auth, provider } from './components/firebase';
import Todo from './components/Todo'
import styles from './components/style';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class App extends Component {
  state = {
    todoList: [],
    todo: '',
    loading: false,
    // user: null,
    user: { uid: '2QfgNSNHwGQi1W53lYORVmn65l53' },
    error: null,
    embedLevel: '',
  }
  componentDidMount = () => {
    this.listenForItems()
  }

  listenForItems = () => {
    const { user, embedLevel } = this.state
    const todoRef = firebase.database().ref(`users/${user.uid}/todoList/${embedLevel}`);

    this.setState({ loading: true })
    todoRef.on('value', (snapshot) => {
      const newState = [];
      if (snapshot.exists()) {
        const items = snapshot.val();
        Object.entries(items).forEach(([key, val]) => {
          newState.push({
            todo: val.todo,
            _key: key,
          });
        });
      }
      this.setState({
        todoList: newState,
        loading: false,
      });
    });
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          width: "100%",
          backgroundColor: "#fff",
          // marginLeft: "14%"
        }}
      />
    );
  };

  renderHeader = () => {
    return <SearchBar placeholder="Type Here..." lightTheme round />;
  };

  renderFooter = () => {
    if (this.state.loading) return null;

    return (
      <View>
        <TouchableHighlight
          style={styles.redButton}
          underlayColor={'#ff0066'}
          onPress={() => this.backOneLevel()}
        >
          <Text
            style={styles.myText}>
            Up One Level
              </Text>
        </TouchableHighlight>
        {/* <ActivityIndicator animating size="large" /> */}
      </View>
    );
  };

  onTodoPress = (_key) => {
    const { embedLevel } = this.state;
    this.setState({
      embedLevel: embedLevel.concat('/', _key),
    },
      () => this.listenForItems());
    console.log('Button pressed', _key)
  }

  backOneLevel = () => {
    const { embedLevel } = this.state;
    if (embedLevel === '') { return; }
    console.log('Up level');
    const re = /.*(?=\/)/;
    this.setState({
      embedLevel: embedLevel.match(re)[0],
    },
      () => this.listenForItems());
  }

  render() {
    const { todoList } = this.state;
    const swipeSettings = {
      autoClose: true,
      right: [
        {
          onPress: () => {
            alert.alert(
              'Alert',
              'Are you sure?',
              [
                { text: 'No', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () => console.log('Yes!!'), style: 'cancel' }
              ],
              { cancelable: true }
            )
          }
        }
      ]
    }
    return (

      <View>
        <FlatList
          data={todoList}
          renderItem={({ item }) => {
            console.log(item)
            if (!item.todo) { return null; }
            else {
              return (
                <Swipeout {...swipeSettings}>
                  <TouchableHighlight
                    style={styles.button}
                    underlayColor={'#00cc55'}
                    onPress={() => { this.onTodoPress(item._key) }}
                  >
                    <Text
                      style={styles.myText}>
                      {item.todo}
                    </Text>
                  </TouchableHighlight>
                </Swipeout>
              )
            }
          }}
          keyExtractor={item => item._key}
          // ItemSeparatorComponent={this.renderSeparator}
          // ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }
}


