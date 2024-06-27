import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Animated, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../src/ThemeContext';
import { getData } from '../../utils/services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Success from '../modal/success';

const Conversion = () => {
  const [wallet, setWallet] = useState([]);
  const [selectedSourceWallet, setSelectedSourceWallet] = useState('');
  const [selectedSourceBalance, setSelectedSourceBalance] = useState('');
  const [selectedSourceSymbole, setSelectedSourceSymbole] = useState('');
  const [selectedTargetWallet, setSelectedTargetWallet] = useState('');
  const [selectedTargetBalance, setSelectedTargetBalance] = useState('');
  const [selectedTargetSymbole, setSelectedTargetSymbole] = useState('');
  const [selectedSourceIdWallet, setSelectedSourceIdWallet] = useState('');
  const [selectedTargetIdWallet, setSelectedTargetIdWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [amountTarget, setAmountTarget] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const { theme } = useTheme();

  const getWallet = async () => {
    try {
      const resp = await getData('userWallet');
      setWallet(resp);
      if (resp.length > 0) {
        setSelectedSourceWallet(resp[0].nomWallet);
        setSelectedTargetWallet(resp[0].nomWallet); // Optional: Set a default target wallet as well
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (selectedSourceWallet) {
      const sourceWallet = wallet.find(walletItem => walletItem.nomWallet === selectedSourceWallet);
      setSelectedSourceBalance(sourceWallet ? sourceWallet.soldeWallet : '');
      setSelectedSourceSymbole(sourceWallet ? sourceWallet.symbole : '');
      setSelectedSourceIdWallet(sourceWallet ? sourceWallet.idWallet : '');
    }
  }, [selectedSourceWallet, wallet]);

  useEffect(() => {
    if (selectedTargetWallet) {
      const targetWallet = wallet.find(walletItem => walletItem.nomWallet === selectedTargetWallet);
      setSelectedTargetBalance(targetWallet ? targetWallet.soldeWallet : '');
      setSelectedTargetSymbole(targetWallet ? targetWallet.symbole : '');
      setSelectedTargetIdWallet(targetWallet ? targetWallet.idWallet : '');
    }
  }, [selectedTargetWallet, wallet]);

  // Create the animated value
  const blinkAnim = useRef(new Animated.Value(1)).current;

  // Function to start the blinking animation
  const startBlinking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Start the blinking animation when the component mounts
  useEffect(() => {
    startBlinking();
  }, []);

  const handleConversion = () => {
    const uniqueIdUsers = [...new Set(wallet.map(wallets => wallets.idUser))];
  
    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (`0${d.getMonth() + 1}`).slice(-2);
      const day = (`0${d.getDate()}`).slice(-2);
      return `${year}-${month}-${day}`;
    };
  
    const data = {
      amountM: amountTarget,
      amountP: amount,
      idWalletM: selectedSourceIdWallet,
      idWalletP: selectedTargetIdWallet,
      idUser: uniqueIdUsers[0],
      dateDeTransaction: formatDate(new Date()) // Format date
    };
  
    fetch('http://192.168.1.103:5500/handleConversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setModalVisible(true);
    })
    .catch(error => console.error('Error:', error));
  };
  
  return (
    <View className="p-4">
      {/* -----------------Source Wallet----------------- */}
      <View className="bg-blue-600 rounded-xl p-4 w-80 h-40 shadow-lg mb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-xl font-semibold">Source</Text>
          <Picker
            selectedValue={selectedSourceWallet}
            onValueChange={(itemValue) => setSelectedSourceWallet(itemValue)}
            style={{ height: 50, width: 150, color: 'white' }}
          >
            {wallet.map((walletItem) => (
              <Picker.Item
                key={walletItem.idWallet}
                label={walletItem.nomWallet}
                value={walletItem.nomWallet}
                style={{ fontSize: 20 }}
              />
            ))}
          </Picker>
        </View>
        <View className="flex-row justify-between mt-4">
          <Text className="text-white text-lg">Your Balance</Text>
          <Text className="text-white text-lg">{selectedSourceBalance} {selectedSourceSymbole}</Text>
        </View>
        <View className="mt-2 flex-row justify-between">
          <Text className="text-white text-lg">Montant</Text>
          <View className="flex-row justify-end items-end">
            <TextInput
              value={amount}
              onChangeText={(text) => setAmount(text)}
              keyboardType="numeric"
              className="text-white text-lg border-b border-white w-1/2 text-right"
            />
            <Text className="text-white text-lg">{selectedSourceSymbole}</Text>
          </View>
        </View>
      </View>

      <View className="flex justify-center items-center mb-4">
        <Animated.View style={{ opacity: blinkAnim }}>
          <AntDesign name="arrowdown" size={32} color="white" />
        </Animated.View>
      </View>

      {/* -----------------Target Wallet----------------- */}
      <View className="bg-green-600 rounded-xl p-4 w-80 h-40 shadow-lg">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-xl font-semibold">Vers</Text>
          <Picker
            selectedValue={selectedTargetWallet}
            onValueChange={(itemValue) => setSelectedTargetWallet(itemValue)}
            style={{ height: 50, width: 150, color: 'white' }}
          >
            {wallet.map((walletItem) => (
              <Picker.Item
                key={walletItem.idWallet}
                label={walletItem.nomWallet}
                value={walletItem.nomWallet}
                style={{ fontSize: 20 }}
              />
            ))}
          </Picker>
        </View>
        <View className="flex-row justify-between mt-4">
          <Text className="text-white text-lg">Current Balance</Text>
          <Text className="text-white text-lg">{selectedTargetBalance} {selectedTargetSymbole}</Text>
        </View>
        <View className="mt-2 flex-row justify-between">
          <Text className="text-white text-lg">Montant</Text>
          <View className="flex-row justify-end items-end">
            <TextInput
              value={amountTarget}
              onChangeText={(text) => setAmountTarget(text)}
              keyboardType="numeric"
              className="text-white text-lg border-b border-white w-1/2 text-right"
            />
            <Text className="text-white text-lg">{selectedTargetSymbole}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        className="bg-sapphire-600 flex justify-center items-center m-4 mx-20 p-3 rounded 2xl"
        onPress={handleConversion}>
        <Text className={`flex text-white text-lg`}>Convertir</Text>
      </TouchableOpacity>
      <Success visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default Conversion;
