import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { weatherConditions } from '../utils/WeatherConditions';

export default function Weather({ weather, temperature, city, country }) {
  return (
    <View style={[ styles.weatherContainer,{ backgroundColor: weatherConditions[weather].color }]}>
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons
          size={72} />
          <Text style={styles.title}>{city}</Text>
          <Text style={styles.subtitle}>{country}</Text>

      </View>
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons
          size={72}
          name={weatherConditions[weather].icon}
          color={'#fff'}
        />
        <Text style={styles.tempText}>{temperature}˚</Text>
      </View>      
    </View>
  );
};

Weather.propTypes = {
  temperature: PropTypes.number.isRequired,
  weather: PropTypes.string
};

const styles = StyleSheet.create({
  weatherContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tempText: {
    fontSize: 64,
    color: '#fff',
    fontWeight: '300',
    textAlign: 'center',
  },
  bodyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
  },
  title: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 5,
  },
});

