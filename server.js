const express = require("express");
const cron = require('node-cron');
const axios = require('axios'); 

const app = express();

require('dotenv').config();

const dbconfig = require('./db')

const weatherUserRoute = require('./routes/weather_users')
const EmailService = require('./services/EmailService');

const api = {
  key: process.env.OPENWEATHERMAP_API_KEY,
  base: process.env.OPENWEATHERMAP_BASE_URL,
  };


app.use(express.json())
app.use('/api/users', weatherUserRoute)

cron.schedule('0 */3 * * *', async () => 
{ 

  try {

    const User = require("./models/weather_user_model");
    const users = await User.find();
    console.log('Sending hourly weather reports to', users.length, 'users.');

    for (const user of users) {
      const forecastResponse = await axios.get(`${api.base}forecast?q=${user.location}&units=metric&appid=${api.key}`);
      const forecastData = forecastResponse.data;
      const dateObj = new Date(); 

      // Fetch the weather data for the next 3 hours 
      const weatherDataForDate = forecastData.list.find((item) => {
        const itemDate = new Date(item.dt_txt);
        
        return (
          itemDate >= dateObj && itemDate <= new Date(dateObj.getTime() + 3 * 60 * 60 * 1000) 
        );
      });

      if (!weatherDataForDate) {
        console.log('Weather forecast not found for', user.email);
        continue; 
      }

      function getWeatherImage(weatherType) {
        switch (weatherType) {
          case "Clouds":
            return 'https://i.imgur.com/y00C1Ib.png'; 
          case "Clear":
            return 'https://i.imgur.com/6ORrHD1.png'; 
          case "Rain":
            return 'https://i.imgur.com/ZO4rYi0.png'; 
          case "Drizzle":
            return 'https://i.imgur.com/d1sDxKt.png'; 
          case "Thunderstorm":
            return 'https://i.imgur.com/ZFbYabu.png';
          default:
            return 'https://i.imgur.com/6ORrHD1.png'; 
        }
      }
      
      
      const weatherType = weatherDataForDate.weather[0].main; 
      const weatherImage = getWeatherImage(weatherType); 

      const emailContent = `
      <html>
        <head>
          <style>
            /* Define your CSS styles here */
            body {
              font-family: Arial, sans-serif;
              background-color: #f0f0f0;
              padding: 20px;
            }
    
            .container {
              background-color: #fff;
              border-radius: 10px;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
              text-align: left;
              color: #333;
            }
    
            .city-name {
              font-size: 26px;
              text-align: center;
              margin-top: 10px;
              color: #222;
              font-weight: bold;
            }
    
            .date {
              font-size: 18px;
              text-align: center;
              color: #777;
            }
    
            .weather-info {
              text-align: center;
              margin-top: 20px;
            }
    
            .temperature {
              font-size: 24px;
              color: #333;
            }
    
            .humidity {
              font-size: 18px;
              color: #555;
              margin-top: 6px;
            }
    
            .other-info {
              font-size: 18px;
              color: #555;
              margin-top: 8px;
            }
              
              .weather-image {
                text-align: center;
                margin-top: 10px;
              }
          </style>
        </head>
        <body>
        <h3>Hello ${user.name || 'there'} ,</h3>

          <div class="box>
              <div class="container">
                <div class="city-name">${user.location}</div>
                <div class="weather-image">
              <img src="${weatherImage}" alt="${weatherType}" />
                      </div>
                <div class="date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="weather-info">
                  <div class="temperature">Temperature: ${weatherDataForDate.main.temp}&deg;C</div>
                  <div class="humidity">Humidity: ${weatherDataForDate.main.humidity}%</div>
              
                </div>
          </div>

          </div>
        </body>
      </html>
    `;
    


      await EmailService.sendWeatherReport(user, emailContent);
      console.log('Weather report sent to', user.email);

    }
    console.log('Hourly weather reports sent successfully.');
  
} catch (error) {
    console.error('Error sending hourly weather reports:', error);
  }
});

app.get('/', (req, res) => {

  const weatherEmoji = "☀️"; 


  const htmlContent = `
    <html>
      <head>
        <style>
          /* Define CSS styles here */
          h1 {
            font-weight: bold;
            margin-top: 24px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>${weatherEmoji} Hourly Weather Report App ${weatherEmoji}</h1>
      </body>
    </html>
  `;

  // Set the HTML content as the response
  res.send(htmlContent);
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Node Server Started using Nodemon!'));
