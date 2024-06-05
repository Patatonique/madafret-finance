import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { storeData, getData } from './../../utils/services';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import ListeCompte from '../composant/listeCompte';
import Derniertransaction from '../composant/dernierTransaction';
import axios from 'axios';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { supabase } from './../../supabaseClient';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [data, setData] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataUser();
  }, []);

  const fetchDataUser = async () => {
    try {
      let { data: data_users, error } = await supabase
        .from('data_users')
        .select('*');
      
      if (error) {
        console.error('Error fetching data from Supabase:', error);
      } else {
        setDataUser(data_users);
        console.log('Data from Supabase:', data_users);
      }
    } catch (error) {
      console.error('Network request failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await storeData('dataUser', null);
      setUser(null);
      router.replace('/login');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      const dataUser = await getData('dataUser');
      setUser(dataUser);
    };
    getUserData();
  }, []);

  useEffect(() => {
    if (user === null) {
      router.replace('/login');
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.1.103:5500/api/dataglobal');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data from API:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const colorMode = 'light'; // Set this to 'dark' if you want dark mode

  return (
    <View className="bg-white flex-1">
      <View className='mt-8 mx-4'>
        {/* -------------------En tete--------------------------- */}
        <View className='flex flex-row justify-between items-center'>
          <FontAwesomeIcon icon={faBars} size={20} />
          <View className="flex justify-between flex-row">
            <View className="flex items-end mr-4">
              <Text>{user?.username}</Text>
              <Text>{user?.email}</Text>
            </View>
            <View className="flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} size={20} />
            </View>
          </View>
        </View>

        {data.length > 0 ? (
          <>
            <ListeCompte montantAriary={data[0][9]} isLoading={loading} />
          </>
        ) : <ListeCompte isLoading={loading} />}

        <Derniertransaction />
      </View>

      <TouchableOpacity onPress={handleLogout}>
        <Text>Deconnection</Text>
      </TouchableOpacity>
    </View>
  );
}

const Spacer = ({ height }) => {
  return <View style={{ height: height || 16 }} />;
};
