import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Modal, Button } from 'react-native';
import { API_KEY } from '../utils/WeatherAPIKey';

export default function AirQualitySearchScreen() {
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [airQualityData, setAirQualityData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activePollutant, setActivePollutant] = useState(null);

  const handlePollutantPress = (pollutant) => {
    setActivePollutant(pollutant);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setActivePollutant(null);
  };
  const getPollutantLevel = (type, value) => {
    const ranges = {
      SO2: [20, 80, 250, 350],
      NO2: [40, 70, 150, 200],
      PM10: [20, 50, 100, 200],
      PM2_5: [10, 25, 50, 75],
      O3: [60, 100, 140, 180],
      CO: [4400, 9400, 12400, 15400],
    };
  
    const thresholds = ranges[type.toUpperCase()];
    if (!thresholds) return 1; 
  
    if (value <= thresholds[0]) return 1;
    if (value <= thresholds[1]) return 2;
    if (value <= thresholds[2]) return 3;
    if (value <= thresholds[3]) return 4;
    return 5;
  };
  
  
  const fetchCityCoordinates = async (cityName, country) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${country}&limit=1&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lon };
      } else {
        setError('Cidade não encontrada.');
        setLoading(false);
        return null;
      }
    } catch (err) {
      setError('Erro ao buscar coordenadas da cidade.');
      setLoading(false);
      console.log(err);
      return null;
    }
  };

  const fetchAirQualityData = async (lat, lon) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const data = await response.json();
      setAirQualityData(data.list?.[0]);
      setLoading(false);
    } catch (err) {
      setError('Erro ao buscar dados de qualidade do ar.');
      setLoading(false);
      console.log(err);
    }
  };

  const handleSearch = async () => {
    setError(null);
    setAirQualityData(null);
    setLoading(true);
    const coordinates = await fetchCityCoordinates(city, countryCode);
    if (coordinates) {
      fetchAirQualityData(coordinates.lat, coordinates.lon);
    }
  };

  const getAQIInfo = (aqi) => {
    switch (aqi) {
      case 1: return { label: 'Bom', color: '#4CAF50' };
      case 2: return { label: 'Razoável', color: '#FFEB3B' };
      case 3: return { label: 'Moderado', color: '#FFC107' };
      case 4: return { label: 'Ruim', color: '#FF5722' };
      case 5: return { label: 'Muito Ruim', color: '#F44336' };
      default: return { label: 'Desconhecido', color: '#9E9E9E' };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Qualidade do Ar por Cidade</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome da cidade"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite o código do país (ex: BR)"
        value={countryCode}
        onChangeText={setCountryCode}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleSearch}>
        <Text style={styles.buttonText}>Pesquisar</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}

      {error && <Text style={styles.error}>{error}</Text>}

      {airQualityData && (
  <View style={styles.dataContainer}>
    <Text style={styles.sectionTitle}>Qualidade do Ar</Text>
    <View style={[styles.aqiContainer, { backgroundColor: getAQIInfo(airQualityData.main.aqi).color }]}>
      <Text style={styles.aqiText}>{getAQIInfo(airQualityData.main.aqi).label}</Text>
      <Text style={styles.aqiNumber}>AQI: {airQualityData.main.aqi}</Text>
    </View>

    <Text style={styles.sectionTitle}>Componentes do Ar</Text>
    {Object.entries(airQualityData.components).map(([pollutant, value]) => (
      <TouchableOpacity key={pollutant} onPress={() => handlePollutantPress(pollutant)}>
        <Text style={styles.pollutant}>
          {pollutant.toUpperCase()}: {value.toFixed(2)} µg/m³
        </Text>
      </TouchableOpacity>
    ))}
  </View>
)}
<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalhes do Poluente</Text>
            {activePollutant && (
              <>
                <Text style={styles.modalText}>
                  Poluente: {activePollutant.toUpperCase()}
                </Text>
                <Text style={styles.modalText}>
                  Concentração: {airQualityData.components[activePollutant].toFixed(2)} µg/m³
                </Text>
                <Text style={styles.modalText}>
                  Nível: {getAQIInfo(getPollutantLevel(activePollutant, airQualityData.components[activePollutant])).label}
                </Text>
              </>
            )}
            <Button title="Fechar" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 15,
    width: '90%',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  buttonContainer: {
    width: '90%',
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
  loading: {
    marginVertical: 20,
  },
  dataContainer: {
    marginTop: 20,
    backgroundColor: '#e0f7fa',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  aqiContainer: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  aqiText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  aqiNumber: {
    fontSize: 16,
    color: '#fff',
  },
  pollutant: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  error: {
    color: '#d32f2f',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  
});
