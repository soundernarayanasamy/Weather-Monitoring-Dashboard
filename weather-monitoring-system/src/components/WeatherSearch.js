import React, { useState } from 'react';
import { getForecast } from '../services/weatherService';

const WeatherSearch = () => {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city) {
      setError('Please enter a city');
      return;
    }

    try {
      const response = await getForecast(city);
      setForecast(response);
      setError(''); // Clear any previous error
    } catch (err) {
      setError('Error fetching the forecast data');
      setForecast(null); // Clear previous forecast
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={city} 
          onChange={handleInputChange} 
          placeholder="Enter city name" 
          style={{ padding: '10px', fontSize: '16px' }} 
        />
        <button type="submit" style={{ marginLeft: '10px', padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
          Search
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {forecast && (
        <div>
          <h3>Weather Forecast for {forecast.city}</h3>
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Temperature (°C)</th>
                <th>Feels Like (°C)</th>
                <th>Main Weather</th>
              </tr>
            </thead>
            <tbody>
              {forecast.forecast.map((item, index) => (
                <tr key={index}>
                  <td>{item.datetime}</td>
                  <td>{item.temp}</td>
                  <td>{item.feels_like}</td>
                  <td>{item.weather}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WeatherSearch;