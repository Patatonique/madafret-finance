import { View, Text, ScrollView,Image } from 'react-native';
import React from 'react';

export default function ListeCompte() {
  return (
    <View>

    <View className="flex flex-row items-center">
        <View>
          <Image className="w-12 h-12" source={(require('./../../flag/mg.png'))}></Image>
        </View>
        <View className="ml-4">
          <Text className='font-medium text-lg'>Solde en Ariary en Caisse</Text>
          <Text className='font-extrabold text-2xl'>40,000,000Ar</Text>
        </View>
    </View>
    
    <ScrollView horizontal={true}>
      <View  className="bg-gray-300 w-60 rounded-3xl p-4 mr-4 mt-4">
        <View className="flex flex-row justify-between">
          <Image className="w-14 h-14" source={(require('./../../flag/eu.png'))}></Image>
          <Text className="text-3xl">EUR</Text>
        </View>
        <View className="flex mt-10">
          <Text className="text-3xl text-blue-500">12,000€</Text>
        </View>
      </View>
      <View  className="bg-gray-300 w-60 rounded-3xl p-4 mr-4 mt-4">
        <View className="flex flex-row justify-between">
          <Image className="w-14 h-14" source={(require('./../../flag/cny.png'))}></Image>
          <Text className="text-3xl">EUR</Text>
        </View>
        <View className="flex mt-10">
          <Text className="text-3xl text-blue-500">12,000€</Text>
        </View>
      </View>

    </ScrollView>
    
    </View>
  );
}
