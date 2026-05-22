import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { cities } from './cities';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Прогноз погоды</Text>
      </View>
      <View style={styles.content}>
        <MapView 
          style={styles.map}
          initialRegion={{
            latitude: 55.751244,
            longitude: 37.618423,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}
        >
          {cities.map(city => (
            <Marker
              key={city.id}
              coordinate={{
                latitude: city.latitude,
                longitude: city.longitude,
              }}
              title={city.name}
            />
          ))}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});