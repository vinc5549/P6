const jwt = require('jsonwebtoken');
const log = require('../utils/winston');

module.exports = (req, res, next) => {
  try {
    log.info("inside auth");
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      log.info("valid user id");
      /* passe le userId du token en req.auth sans quoi on ne pourrait pas l'utiliser dans les controllers !*/
      req.auth = {
        userId: userId
      }; 

      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};