import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Backend API base URL

// Fetch weather data for predefined cities
export const getWeatherData = async () => {
  try {
    const response = await axios.get(`${API_URL}/weather`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data', error);
    return [];
  }
};

// Fetch forecast data for a specific city
export const getForecast = async (city) => {
  try {
    const response = await axios.get(`${API_URL}/forecast?city=${city}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast data', error);
    throw error;
  }
};