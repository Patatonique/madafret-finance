import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { storeData, getData } from './../../utils/services';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars,faUser } from '@fortawesome/free-solid-svg-icons'
import ListeCompte from '../composant/listeCompte';
import Derniertransaction from '../composant/dernierTransaction';
import axios from 'axios';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState('');

  const handleLogout = async () => {
    try {
      await storeData('dataUser', null);
      setUser(null)
      router.replace('/login');

    } catch (err) {
      console.error(err);
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

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.1.103:5500/api/dataglobal'); // Assurez-vous que cette URL correspond à l'endpoint de votre serveur Node.js
        setData(response.data);
        // console.log(response.data[0][9])
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View className="bg-white flex-1">
      <View className='mt-8 mx-4' >
        {/* -------------------En tete--------------------------- */}
        <View className='flex flex-row justify-between items-center'>
        <FontAwesomeIcon
            icon={faBars}
            size={20}
          />
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

        {/* --------------------Liste Compte----------------- */}
        <ListeCompte props={data[0][9]}/>
        {/* --------------------Derniere Transaction--------- */}
        <Derniertransaction />
      </View>
    </View>

  );

}
