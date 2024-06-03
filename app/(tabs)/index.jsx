import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { storeData, getData } from './../../utils/services';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars,faUser } from '@fortawesome/free-solid-svg-icons'
import ListeCompte from '../composant/listeCompte';
import Derniertransaction from '../composant/dernierTransaction';

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
        <ListeCompte/>
        {/* --------------------Derniere Transaction--------- */}
        <Derniertransaction />
      </View>
    </View>

  );

}
