import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableHighlight,
  NativeModules,
} from 'react-native';

import Sodium from 'react-native-sodium';

export default class App extends Component {
  state = {
    nonce: '',
    public_encrypt_key: '',
    encryptedData: '',
    decryptedResult: '',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  _testBox1() {
    Sodium.crypto_box_keypair().then(alice => {
      console.log('my encrypted public key is', alice.pk);
      this.setState({public_encrypt_key: alice.pk});
      Sodium.randombytes_buf(Sodium.crypto_box_NONCEBYTES).then(nonce => {
        this.setState({
          nonce,
        });
        console.log('my nonce is here', nonce);
        Sodium.crypto_box_easy('Helo word', nonce, alice.pk, alice.sk)
          .then(encrypted => {
            this.setState({
              encryptedData: encrypted,
            });
            console.log('my encrypted data is here', encrypted);
            return Sodium.crypto_box_open_easy(
              encrypted,
              nonce,
              alice.pk,
              alice.sk,
            );
          })
          .then(dceypt => {
            this.setState({decryptedResult: dceypt});
            console.log('my decrypted data is', dceypt);
          });
      });
    });
  }

  _testSodium() {
    this._testBox1();
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <TouchableHighlight onPress={() => this._testSodium()}>
          <Text style={styles.welcome}>Encrypt Hello World</Text>
        </TouchableHighlight>

        <View>
          <Text>
            My public encrypted key is : {this.state.public_encrypt_key}
          </Text>
          <Text>Nonce used is here : {this.state.nonce}</Text>
          <Text> Encrypted data is here : {this.state.encryptedData}</Text>
          <Text>Decrypt Result is : {this.state.decryptedResult}</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
