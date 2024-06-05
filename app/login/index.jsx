import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import axios from 'axios';
import { storeData, getData } from '../../utils/services';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [dataUser, setDataUser] = useState('');
  const [toggleLogout, setToggleLogout] = useState(false);
  const [toggleLogin, setToggleLogin] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      const user = await getData('dataUser');
      if (user) {
        setDataUser(user);
        setToggleLogout(true);
        setToggleLogin(false);
      }
    };
    getToken();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.103:5500/login', { email, password });
      storeData('dataUser', response.data);
      setDataUser(response.data);
      setToggleLogout(true);
      setToggleLogin(false);
      setError('');
      router.replace('/');
    } catch (err) {
      console.log(err);
      setError('Erreur de Connection, Verifier l\'email et le mot de passe');
    }
  };

  const handleLogout = async () => {
    try {
      await storeData('dataUser', null);
      setDataUser(null);
      setToggleLogout(false);
      setToggleLogin(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} className="bg-transparent">
      <ImageBackground
        source={require('../../assets/scrolling-gradient.webp')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.innerContainer} className="mt-20 flex-1">
          <View className="pt-20 rounded-tr-2xl rounded-tl-2xl -mt-10">
            <View className="flex justify-center items-center -mt-10">
              <Image className="w-20 h-20 rounded-2xl" source={require('../../assets/logo.jpg')} />
            </View>
            <View className="flex justify-center items-center mb-5">
              <Text className="text-[30px] text-white" style={styles.font}>Login</Text>
            </View>
            <Text className="mx-20 font-semibold text-white mb-4" style={styles.font}>Email</Text>
            <TextInput
              className="flex justify-start text-start bg-white p-2 mx-20 mb-5 rounded-md"
              style={styles.font}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <Text className="mx-20 font-semibold text-white mb-4" style={styles.font}>Mot de Passe</Text>
            <TextInput
              className="flex justify-start text-start bg-white p-2 mx-20 mb-5 rounded-md"
              style={styles.font}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {toggleLogin && (
              <TouchableOpacity className="bg-cyan-800 mx-20 mt-5 p-3 rounded-3xl" onPress={handleLogin}>
                <Text className="text-white text-xl text-center" style={styles.font}>Se connecter</Text>
              </TouchableOpacity>
            )}
            {error && <Text className="mx-20 mt-2 text-red-500" style={styles.font}>{error}</Text>}
            {dataUser && <Text className="mx-20 mt-2 text-green-500" style={styles.font}>Vous êtes connecté en tant que : {dataUser.username}</Text>}
          </View>
          {toggleLogout && (
            <TouchableOpacity className="bg-blue-500 p-3 rounded-xl absolute right-0 top-0 m-5" onPress={handleLogout}>
              <Text className="text-white text-xl text-center" style={styles.font}>Se Deconnecter</Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    width: width,
    height: height,
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  font: {
    fontFamily: 'Prompt-Regular',
  },
});

export default Login;
