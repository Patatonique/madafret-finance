import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { storeData, getData } from './../../utils/services';

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      const dataUser = await getData('dataUser');
      setUser(dataUser);
      setToken(dataUser.token);
      setIsMounted(true);
    };
    getUserData();
  }, []); // Empty dependency array to run this effect only once on mount

  useEffect(() => {
    if (isMounted && !token) {
      router.replace('/login');
    }
  }, [isMounted, token, router]); // Adding dependencies to re-run the effect only when these variables change

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <View className='mt-8 mx-4 flex flex-row justify-between items-center' >
      <Text>Home</Text>
      <Text>{user.username}</Text>
    </View>
  );
}
