const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config');

//router.post('/', auth, multer, stuffCtrl.createThing); 
//router.post('/', auth, multer, stuffCtrl.createThing); 
//router.put('/:id', auth, multer, stuffCtrl.modifyThing);  
//router.delete('/:id', auth, stuffCtrl.deleteThing);
//router.get('/:id', auth, stuffCtrl.getOneThing); 
//router.get('/', auth, stuffCtrl.getAllThing);

module.exports = router;
  