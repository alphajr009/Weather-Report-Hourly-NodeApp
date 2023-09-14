const mongoose = require('mongoose');

const weatherUserSchema = mongoose.Schema({

    name: {
        type: String, required: false
    },

    email: {
        type: String, required: true
    },
    location: {
        type: String, required: true
    },
   

}, {
    timestamps: true,
})

const weatherUserModel = mongoose.model('weather_users', weatherUserSchema)

module.exports = weatherUserModel