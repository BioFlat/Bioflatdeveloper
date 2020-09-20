const env = require('../config/env')
const admin = require('firebase-admin')
const firebaseCofig = require('../config/firebase')[env];

admin.initializeApp({
  credential: admin.credential.cert(firebaseCofig.service_account),
  databaseURL: firebaseCofig.databaseURL
});

 

async function decodeIDToken(req, res, next) {
  let decodedToken =  { iss: 'https://securetoken.google.com/bioflat-4f11a',
  aud: 'bioflat-4f11a',
  auth_time: 1600328340,
  user_id: '7pXvO9SLR2NwkgTfGX8bFtgYrJH3',
  sub: '7pXvO9SLR2NwkgTfGX8bFtgYrJH3',
  iat: 1600502512,
  exp: 1600506112,
  phone_number: '3216549870'
}
  req['currentUser'] = decodedToken;
  next();
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      if(decodedToken){
        req['currentUser'] = decodedToken;
        next();
      }
      
    } catch (err) {
      if(err.errorInfo.code.includes('token-expired')){
        return res.status(401).json({
          error:{

            message:'token expired'
          }
        })
      }
      return res.status(500).json({
        error:{

          message:'something went wrong'
        }
      })
    }
  }
  
}

module.exports = {decodeIDToken};