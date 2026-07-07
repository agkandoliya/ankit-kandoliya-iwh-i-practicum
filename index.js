const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));



const private_app_token = 'pat-na1-4afbb534-3072-4eb9-b4cb-6896300a420a'


app.get('/', async (req, res) => {
  const booksEndpoint = 'https://api.hubspot.com/crm/v3/objects/2-64725003';
  const headers = {
    Authorization: `Bearer ${private_app_token}`,
    'Content-Type': 'application/json'
  }
  const params = {
    properties: 'book_title,author,genre'
  }
  try {
    const response = await axios.get(booksEndpoint, { headers, params });
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    const books = response.data.results;
    console.log('Book data:', JSON.stringify(books, null, 2));
    res.render('homepage', { title: 'Books | Integrating With HubSpot I Practicum', data: books });
  } catch (error) {
    console.error(error);
  }
})

app.get('/update-cobj', (req, res) => {
  try {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' }); // Render the updates.pug template
  } catch (error) {
    console.error(error);
  }
});


app.post('/update-cobj', async (req, res) => {
  const booksEndpoint = 'https://api.hubspot.com/crm/v3/objects/2-64725003';
  const headers = {
    Authorization: `Bearer ${private_app_token}`,
    'Content-Type': 'application/json'
  }
  const data = {
    properties: {
      book_title: req.body.book_title,
      author: req.body.author,
      genre: req.body.genre
    }
  }
  try {
    const response = await axios.post(booksEndpoint, data, { headers });
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    res.redirect('/'); // Redirects to home page
  } catch (error) {
    console.error(error);
  }
});


app.listen(3000, () => console.log('Server running on port 3000')); 