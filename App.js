import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import MapView from 'react-native-maps';

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
            latitude: 55.751244,  // Москва
            longitude: 37.618423,
            latitudeDelta: 5,     // Зум: чем меньше число, тем ближе
            longitudeDelta: 5,
          }}
        />
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