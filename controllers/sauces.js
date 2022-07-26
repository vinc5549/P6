const Sauce = require('../models/sauce');
const fs = require('fs');
const log = require('../utils/winston');

// CREE UNE SAUCE

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
      };
      
    
  
// MODIFIER UNE SAUCE


exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
  };


// SUPPRIMER UNE SAUCE

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


// AFFICHER UNE SEULE SAUCE

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
}

// AFFICHER TOUTE LES SAUCES

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

exports.sauceLikes = (req, res, next) => {
  //SWITCH CASE (1, 0, -1)
  // LIKE
      switch (req.body.like) {
          case 1:
              Sauce.updateOne(
                  { _id: req.params.id },
                  { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
                  )
              .then(() => res.status(200).json({ message: 'like !' }))
              .catch((error) => res.status(400).json({ error }));
          break;
          // ANNULATION LIKE / DISLIKE
          case 0:
              Sauce.findOne({ _id: req.params.id })
              .then((sauce) => {
                  if (sauce.usersLiked.includes(req.body.userId)) {
                      Sauce.updateOne(
                          { _id: req.params.id },
                          { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
                      )
                      .then(() =>
                      res.status(200).json({ message: 'like annulé !' })
                      )
                      .catch((error) => res.status(400).json({ error }));
                  }
                  if (sauce.usersDisliked.includes(req.body.userId)) {
                      Sauce.updateOne(
                          { _id: req.params.id },
                          {
                          $pull: { usersDisliked: req.body.userId },
                          $inc: { dislikes: -1 },
                          }
                      )
                      .then(() =>
                      res.status(200).json({ message: 'dislike annulé !' })
                      )
                      .catch((error) => res.status(400).json({ error }));
                  }
              })
              .catch((error) => res.status(404).json({ error }));
          break;
          // Dislike
          case -1:
              Sauce.updateOne(
                  { _id: req.params.id },
                  { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
              )
              .then(() => {
                  res.status(200).json({ message: 'dislike !' });
              })
              .catch((error) => res.status(400).json({ error }));
          break;
          default:
              console.log(error)
      }
  };