import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { cities } from './cities';
import LayerPanel from './LayerPanel';
import { getYandexWeather } from './weatherAPI';

export default function App() {
  const mapRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  
  const centerMap = () => {
    mapRef.current.animateToRegion({
      latitude: 55.751244,
      longitude: 37.618423,
      latitudeDelta: 5,
      longitudeDelta: 5,
    }, 1000);
  };
  
  const showAllMarkers = () => {
    mapRef.current.fitToCoordinates(
      cities.map(c => ({ latitude: c.latitude, longitude: c.longitude })),
      {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      }
    );
  };

  // Загрузка погоды для всех городов
  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      const data = {};
      for (const city of cities) {
        const weather = await getYandexWeather(city.latitude, city.longitude);
        if (weather) {
          data[city.id] = {
            temp: Math.round(weather.fact.temp),
            condition: weather.fact.condition,
            windSpeed: weather.fact.wind_speed,
            windDir: weather.fact.wind_dir,
            pressure: weather.fact.pressure_mm,
            clouds: weather.fact.cloudness,
          };
        }
      }
      setWeatherData(data);
      setLoading(false);
    };
    loadWeather();
  }, []);

  // Функция цвета температуры
  const getTempColor = (temp) => {
    if (temp <= -20) return '#8B00FF';
    if (temp <= -10) return '#0000FF';
    if (temp <= 0) return '#00BFFF';
    if (temp <= 10) return '#87CEEB';
    if (temp <= 20) return '#90EE90';
    if (temp <= 30) return '#FFD700';
    return '#FF4500';
  };

  // Рендер маркеров
  const renderMarkers = () => {
    return cities.map(city => {
      const weather = weatherData[city.id];
      if (!weather) return null;
      
      // Слой температуры
      if (activeLayer === 'temp') {
        return (
          <Marker
            key={city.id}
            coordinate={{ latitude: city.latitude, longitude: city.longitude }}
            title={city.name}
            description={`${weather.temp}°C`}
          >
            <View style={[styles.tempMarker, { backgroundColor: getTempColor(weather.temp) }]}>
              <Text style={styles.tempText}>{weather.temp}°</Text>
            </View>
          </Marker>
        );
      }
      
      // Обычный маркер
      return (
        <Marker
          key={city.id}
          coordinate={{ latitude: city.latitude, longitude: city.longitude }}
          title={city.name}
          description="Нажмите для погоды"
        >
          <View style={styles.customMarker}>
            <View style={styles.markerDot} />
            <Text style={styles.markerText}>{city.name}</Text>
          </View>
        </Marker>
      );
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Прогноз погоды</Text>
        </View>
        <View style={styles.center}>
          <Text>Загрузка погоды...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Прогноз погоды</Text>
      </View>
      
      <View style={styles.leftButtons}>
        <TouchableOpacity style={styles.button} onPress={centerMap}>
          <Image source={require('./assets/center.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={showAllMarkers}>
          <Image source={require('./assets/show_all.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <MapView 
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{
            latitude: 55.751244,
            longitude: 37.618423,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}
        >
          {renderMarkers()}
        </MapView>
      </View>
      <LayerPanel onLayerSelect={setActiveLayer} activeLayer={activeLayer} />
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
  leftButtons: {
    position: 'absolute',
    top: 100,
    left: 10,
    zIndex: 1,
  },
  button: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  icon: {
    width: 30,
    height: 30,
  },
  content: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    alignItems: 'center',
  },
  markerDot: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    marginBottom: 2,
  },
  markerText: {
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tempMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  tempText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});