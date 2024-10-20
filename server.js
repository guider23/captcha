const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const app = express();

// Enable CORS for all routes
app.use(cors()); // Allow all origins
// If you want to restrict it to specific origins, use:
// app.use(cors({ origin: 'https://your-frontend-url.com' }));

// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Your reCAPTCHA secret key
const SECRET_KEY = '6Le7kmYqAAAAAHFrJ4DeA0i8-jcegSXdJ8dt_1Kl'; // Use your actual secret key

// Route to verify reCAPTCHA token
app.get('/verify-token', async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).send('CAPTCHA token is missing');
  }

  // Google reCAPTCHA API URL for verification
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`;

  try {
    // Make a POST request to verify the token with Google reCAPTCHA
    const response = await axios.post(verifyUrl);
    const data = response.data;

    if (data.success) {
      // CAPTCHA is valid
      res.send('CAPTCHA verification successful!');
    } else {
      // CAPTCHA verification failed
      res.status(400).send('CAPTCHA verification failed.');
    }
  } catch (error) {
    // Handle errors during verification
    res.status(500).send('Error occurred during CAPTCHA verification.');
  }
});

// Start the server on port 3000 or a custom port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
