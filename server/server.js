const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

// Initialize environment variables from the .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENWEATHER_API_KEY; // Your OpenWeatherMap API key

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

// Endpoint to fetch weather data for predefined cities
app.get('/api/weather', async (req, res) => {
  try {
    const weatherData = await Promise.all(
      cities.map((city) =>
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        )
      )
    );

    const formattedData = weatherData.map((response) => {
      const { main, weather, dt } = response.data;
      return {
        city: response.data.name,
        temp: (main.temp - 273.15).toFixed(2), // Convert Kelvin to Celsius
        feels_like: (main.feels_like - 273.15).toFixed(2),
        main: weather[0].main,
        timestamp: dt,
      };
    });

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weather data', error });
  }
});

// Endpoint to get the forecast for a specific city
app.get('/api/forecast', async (req, res) => {
  const city = req.query.city;  // Get the city from the query string
  if (!city) {
    return res.status(400).json({ message: 'City is required' });
  }

  // Log the city and URL for debugging purposes
  console.log(`Fetching forecast for: ${city}`);
  console.log(`Requesting forecast from: https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`);

  try {
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
    );
    
    const forecastData = forecastResponse.data.list.map(item => ({
      datetime: item.dt_txt,
      temp: (item.main.temp - 273.15).toFixed(2), // Convert Kelvin to Celsius
      feels_like: (item.main.feels_like - 273.15).toFixed(2),
      weather: item.weather[0].main,
    }));

    res.json({
      city: forecastResponse.data.city.name,
      forecast: forecastData
    });
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching forecast data', error.response?.data);
    res.status(500).json({ message: 'Error fetching forecast data', error: error.response?.data });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
