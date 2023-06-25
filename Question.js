var Question = function (iD, typ, txt, nbB, nbM, rep, mvRep, titr, intitu) {
  this.id = iD;
  this.type = typ;
  this.titre = titr;
  this.intitule = intitu;
  this.texte = txt;
  this.reponseUtilisateur = [];
  this.nbBonnesReponses = nbB;
  this.nbMauvaisesReponses = nbM;
  this.bonnesReponses = [].concat(rep);
  this.mauvaisesReponses = [].concat(mvRep);
}

//Une question de l'examen
Question.prototype.convertirQuestion = function () {
  var questionGift = "";
  //Si la question n'a pas de titre on en genere un automatiquement à partir de son id
  if (this.titre === "") {
    questionGift += "::Q" + (this.id + 1) + ":: ";
  } else {
    questionGift += "::" + (this.titre) + ":: ";
  }
  //Si la question n'a pas d'intitule, le corps en fera office
  if (this.intitule === "") {
    questionGift += this.texte + " {";
  } else {
    if (Number(this.type) === -1) {
      questionGift += this.intitule + "\n" + this.texte;
    } else {
      questionGift += this.intitule + "\n" + this.texte + " {";
    }
  }

  //On parse à l'envers en fonction du type de question
  switch (Number(this.type)) {
    case 1:
      for (var i = 0; i < this.nbBonnesReponses; i++) {
        questionGift += "=" + this.bonnesReponses[i] + " #Bonne réponse; bravo ! ";
      }
      for (var i = 0; i < this.nbMauvaisesReponses; i++) {
        if (i !== this.nbMauvaisesReponses - 1) {
          questionGift += "~" + this.mauvaisesReponses[i] + " #Mauvaise réponse, c'est " + this.bonnesReponses[0] + ". ";
        } else {
          questionGift += "~" + this.mauvaisesReponses[i] + " #Mauvaise réponse, c'est " + this.bonnesReponses[0] + ".";
        }
      }
      questionGift += "}";
      break;

    case 2:
      if (this.nbBonnesReponses === 10) {
        questionGift += "T}";
      } else {
        questionGift += "F}";
      }
      break;

    case 3:
      for (var i = 0; i < this.nbBonnesReponses; i++) {
        if (i !== this.nbBonnesReponses - 1) {
          questionGift += "=" + this.bonnesReponses[i] + " ";
        } else {
          questionGift += "=" + this.bonnesReponses[i] + "}";
        }
      }
      questionGift += " " + this.mauvaisesReponses[0];
      break;
    case 4:
      for (var i = 0; i < this.nbBonnesReponses; i++) {
        if (i !== this.nbBonnesReponses - 1) {
          questionGift += "=" + this.bonnesReponses[i] + " -> " + this.mauvaisesReponses[i] + " ";
        } else {
          questionGift += "=" + this.bonnesReponses[i] + " -> " + this.mauvaisesReponses[i] + "}";
        }
      }
      break;

    case 5:
      questionGift += "#" + this.bonnesReponses[0] + ":" + this.mauvaisesReponses[0] + "}";
      break;

    case 6:
      questionGift += "#" + this.bonnesReponses[0] + ".." + this.mauvaisesReponses[0] + "}";
      break;

    case 7:
      questionGift += "#\n =" + this.bonnesReponses[0] + ":0 # Bravo ! Tous les points !\n";
      questionGift += " =%" + this.mauvaisesReponses[1] + "%" + this.bonnesReponses[0] + ":" + this.mauvaisesReponses[0] + " # " + this.mauvaisesReponses[2] + "\n";
      questionGift += "}";
      break;

    case 8:
      questionGift += "}";
      break;

    case 9:
      questionGift -= "{";
      break;
  }

  return questionGift;
}
//Fonction pour convertir la question en GIFT

module.exports = Question;
