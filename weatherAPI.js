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

export const getWeatherIcon = (condition) => {
  if (condition.includes('rain') || condition.includes('showers') || condition === 'hail')
    return require('./assets/rain_marker.png');
  if (condition.includes('snow'))
    return require('./assets/snow_marker.png');
  if (condition === 'clear')
    return require('./assets/sun_marker.png');
  return require('./assets/cloud_marker.png');
};