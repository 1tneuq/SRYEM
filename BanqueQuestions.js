var Question = require('./Question');
var GiftParser = require('./GiftParser');
const fs = require('fs');

//La banque de questions
var BanqueQuestions = function () {
  this.questions = this.initialiser();
}

//Pour l'instant la banque ne fonctionne qu'avec un seul fichier
BanqueQuestions.prototype.initialiser = function () {
  var kestions = new Set();
  var contenu = fs.readFileSync("./BanqueDeQuestions/fichierTest.gift", 'utf-8');

  analyzer = new GiftParser();
  analyzer.parse(contenu);

  //on ajoute chaque question du fichier dans notre banque
  var questionsDuParseur = analyzer.getQuestions();
  for (var i = 0; i < questionsDuParseur.length; i++) {
    var ques = new Question(questionsDuParseur[i].id, questionsDuParseur[i].type, questionsDuParseur[i].texte, questionsDuParseur[i].nbBonnesReponses, questionsDuParseur[i].nbMauvaisesReponses, questionsDuParseur[i].bonnesReponses, questionsDuParseur[i].mauvaisesReponses, questionsDuParseur[i].titre, questionsDuParseur[i].intitule);
    kestions.add(ques);
  }
  return kestions;
}

//Permet l'ajout d'une question à la banque
BanqueQuestions.prototype.ajouter = function (question) {
  this.questions.add(question);
}

//Permet de supprimer une question de la banque
BanqueQuestions.prototype.supprimer = function (question) {
  this.questions.delete(question);
}

//Renvoie la taille de la banque, i.e le nombre de questions
BanqueQuestions.prototype.getTaille = function () {
  return this.questions.size;
}

//Permet de savoir si un morceau de titre ou d'intitule correspond à une question de la banque
BanqueQuestions.prototype.appartient = function (titreOuIntitule) {
  if (titreOuIntitule == '') {
    return false;
  } else {
    for (let q of this.questions) {
      if (q.titre.includes(titreOuIntitule)) {
        console.log("-" + q.titre);
        return q;
      } else if (q.intitule.includes(titreOuIntitule)) {
        console.log("-" + q.intitule);
        return q;
      } else {
        console.log("-Aucun titre ou intitule correspondant, veuillez reessayer");
        return false;
      }
    }
  }

}

//Renvoie la question stockée à l'index en parametre
BanqueQuestions.prototype.getUneQuestion = function (index) {
  return [...this.questions][index];
}

module.exports = BanqueQuestions;