import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      router.replace('/login');
    }
  }, [isMounted, router]);

  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}
