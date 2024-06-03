import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Image, TouchableOpacity, KeyboardAvoidingView, StyleSheet, Platform, ScrollView } from 'react-native';
import axios from 'axios';
import { storeData, getData } from './../../utils/services';
import { useRouter } from 'expo-router';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [dataUser, setDataUser] = useState('');
    const [toogleLogout, setToogleLogout] = useState(false)
    const [toogleLogin, setToogleLogin] = useState(true)

    const router = useRouter();
    useEffect(() => {
        const getToken = async () => {
            const dataUser = await getData('dataUser');
        };
        getToken();
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`http://192.168.1.103:5500/login`, { email, password });
            storeData('dataUser', response.data);
            setDataUser(response.data);
            setToogleLogout(true);
            setToogleLogin(false);
            setError(null);
            router.replace('/');
            // Stockez le token et redirigez l'utilisateur
        } catch (err) {
            console.log(err);
            setError(`Erreur de Connection, Verifier l'email et le mot de passe`, err);
        }
    };

    const handleLogout = async () => {
        try {
            await storeData('dataUser', null);
            setDataUser(null);
            setToogleLogout(false);
            setToogleLogin(true)

        } catch (err) {
            console.error(err);
        }
    };



    return (


    <ScrollView className="bg-white">
        <View behavior="height" style={styles.container} className="bg-white">

            <View className="">
                <Image className="w-full h-[400px]"
                    source={require('../../assets/login-cover.jpg')}
                />
            </View>

            <View className="pt-20 rounded-tr-2xl rounded-tl-2xl -mt-10 bg-white ">
                <View className="flex justify-center items-center -mt-10">
                    <Image className="w-20 h-20 rounded-2xl"
                        source={require('../../assets/logo.jpg')}
                    />
                </View>
                <View className="flex justify-center items-center mb-5">
                    <Text className="text-[30px] text-slate-900">Login</Text>
                </View>
            
                <Text className="mx-20 font-semibold ">Email</Text>
                    <TextInput
                        className="flex justify-start text-start bg-white shadow-md shadow-slate-500 p-2 mx-20 mb-5 rounded-md"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                <Text className="mx-20 font-semibold ">Mot de Passe</Text>
                <TextInput
                    className="flex justify-start text-start bg-white shadow-md shadow-slate-500 p-2 mx-20 mb-5 rounded-md"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            {toogleLogin ?
                <TouchableOpacity className="bg-blue-500 mx-20 mt-5 p-3 rounded-xl"
                onPress={handleLogin}>
                    <Text className="text-white text-xl text-center">Se connecter</Text>
                </TouchableOpacity> : null}
            {error ? <Text>{error}</Text> : null}
            {dataUser ? <Text>Vous êtes connecté entant que : {dataUser.username}</Text> : null}

            

        </View>{toogleLogout ? <TouchableOpacity className="bg-blue-500 p-3 rounded-xl absolute right-0 top-0 m-5"
                onPress={handleLogout}>
                    <Text className="text-white text-xl text-center">Se Deconnecter</Text>
                </TouchableOpacity> : null}
    </ScrollView>

    );



};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
export default Login;
