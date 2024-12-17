import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
import { API_KEY } from '../utils/WeatherAPIKey';

const convertDateToTimestamp = (date) => {
  return Math.floor(new Date(date).getTime() / 1000);
};

const getAQIInfo = (aqi) => {
  switch (aqi) {
    case 1: return { label: 'Good', color: '#4CAF50' };
    case 2: return { label: 'Fair', color: '#FFEB3B' };
    case 3: return { label: 'Moderate', color: '#FFC107' };
    case 4: return { label: 'Poor', color: '#FF5722' };
    case 5: return { label: 'Very Poor', color: '#F44336' };
    default: return { label: 'Unknown', color: '#9E9E9E' };
  }
};


export default function AirQualityHistoryScreen() {
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (message) => {
    Alert.alert("Erro", message, [{ text: "OK" }]);
    setError(message);
  };
  const handlePollutantPress = (pollutant) => {
    setActivePollutant(pollutant);
    setModalVisible(true);
  };
  
  const fetchCityCoordinates = async () => {
    setLoading(true);
    setError(null);
    setHistoryData([]);
    
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city},${countryCode}&limit=1&appid=${API_KEY}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const startTimestamp = convertDateToTimestamp(startDate);
        const endTimestamp = convertDateToTimestamp(endDate);
        fetchAirQualityHistory(lat, lon, startTimestamp, endTimestamp);
      } else {
        handleError('Cidade não encontrada.');
        setLoading(false);
      }
    } catch (err) {
      handleError('Erro ao buscar coordenadas da cidade.');
      setLoading(false);
    }
  };

  const fetchAirQualityHistory = async (lat, lon, start, end) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${API_KEY}`
      );
      const data = await response.json();

      if (data.list) {
        setHistoryData(data.list);
      } else {
        handleError('Erro ao buscar dados de histórico de qualidade do ar');
      }
    } catch (err) {
      handleError('Erro ao buscar dados de histórico de qualidade do ar');
    } finally {
      setLoading(false);
    }
  };

  const renderHistoryItem = ({ item }) => {
    const aqiInfo = getAQIInfo(item.main.aqi);
    return (
      <View style={styles.historyItem}>
        <Text style={styles.date}>{new Date(item.dt * 1000).toLocaleString()}</Text>
        <View style={[styles.aqiContainer, { backgroundColor: aqiInfo.color }]}>
          <Text style={styles.aqiText}>{aqiInfo.label} (AQI: {item.main.aqi})</Text>
        </View>
        <Text style={styles.pollutants}>CO: {item.components.co} µg/m³</Text>
        <Text style={styles.pollutants}>NO: {item.components.no} µg/m³</Text>
        <Text style={styles.pollutants}>NO₂: {item.components.no2} µg/m³</Text>
        <Text style={styles.pollutants}>O₃: {item.components.o3} µg/m³</Text>
        <Text style={styles.pollutants}>SO₂: {item.components.so2} µg/m³</Text>
        <Text style={styles.pollutants}>PM₂.₅: {item.components.pm2_5} µg/m³</Text>
        <Text style={styles.pollutants}>PM₁₀: {item.components.pm10} µg/m³</Text>
        <Text style={styles.pollutants}>NH₃: {item.components.nh3} µg/m³</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Qualidade do Ar</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Data de início (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de fim (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
      />
      <Button title="Pesquisar" onPress={fetchCityCoordinates} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {historyData.length > 0 && (
        <FlatList
          data={historyData}
          renderItem={renderHistoryItem}
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
  historyItem: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  aqiContainer: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  aqiText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  pollutants: {
    fontSize: 14,
    marginTop: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
