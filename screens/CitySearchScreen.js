import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import Weather from '../components/Weather';
import { API_KEY } from '../utils/WeatherAPIKey';

export default function CitySearchScreen() {
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherByCity = async () => {
    try {
      const geoResponse = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city},${countryCode}&limit=5&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        setError('City not found');
        setWeatherData(null);
        return;
      }

      const { lat, lon } = geoData[0];
      const weatherResponse = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const weatherJson = await weatherResponse.json();

      setWeatherData({
        temperature: weatherJson.main.temp,
        weatherCondition: weatherJson.weather[0].main,
        country: weatherJson.sys.country
      });
      console.log(weatherJson.weather[0].main);
      setError(null);
    } catch (err) {
      setError('Error fetching weather data');
      setWeatherData(null);
    }
  };
  const resetSearch = () => {
    setCity('');
    setCountryCode('');
    setWeatherData(null);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Previsão do Tempo atual</Text>

      {weatherData && (
        <>
          <Weather weather={weatherData.weatherCondition} temperature={weatherData.temperature} city={city} country={weatherData.country} />
          <Button title="Buscar novamente" onPress={resetSearch} />
        </>
      )}

      {!weatherData && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter city name"
            value={city}
            onChangeText={(text) => setCity(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter country code"
            value={countryCode}
            onChangeText={(text) => setCountryCode(text)}
          />
          <Button title="Pesquisar" onPress={fetchWeatherByCity} />
          {error && <Text style={styles.error}>{error}</Text>}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 15,
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 15,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  weatherContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    width: '100%',
  },
  error: {
    color: '#d32f2f',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});
