import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Image, ActivityIndicator } from 'react-native';
import { API_KEY } from '../utils/WeatherAPIKey';

export default function WeatherForecastScreen() {
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCityCoordinates = async () => {
    setLoading(true);
    setError(null);
    setForecastData([]);

    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city},${countryCode}&limit=1&appid=${API_KEY}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        fetchWeatherForecast(lat, lon);
      } else {
        setError('Cidade não encontrada.');
        setLoading(false);
      }
    } catch (err) {
      setError('Erro ao buscar coordenadas da cidade.');
      setLoading(false);
    }
  };

  const fetchWeatherForecast = async (lat, lon) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod === '200') {
        setForecastData(data.list);
      } else {
        setError('Erro ao buscar dados de previsão');
      }
    } catch (err) {
      setError('Erro ao buscar dados de previsão');
    } finally {
      setLoading(false);
    }
  };

  const renderForecastItem = ({ item }) => (
    <View style={styles.forecastItem}>
      <Text style={styles.date}>{item.dt_txt}</Text>
      <Image
        style={styles.icon}
        source={{ uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
      />
      <Text style={styles.temp}>{item.main.temp}°C</Text>
      <Text>{item.weather[0].description}</Text>
      <Text style={styles.details}>Humidade: {item.main.humidity}%</Text>
      <Text style={styles.details}>Vento: {item.wind.speed} m/s</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Previsão do Tempo para 5 dias a cada 3 horas</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome da cidade"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite o código do país (ex: BR para Brasil)"
        value={countryCode}
        onChangeText={setCountryCode}
      />
      <Button title="Pesquisar" onPress={fetchCityCoordinates} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {forecastData.length > 0 && (
        <FlatList
          data={forecastData}
          renderItem={renderForecastItem}
          keyExtractor={(item) => item.dt.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 20,
  },
  loading: {
    marginVertical: 20,
  },
  forecastItem: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  temp: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
