import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { cities } from './cities';
import LayerPanel from './LayerPanel';
import { getYandexWeather, getWeatherIcon } from './weatherAPI';

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

  const getTempColor = (temp) => {
    if (temp <= -20) return '#8B00FF';
    if (temp <= -10) return '#0000FF';
    if (temp <= 0) return '#00BFFF';
    if (temp <= 10) return '#87CEEB';
    if (temp <= 20) return '#90EE90';
    if (temp <= 30) return '#FFD700';
    return '#FF4500';
  };

  const getPrecipDescription = (condition) => {
    if (condition.includes('rain')) return 'Дождь';
    if (condition.includes('snow')) return 'Снег';
    return 'Без осадков';
  };

  const getWindArrow = (dir) => {
    const arrows = {
      'n': '↓', 's': '↑', 'w': '→', 'e': '←',
      'nw': '↙', 'ne': '↘', 'sw': '↗', 'se': '↖'
    };
    return arrows[dir.toLowerCase()] || '●';
  };

  const getPressureColor = (pressure) => {
    if (pressure < 745) return '#FF6B6B';
    if (pressure <= 765) return '#6BCB77';
    return '#4D96FF';
  };

  const renderMarkers = () => {
    return cities.map(city => {
      const weather = weatherData[city.id];
      if (!weather) return null;
      
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
      
      if (activeLayer === 'precip') {
        return (
          <Marker
            key={city.id}
            coordinate={{ latitude: city.latitude, longitude: city.longitude }}
            title={city.name}
            description={getPrecipDescription(weather.condition)}
          >
            <Image source={getWeatherIcon(weather.condition)} style={styles.precipIcon} />
          </Marker>
        );
      }
      
      if (activeLayer === 'wind') {
        return (
          <Marker
            key={city.id}
            coordinate={{ latitude: city.latitude, longitude: city.longitude }}
            title={city.name}
            description={`${weather.windSpeed} м/с, ${weather.windDir}`}
          >
            <View style={styles.windMarker}>
              <Text style={styles.windArrow}>{getWindArrow(weather.windDir)}</Text>
              <Text style={styles.windSpeed}>{weather.windSpeed} м/с</Text>
            </View>
          </Marker>
        );
      }
      
      if (activeLayer === 'clouds') {
        const opacity = 0.2 + (weather.clouds * 0.7);
        return (
          <Marker
            key={city.id}
            coordinate={{ latitude: city.latitude, longitude: city.longitude }}
            title={city.name}
            description={`Облачность: ${Math.round(weather.clouds * 100)}%`}
          >
            <View style={[styles.cloudMarker, { opacity: opacity }]}>
              <Image source={require('./assets/cloud_marker.png')} style={styles.cloudIcon} />
            </View>
          </Marker>
        );
      }
      
      if (activeLayer === 'pressure') {
        return (
          <Marker
            key={city.id}
            coordinate={{ latitude: city.latitude, longitude: city.longitude }}
            title={city.name}
            description={`${weather.pressure} мм рт.ст.`}
          >
            <View style={[styles.pressureMarker, { backgroundColor: getPressureColor(weather.pressure) }]}>
              <Text style={styles.pressureText}>{weather.pressure}</Text>
            </View>
          </Marker>
        );
      }
      
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
  precipIcon: {
    width: 40,
    height: 40,
  },
  windMarker: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  windArrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  windSpeed: {
    fontSize: 12,
    color: '#333',
  },
  cloudMarker: {
    backgroundColor: '#808080',
    padding: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  cloudIcon: {
    width: 30,
    height: 30,
  },
  pressureMarker: {
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
  pressureText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});