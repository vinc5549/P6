const Sauce = require('../models/sauce');
const fs = require('fs');
const log = require('../utils/winston');

exports.createSauce = (req, res, next) => {

    try {
        log.info('createSauce');
        log.info(`JSON.stringify(req.auth)= ${JSON.stringify(req.auth)}`);
        log.info(`JSON.stringify(req.body)= ${JSON.stringify(req.body)}`);

        // ici erreur, l'objet est directement envoyé dans le body par le front
        // ce ne sera pas le cas dans le projet 6 ou il faudra aller chercher un req.body.sauce
        //const thingObject = JSON.parse(req.body.thing);


        const sauceObject = req.body; // donc pas besoin de parse ici
        
        // ici on supprime les propriétés de l'objet envoyé
        // car l'id se fera en auto incrément dans la base
        // et on affecte le userId avec la valeur de l'id token 
        delete sauceObject._id;
        delete sauceObject._userId;


        // ici on n'utilise pas Multer (on l'utilisera dans le P6)
        // donc on n'a pas de req.file
        // on utilise le imageUrl envoyé dans le
/*
        const thing = new Thing({
            ...thingObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        */
        const sauce = new Sauce({
            ...sauceObject,
            userId: req.auth.userId
           
        });

        sauce.save()
        .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
        .catch(error => {
          log.error(`createSauce ${error}`);
          return res.status(400).json({ error })}
        );
        
    }
        catch (error)
        {
            console.log(`erreur GLOBALE ${error}`);
            return res.status(500).json({error});
        }
    

  
 
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
        log.error(`deleteSauce ${error}`);
        return res.status(500).json({ error })}
      );
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
}

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}