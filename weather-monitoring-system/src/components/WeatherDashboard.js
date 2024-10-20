import React, { useEffect, useState } from 'react';
import { getWeatherData } from '../services/weatherService';
import WeatherSearch from './WeatherSearch';
const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [alert, setAlert] = useState('');

  // Fetch weather data on component mount and set an interval to fetch every 5 minutes
  useEffect(() => {
    const fetchWeather = async () => {
      const data = await getWeatherData();
      setWeatherData(data);
      checkAlerts(data); // Check if any weather alert should be displayed
    };

    const intervalId = setInterval(fetchWeather, 5 * 60 * 1000); // Fetch every 5 minutes
    fetchWeather(); // Initial fetch

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Function to check if alert should be shown (based on temperature threshold)
  const checkAlerts = (data) => {
    const highTempCities = data.filter(item => item.temp > 35);
    if (highTempCities.length > 0) {
      setAlert(`High temperature alert in ${highTempCities.map(city => city.city).join(', ')}`);
    } else {
      setAlert('');
    }
  };

  return (
    <div>
      <h1>Weather Monitoring Dashboard</h1>
      <WeatherSearch />
      {alert && <div className="alert">{alert}</div>}
      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>Temperature (°C)</th>
            <th>Feels Like (°C)</th>
            <th>Main Weather</th>
          </tr>
        </thead>
        <tbody>
          {weatherData.map((item, index) => (
            <tr key={index}>
              <td>{item.city}</td>
              <td>{item.temp}</td>
              <td>{item.feels_like}</td>
              <td>{item.main}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherDashboard;