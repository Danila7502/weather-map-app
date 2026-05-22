import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const LayerPanel = ({ onLayerSelect, activeLayer }) => {
  const layers = [
    { id: 'temp', icon: require('./assets/temp.png'), name: 'Температура' },
    { id: 'precip', icon: require('./assets/rain.png'), name: 'Осадки' },
    { id: 'wind', icon: require('./assets/wind.png'), name: 'Ветер' },
    { id: 'clouds', icon: require('./assets/clouds.png'), name: 'Облачность' },
    { id: 'pressure', icon: require('./assets/pressure.png'), name: 'Давление' },
  ];

  return (
    <View style={styles.panel}>
      {layers.map(layer => (
        <TouchableOpacity 
          key={layer.id}
          style={[styles.button, activeLayer === layer.id && styles.activeButton]}
          onPress={() => onLayerSelect(layer.id)}
        >
          <Image source={layer.icon} style={styles.icon} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#d0d0d0',
    borderWidth: 2,
    borderColor: '#999',
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default LayerPanel;