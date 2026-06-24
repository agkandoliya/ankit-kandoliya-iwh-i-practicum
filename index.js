require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS || '';
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE || '2-xxxxxxx';

// ROUTE 1 - Homepage: fetch all custom objects and render a table
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=book_title,book_author,book_genre`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Books | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
        res.render('homepage', { title: 'Books | HubSpot APIs', data: [] });
    }
});

// ROUTE 2 - Render the create/update form
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3 - POST: create a new CRM record from form data, then redirect to homepage
app.post('/update-cobj', async (req, res) => {
    const { book_title, book_author, book_genre } = req.body;
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const body = {
        properties: { book_title, book_author, book_genre }
    };
    try {
        await axios.post(url, body, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

/**
* * This is sample code to give you a reference for how you should structure your calls.

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
