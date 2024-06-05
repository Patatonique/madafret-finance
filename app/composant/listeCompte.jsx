import { View, Text, ScrollView, Image, StyleSheet, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import axios from 'axios';

const deviseImages = {
  EURO: require('./../../flag/eu.png'),
  RMB: require('./../../flag/cny.png'),
  USD: require('./../../flag/usa.png'),
  AED: require('./../../flag/aed.png'),
  MG: require('./../../flag/mg.png'),
  // Ajoutez d'autres devises ici
};

export default function ListeCompte({ montantAriary, isLoading }) {
  const [dataMaster, setDataMaster] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getDeviseMaster = async () => {
    try {
      const resp = await axios.get('http://192.168.1.103:5500/devisemaster');
      setDataMaster(resp.data);
    } catch (e) {
      console.error('Erreur de recuperation Master Devise : ', e);
    }
  };

  useEffect(() => {
    getDeviseMaster();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getDeviseMaster();
    setRefreshing(false);
  };

  const colorMode = 'light';
  return (
    <View>
      <View className="flex flex-row items-center">
        <View>
          <Image className="w-12 h-12" source={require('./../../flag/mg.png')} />
        </View>
        <View className="ml-4">
          <Text className="font-medium text-lg">Solde en Ariary en Caisse</Text>
          {isLoading ? (
            <MotiView
              transition={{
                type: 'timing',
              }}
              animate={{ backgroundColor: '#ffffff' }}
            >
              <Skeleton colorMode={colorMode} width={150} />
            </MotiView>
          ) : (
            <Text className="font-bold text-xl ">{montantAriary} Ar</Text>
          )}
        </View>
      </View>

      <View>
        <Text className="font-semibold underline text-2xl text-slate-700">Compte Global</Text>
      </View>
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        className="-mx-4"
      >
        {dataMaster.map((devise, index) => (
          <View key={index} className="bg-gray-200 w-60 rounded-3xl p-4 ml-4 mt-4">
            <View className="flex flex-row justify-between">
              <Image
                className="w-14 h-14"
                source={deviseImages[devise.nomDevise]}
              />
              <Text className="text-3xl">{devise.nomDevise}</Text>
            </View>
            <View className="flex mt-10">
              <Text className="text-3xl text-blue-500">{devise.soldeTotal} {devise.symbole}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
});
