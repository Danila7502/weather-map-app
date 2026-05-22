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

// Функция с кэшированием
export const getYandexWeatherWithCache = async (lat, lon) => {
  const cacheKey = `weather_${lat}_${lon}`;
  const cacheTimeKey = `${cacheKey}_time`;
  
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    const cacheTime = await AsyncStorage.getItem(cacheTimeKey);
    
    // Если кэш свежий (менее 10 минут)
    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 600000) {
      console.log('Использую кэш для', lat, lon);
      return JSON.parse(cached);
    }
    
    // Получаем новые данные
    const data = await getYandexWeather(lat, lon);
    if (data) {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      await AsyncStorage.setItem(cacheTimeKey, Date.now().toString());
    }
    return data;
  } catch (error) {
    console.error('Ошибка кэширования:', error);
    // Если ошибка с кэшем, пробуем получить данные без кэша
    return await getYandexWeather(lat, lon);
  }
};

// Функция для иконок погоды
export const getWeatherIcon = (condition) => {
  if (condition.includes('rain')) return require('./assets/rain_marker.png');
  if (condition.includes('snow')) return require('./assets/snow_marker.png');
  if (condition === 'clear') return require('./assets/sun_marker.png');
  return require('./assets/cloud_marker.png');
};