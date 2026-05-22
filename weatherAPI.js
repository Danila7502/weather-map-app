import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = '37d94c9f-14c7-4ee2-bbd6-0e04ac959c5d';

export const getYandexWeather = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}&limit=1&hours=false`,
      {
        headers: {
          'X-Yandex-Weather-Key': API_KEY
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка получения погоды от Yandex:', error);
    return null;
  }
};

export const getYandexWeatherWithCache = async (lat, lon) => {
  console.log('Загрузка погоды для:', lat, lon);
  return await getYandexWeather(lat, lon);
};

import sunIcon from './assets/sun_marker.png';
import rainIcon from './assets/rain_marker.png';
import snowIcon from './assets/snow_marker.png';
import cloudIcon from './assets/cloud_marker.png';

export const getWeatherIcon = (condition) => {
  if (condition.includes('rain')) return rainIcon;
  if (condition.includes('snow')) return snowIcon;
  if (condition === 'clear') return sunIcon;
  return cloudIcon;
};