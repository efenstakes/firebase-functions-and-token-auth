const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors')

// setup
const app = express();
admin.initializeApp();



// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const authenticate = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized');
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch(e) {
    res.status(403).send('Unauthorized');
    return;
  }
};

// app.use(authenticate);
app.use(cors())


// GET /api/messages?category={category}
// Get all messages, optionally specifying a category to filter on
// app.get('/messages', authenticate, async (req, res) => {
//   res.json({
//       'page': 'in api',
//       'route': 'messages',
//       'method': req.method,
//   })
// });

// GET /api/messages?category={category}
// Get all messages, optionally specifying a category to filter on
app.post('/messages', authenticate, async (req, res) => {
    res.json({
        'page': 'in api',
        'route': 'messages',
        'method': req.method,
        'user': req.user,
    })
});

// GET /api/messages?category={category}
// Get all messages, optionally specifying a category to filter on
app.post('/unsecured', async (req, res) => {
    res.json({
        'page': 'in api',
        'route': 'unsecured',
        'method': req.method,
    })
});

// GET /api/messages?category={category}
// Get all messages, optionally specifying a category to filter on
app.get('/unsecured', async (req, res) => {
    res.json({
        'page': 'in api',
        'route': 'unsecured',
        'method': req.method,
    })
});


// Expose the API as a function
exports.api = functions.https.onRequest(app);
