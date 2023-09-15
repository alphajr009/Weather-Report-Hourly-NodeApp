# Node.js Weather Report API

This Node.js API allows users to store their email addresses and locations and receive hourly weather reports every 3 hours for their registered locations.

![adilroom](https://i.imgur.com/4IFLWVu.png)


## Getting Started

To run this project locally, follow the steps below:

### Prerequisites

1. Node.js and npm should be installed on your machine.
2. MongoDB should be installed and running.

### Installation

1. Clone this repository to your local machine.

```bash
git clone https://github.com/alphajr009/Weather-Report-Hourly-NodeApp.git
cd Weather-Report-Hourly-NodeApp
```

2. Install the project dependencies.

```bash
npm install
```

3. Set up your environment variables.

Create a .env file in the root directory of the project and add the following variables:

```bash
MONGODB_URI=your_mongodb_connection_uri
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
OPENWEATHERMAP_BASE_URL=your_openweathermap_base_url
GMAIL_EMAIL=your_gmail_email
GMAIL_PASSWORD=your_gmail_password
```

4. Start the application.

```bash
npm start
```

The API will be available at http://localhost:5000.

![adilroom](https://i.imgur.com/wqVEYtZ.jpeg)


### Postman API Collection

You can import the provided Postman API collection to test the API routes. The collection is available in the WeatherNode.postman_collection.json file.


1. Route for storing user details.

Change the Body - raw - JSON as below for your email , name , location 

![adilroom](https://i.imgur.com/YBzsn4d.png)

2. Route for updating user's location.

Change the Body - raw - JSON as below for your email and new location

![adilroom](https://i.imgur.com/kEqnAWu.png)


3. Route for retrieving user's weather data for a given day.

Change the Body - raw - JSON as below for your email and date in the YYYY-MM-DD format 

![adilroom](https://i.imgur.com/swtDyLH.png)






 
