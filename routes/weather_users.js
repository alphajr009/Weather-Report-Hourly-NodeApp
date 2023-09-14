const express = require("express");
const router = express.Router();
const User = require("../models/weather_user_model");
const axios = require('axios');

const api = {
  key: process.env.OPENWEATHERMAP_API_KEY,
  base: process.env.OPENWEATHERMAP_BASE_URL,
  };

  const { validationResult, check } = require('express-validator');

  const validateRegistration = [
    check('email').isEmail().withMessage('Invalid email'),
    check('name').not().isEmpty().withMessage('Name is required'),
    check('location').not().isEmpty().withMessage('Location is required'),
    
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      next();
    },
  ];


  router.post("/register", validateRegistration, async (req, res) => {
    const { email, name, location } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists." });
        }

        const newUser = new User({ email, name, location });
        const user = await newUser.save();
        res.send('User Stored Successfully');
    } catch (error) {
        return res.status(400).json({ error });
    }
});


router.patch('/updatelocation', async (req, res) => {

    const { email , location  } = req.body;

    try {

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).send('User not found');
        }

        user.location = location;

        await user.save();
        res.send('User Location updated successfully');
    } catch (error) {
        console.log(error);
        res.status(400).send('Error updating User Location');
    }

});




  router.get('/weather', async (req, res) => {

    const { email , date  } = req.body;

    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const dateObj = new Date(date);
  
      // Convert the date to Unix timestamp format 
      const unixTimestamp = Math.floor(dateObj.getTime() / 1000);
  
      const forecastResponse = await axios.get(`${api.base}forecast?q=${user.location}&units=metric&appid=${api.key}`);
  
      const forecastData = forecastResponse.data;
  
      const weatherDataForDate = forecastData.list.filter((item) => {
        const itemDate = new Date(item.dt_txt);
        return (
          itemDate.getUTCFullYear() === dateObj.getUTCFullYear() &&
          itemDate.getUTCMonth() === dateObj.getUTCMonth() &&
          itemDate.getUTCDate() === dateObj.getUTCDate()
        );
      });

      if (weatherDataForDate.length === 0) {
        return res.status(404).send('Weather forecast out of range (beyond 5 days)');
    }
  
      res.json(weatherDataForDate);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
});

  


module.exports = router