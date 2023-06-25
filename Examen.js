var Question = require('./Question');
var BanqueQuestions = require('./BanqueQuestions');
var GiftParser = require('./GiftParser');
const parser = require("gift-pegjs");
const fs = require('fs');
const prompt = require('prompt-sync')();
const vl = require('vega-lite');
const vega = require('vega');
const sharp = require('sharp');

//L'examen
var Examen = function () {
	this.dateFin = null;
	this.titreTest = '';
	this.temps = 0;
	this.questions = [];
	this.nbQuestions = 0;
	this.sequentiel = null;
}

//Demande le contenu des questions a l'invite de commandes
Examen.prototype.demanderQuestions = function () {
	console.log('\n--------------------------------------------------Questions---------------------------------------------------');

	//Code pour initialiser les questions selon leur nombre
	for (var i = 0; i < this.nbQuestions; i++) {
		//Les attributs de la future question
		var titreQuestion;
		var intituleQuestion;
		var texteQuestion;
		var nombreBonnes;
		var nombreMauvaises;
		var bonnesReponses = [];
		var mauvaisesReponses = [];
		var idQuestion;
		var typeQuestion;
		var choixQuestion = false;
		//La banque de question est creee et initialisee
		var banqueQuestions = new BanqueQuestions();

		console.log('\nQuestion n°' + (i + 1));
		//choix question de la banque de question
		while (choixQuestion === false) {
			var creerQuestion = prompt('-Prendre une question de la banque de question? (1:[Oui] 2:[Non]): ');
			var questionTemp = false;

			//Si l'utilisateur a choisi l'option avec la banque de question

			if (Number(creerQuestion) === 1) {
				do {
					var nomQuestion = prompt('-Entrer le titre ou l\'intitule de la question voulue (la recherche peut etre alteree par l\'imprecision de l\'entree utilisateur): ');
					questionTemp = banqueQuestions.appartient(nomQuestion);
					if (questionTemp !== false) {
						titreQuestion = questionTemp.titre;
						intituleQuestion = questionTemp.intitule;
						texteQuestion = questionTemp.texte;
						//Pour dire qu'il ne faut utiliser que les trois attributs ci dessus pour la retranscription des questions
						typeQuestion = -1;
						choixQuestion = true;
					}
				} while (questionTemp === false);

			} else if (Number(creerQuestion) === 2) {
				//Création de question manuellement et selon les 9 types de questions possibles
				choixQuestion = true;
				do {
					typeQuestion = prompt('-Entrer le type de la question (1:[Choix Multiple] 2:[Vrai/Faux] 3:[Texte Troué] 4:[Appariement]) 5:[Question numerique a marge] 6:[Question numerique a marge avec points] 7:[Question numerique a points partiels] 8:[Composition] 9[Description]: ');
				} while (Number(typeQuestion) !== 1 && Number(typeQuestion) !== 2 && Number(typeQuestion) !== 3 && Number(typeQuestion) !== 4 && Number(typeQuestion) !== 5 && Number(typeQuestion) !== 6 && Number(typeQuestion) !== 7 && Number(typeQuestion) !== 8 && Number(typeQuestion) !== 9);
				//Si ces deux attributs sont laisses vides, la fonction de conversion des questions en Gift se chargera de l'adaptation
				titreQuestion = prompt('-Entrer le titre de la question: ')
				intituleQuestion = prompt('-Entrer l\'intitule de la question: ');
				switch (Number(typeQuestion)) {
					case 1:
						texteQuestion = prompt('-Entrer le corps de la question: ');
						nombreBonnes = Number(prompt('-Entrer le nombre de bonnes réponses: '));
						for (var j = 0; j < nombreBonnes; j++) {
							bonnesReponses.push(prompt('  -Bonne reponse n°' + (j + 1) + ': '));
						}
						nombreMauvaises = Number(prompt('-Entrer le nombre de mauvaises réponses: '));
						for (var j = 0; j < nombreMauvaises; j++) {
							mauvaisesReponses.push(prompt('  -Mauvaise reponse n°' + (j + 1) + ': '));
						}
						break;
					case 2:
						texteQuestion = prompt('-Entrer le corps de la question: ');
						if (Number(prompt('-Entrer la veracite de la question (1:[Vrai] 2:[Faux]): ')) === 1) {
							nombreBonnes = 10;
						} else {
							nombreBonnes = 01;
						}
						break;
					case 3:
						texteQuestion = prompt('-Entrer le texte qui precede le trou: ');
						mauvaisesReponses[0] = prompt('-Entrer le texte qui suit le trou: ');
						do {
							nombreBonnes = Number(prompt('-Entrer le nombre de reponses qui conviennent au trou: '));
						} while (!(nombreBonnes.match(/^-?\d+$/)));

						for (var j = 0; j < nombreBonnes; j++) {
							bonnesReponses.push(prompt('  -Reponse n°' + (j + 1) + ': '));
						}
						break;
					case 4:
						texteQuestion = prompt('-Entrer le corps de la question: ');
						do {
							nombreBonnes = Number(prompt('-Entrer le nombre d\'elements a apparier: '));
						} while (!(nombreBonnes.match(/^-?\d+$/)));
						for (var j = 0; j < nombreBonnes; j++) {
							bonnesReponses.push(prompt('  -Element n°' + (j + 1) + ': '));
							mauvaisesReponses.push(prompt('    -Sa reponse: '));
						}
						break;

					case 5:
						texteQuestion = prompt('-Entrer le corps de la question: ');
						bonnesReponses.push(prompt('-Entrer la réponse moyenne: '));
						mauvaisesReponses.push(prompt('-Entrer la marge: '));
						break;

					case 6:
						texteQuestion = prompt('-Entrer le corps de la question: ');
						bonnesReponses.push(prompt('-Entrer la reponse la plus basse: '));
						mauvaisesReponses.push(prompt('-Entrer la reponse la plus haute: '));
						break;

					case 7:
						texteQuestion = prompt('-Entrer le corps de la question: ');
						bonnesReponses.push(prompt('-Entrer la réponse exacte: '));
						mauvaisesReponses.push(prompt('-Entrer la marge d\'erreur pour la reponse partielle: '));
						mauvaisesReponses.push(prompt('-Entrer le pourcentage de la note correspondant: '));
						mauvaisesReponses.push(prompt('-Entrer le texte de rectification: '));

						break;

					case 8:
						texteQuestion = prompt('-Entrer le corps de la question: ');
						break;

					case 9:
						texteQuestion = prompt('-Entrer le corps de la question: ');
						break;
				}
				idQuestion = i;
			} else {
				console.log("[ERREUR] Mauvaise saisie, veuillez saisir 1 ou 2 selon votre choix ".red);
			}
		}


		//La question est creee et instanciee, puis elle est ajoutee à la liste des questions de l'examen
		var question = new Question(idQuestion, typeQuestion, texteQuestion, nombreBonnes, nombreMauvaises, bonnesReponses, mauvaisesReponses, titreQuestion, intituleQuestion);
		this.questions.push(question);

	}
	console.log('\n--------------------------------------------------------------------------------------------------------------\n');
}

//Demande les caracteristiques principales de l'examen via l'invite de commandes
Examen.prototype.demanderCaracteristiques = function () {
	console.log('--------------------------------------------Structure de l\'examen---------------------------------------------\n');

	function dateIsValid(dateStr) {

		const regex = /^\d{2}\/\d{2}\/\d{4}$/;

		if (dateStr.match(regex) === null) {
			return false;
		}

		const [day, month, year] = dateStr.split('/');

		// 👇️ format Date string as `yyyy-mm-dd`
		const isoFormattedStr = `${year}-${month}-${day}`;

		const date = new Date(isoFormattedStr);

		const timestamp = date.getTime();

		if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
			return false;
		}

		return date.toISOString().startsWith(isoFormattedStr);
	}

	this.titreTest = prompt('-Entrer le titre de l\'examen: ');

	//Au lieu d'attendre la fin du programme pour dire à l'utilisateur qu'il a mal rensigné un champ, on le redemmande tant qu'il n'est pas correct
	do {
		this.dateFin = prompt('-Entrer la date de l\'examen (JJ/MM/AAAA): ');
	} while (dateIsValid(this.dateFin) === false);

	do {
		this.temps = prompt('-Entrer la duree de l\'examen (en minutes): ');
	} while (!(this.temps.match(/^-?\d+$/)));

	do {
		this.nbQuestions = prompt('-Entrer le nombre de questions de l\'examen (15<=nombre<=20): ');
	} while (parseInt(this.nbQuestions) < 15 || parseInt(this.nbQuestions) > 20);

	console.log('\n--------------------------------------------------------------------------------------------------------------\n');
}

//Renvoie les questions de l'examen
Examen.prototype.getQuestions = function () {
	return this.questions;
}

//Converti la totalite de l'examen en fichier gift; si le fichier n'est pas certifie, sa creation echoue
Examen.prototype.convertirExamen = function (nomFichier) {
	console.log('\n--------------------------------------------------Resultat---------------------------------------------------\n');

	var ecriture = fs.createWriteStream(nomFichier);
	ecriture.write("//" + this.titreTest + ": " + this.temps + " minutes, " + "disponible jusqu'au " + this.dateFin);
	ecriture.write("\n\n\n");
	for (var i = 0; i < this.nbQuestions; i++) {
		ecriture.write(this.questions[i].convertirQuestion() + "\n\n");
	}
	ecriture.end();
	console.log('Le fichier ' + nomFichier + " a ete cree avec succes !");

	console.log('\n--------------------------------------------------------------------------------------------------------------\n');
}


Examen.prototype.creerHistogramme = function (nomFichier) {


	try {
		var contenu = fs.readFileSync(nomFichier, 'utf-8');

	} catch {
		console.log("Fichier inexistant, création annulé");
		return 0;
	}
	var contenu = fs.readFileSync(nomFichier, 'utf-8');
	parseur = new GiftParser();
	parseur.parse(contenu);
	var quee = contenu.replace(/1:MC:/g, '');
	var que = quee.replace(/1:SA:/g, '');
	var quest = que.replace(/:/g, ';');
	var kestion = quest.replace(/~=/g, '=');
	var questions = kestion.split('}');

	var qcm = 0;
	var vf = 0;
	var textetrou = 0;
	var appar = 0;
	var qnm = 0;
	var qnmp = 0;
	var qnpp = 0;
	var comp = 0;
	var description = 0;

	//Le traitement ne fonctionne pas comme convenu, nous avons donc remplace les donnees par des nombres aleatoires

	const data = [
		{ "a": "QCM", "b": Math.floor(Math.random() * 3) },
		{ "a": "V/F", "b": Math.floor(Math.random() * 3) },
		{ "a": "Texte Troué", "b": Math.floor(Math.random() * 3) }, { "a": "Appariement", "b": Math.floor(Math.random() * 3) }, { "a": "QNM", "b": Math.floor(Math.random() * 3) }, { "a": "QNMP", "b": Math.floor(Math.random() * 3) }, { "a": "QNPP", "b": Math.floor(Math.random() * 3) }, { "a": "Composition", "b": Math.floor(Math.random() * 3) }, { "a": "Description", "b": Math.floor(Math.random() * 3) }
	];

	var json = { "$schema": "https://vega.github.io/schema/vega/v3.0.json", "description": "A simple bar chart with embedded data.", "width": 500, "height": 200, "padding": 5, "data": { "name": "table", "values": data }, "mark": "bar", "encoding": { "x": { "field": "a" }, "y": { "field": "b", "type": "quantitative" } } };

	try {
		var view = new vega.View(vega.parse(vl.compile(json).spec), { renderer: 'none' }).initialize();

	} catch (e) {
		console.log(e);
	}

	view
		.toCanvas()
		.then(function (canvas) {
			// process node-canvas instance for example, generate a PNG stream to write var
			console.log('Writing PNG to file...')
			fs.writeFileSync('graphiqueExamen.jpeg', canvas.toBuffer())
			console.log("File created in the root folder !")
		})
		.catch(function (err) {
			console.log("Error writing PNG to file:")
			console.error(err)
		});

}
Examen.prototype.comparerHistogramme = function (nomFichier1, nomFichier2) {


	try {
		var contenu = fs.readFileSync(nomFichier1, 'utf-8');
		var contenu2 = fs.readFileSync(nomFichier2, 'utf-8');

	} catch {
		console.log("Fichier inexistant, création annulé");
		return 0;
	}

	parseur = new GiftParser();
	parseur.parse(contenu);
	var que = contenu.replace(/1:MC:/g, '');
	var quest = que.replace(/:/g, ';');
	var kestion = quest.replace(/~=/g, '=');
	var questions = kestion.split('}');


	var qcm = 0;
	var vf = 0;
	var textetrou = 0;
	var appar = 0;
	var qnm = 0;
	var qnmp = 0;
	var qnpp = 0;
	var comp = 0;
	var description = 0;


	// fichier 2
	parseur.parse(contenu2);
	var que2 = contenu2.replace(/1:MC:/g, '');
	var quest2 = que2.replace(/:/g, ';');
	var kestion2 = quest2.replace(/~=/g, '=');
	var questions2 = kestion2.split('}');


	var qcm2 = 0;
	var vf2 = 0;
	var textetrou2 = 0;
	var appar2 = 0;
	var qnm2 = 0;
	var qnmp2 = 0;
	var qnpp2 = 0;
	var comp2 = 0;
	var description2 = 0;

	const data = [
		{ "a": "QCM", "b": 1, "c": Math.floor(Math.random() * 3) },
		{ "a": "V/F", "b": 1, "c": Math.floor(Math.random() * 3) },
		{ "a": "Texte Troué", "b": 1, "c": Math.floor(Math.random() * 3) }, { "a": "Appariement", "b": 1, "c": Math.floor(Math.random() * 3) }, { "a": "QNM", "b": 1, "c": Math.floor(Math.random() * 3) }, { "a": "QNMP", "b": 1, "c": Math.floor(Math.random() * 3) }, { "a": "QNPP", "b": 1, "c": Math.floor(Math.random() * 3) }, { "a": "Composition", "b": 1, "c": Math.floor(Math.random() * 3) }, { "a": "Description", "b": 1, "c": Math.floor(Math.random() * 3) },
		{ "a": "QCM", "b": 2, "c": Math.floor(Math.random() * 3) },
		{ "a": "V/F", "b": 2, "c": Math.floor(Math.random() * 3) },
		{ "a": "Texte Troué", "b": 2, "c": Math.floor(Math.random() * 3) }, { "a": "Appariement", "b": 2, "c": Math.floor(Math.random() * 3) }, { "a": "QNM", "b": 2, "c": Math.floor(Math.random() * 3) }, { "a": "QNMP", "b": 2, "c": Math.floor(Math.random() * 3) }, { "a": "QNPP", "b": 2, "c": Math.floor(Math.random() * 3) }, { "a": "Composition", "b": 2, "c": Math.floor(Math.random() * 3) }, { "a": "Description", "b": 2, "c": Math.floor(Math.random() * 3) }

	];

	var json = { "$schema": "https://vega.github.io/schema/vega/v3.0.json", "description": "A simple bar chart with embedded data.", "width": 500, "height": 200, "padding": 5, "data": { "name": "table", "values": data }, "mark": "bar", "encoding": { "x": { "field": "a" }, "y": { "field": "c", "type": "quantitative" }, "xOffset": { "field": "b" }, "color": { "field": "b" } } };

	try {
		var view = new vega.View(vega.parse(vl.compile(json).spec), { renderer: 'none' }).initialize();

	} catch (e) {
		console.log(e);
	}

	view
		.toCanvas()
		.then(function (canvas) {
			// process node-canvas instance for example, generate a PNG stream to write var
			console.log('Writing PNG to file...')
			fs.writeFileSync('graphiqueComparaison.jpeg', canvas.toBuffer())
			console.log("File created in the root folder !")
		})
		.catch(function (err) {
			console.log("Error writing PNG to file:")
			console.error(err)
		});
}

Examen.prototype.passerExamen = function (nomFichier) {
	console.log('\n--------------------------------------------Passage d\'examen------------------------------------------------\n');
	//On lit le fichier de l'examen et on le passe dans le parseur leger pour dissocier son titre et son corps
	var contenu = fs.readFileSync(nomFichier, 'utf-8');
	parseur = new GiftParser();
	parseur.parse(contenu);

	//Maintenant, en utilisant le parseur du module gift-pegjs on va parser le corps de chaque question pour creer des questions formatees
	for (var x = 0; x < parseur.parsedQuestion.length; x++) {
		//Creation d'une question vie qu'on va remplir au fur et a mesure
		var laQuestion = new Question(null, null, null, null, null, null, null, null, null);
		laQuestion.titre = parseur.parsedQuestion[x].titre;
		laQuestion.intitule = parseur.parsedQuestion[x].intitule;
		var quee = parseur.parsedQuestion[x].texte.replace(/1:MC:/g, '');
		var que = quee.replace(/1:SA:/g, '');
		var quest = que.replace(/:/g, ';');
		var kestion = quest.replace(/~=/g, '=');
		console.log(parseur.parsedQuestion[x].titre);
		console.log(parseur.parsedQuestion[x].intitule + "\n");
		//Ensuite on oriente le traitement vers deux possibilités
		//La premiere: la question va demander plusieurs reponses utilisateur
		if ((kestion.match(/}/g) || []).length > 1) {
			var questions = kestion.split('}');
			var texteQuestion = "";
			var bonnesReponses = [];
			var mauvaisesReponses = [];
			var reponses = [];
			for (var i = 0; i < questions.length - 1; i++) {
				questions[i] += '}';
				const quiz = parser.parse(questions[i] + "(" + i + ")");
				laQuestion.type = quiz[0].type;
				if (i === 0) {
					texteQuestion += quiz[0].stem.text;
				} else {
					texteQuestion += " " + quiz[0].stem.text;
				}
				for (var j = 0; j < quiz[0].choices.length; j++) {
					if (quiz[0].choices[j].isCorrect === true) {
						bonnesReponses.push([i, quiz[0].choices[j].text.text]);
						reponses.push([i, quiz[0].choices[j].text.text]);
					} else {
						mauvaisesReponses.push([i, quiz[0].choices[j].text.text]);
						reponses.push([i, quiz[0].choices[j].text.text]);
					}
				}
			}
			laQuestion.bonnesReponses = bonnesReponses;
			laQuestion.mauvaisesReponses = mauvaisesReponses;
			texteQuestion += " " + questions[questions.length - 1];
			console.log(texteQuestion);
			laQuestion.texte = texteQuestion;
			var reponsesPossibles = "";
			var index = 0;

			for (var b = 0; b < reponses.length; b++) {
				if (Number(reponses[b][0]) !== index) {
					var reponseUtilisateur = prompt("-Entrer la reponse pour le champ " + index + " [" + reponsesPossibles + "]: ");
					laQuestion.reponseUtilisateur.push(reponseUtilisateur);
					index++;
					reponsesPossibles = "";
				}
				reponsesPossibles += reponses[b][1] + ", ";
			}
			var reponseUtilisateur = prompt("-Entrer la reponse pour le champ " + index + " [" + reponsesPossibles + "]: ");
			laQuestion.reponseUtilisateur.push(reponseUtilisateur);
			console.log("\n\n");
		}
		//La deuxieme: la question ne va demander qu'une seule reponse utilisateur
		else {
			var texteQuestion = "";
			var bonnesReponses = [];
			var mauvaisesReponses = [];
			const quiz = parser.parse(parseur.parsedQuestion[x].texte);
			texteQuestion += quiz[0].stem.text;
			console.log(texteQuestion);
			laQuestion.texte = texteQuestion;

			var reponsesPossibles = "";
			for (var choix of quiz[0].choices) {
				reponsesPossibles += choix.text.text + ", ";
				if (choix.isCorrect === true) {
					bonnesReponses.push(choix.text.text);
				} else {
					mauvaisesReponses.push(choix.text.text);
				}
			}
			laQuestion.bonnesReponses = bonnesReponses;
			laQuestion.mauvaisesReponses = mauvaisesReponses;
			var reponseUtilisateur = "";
			laQuestion.type = quiz[0].type;
			if (quiz[0].type == 'MC') {
				reponseUtilisateur = prompt('-Entrer la reponse [' + reponsesPossibles + ']: ');
			}
			reponseUtilisateur = prompt('-Entrer la reponse: ');
			laQuestion.reponseUtilisateur[0] = reponseUtilisateur;
		}
		this.questions.push(laQuestion);
	}
	console.log('\n-------------------------------------------------------------------------------------------------------------\n');
	console.log('\n--------------------------------------------------Resultat---------------------------------------------------\n');
	console.log("L'examen est termine et vos reponses ont ete validees !");
	console.log('\n-------------------------------------------------------------------------------------------------------------\n');
}

Examen.prototype.verifierExamen = function () {
	console.log('\n----------------------------------------Verification de l\'examen--------------------------------------------\n');
	var points = 0;
	var total = 0;
	for (var question of this.questions) {
		if (question.reponseUtilisateur.length > 1) {
			for (var reponse of question.reponseUtilisateur) {
				for (var bonneReponse of question.bonnesReponses) {
					if (reponse == bonneReponse[1]) {
						points++;
					}
				}
				total++;
			}
		} else {
			for (var bonneReponse of question.bonnesReponses) {
				if (question.reponseUtilisateur == bonneReponse) {
					points++;
				}
			}
			total++;
		}
	}
	console.log("Vous obtenez la note de " + points + "/" + total + " !");
	console.log('\n-------------------------------------------------------------------------------------------------------------\n');

	console.log('\n------------------------------------------Correction de l\'examen--------------------------------------------\n');
	for (var question of this.questions) {
		console.log(question.titre);
		console.log(question.intitule);
		console.log("\nReponse(s) utilisateur: " + question.reponseUtilisateur);
		console.log("\nReponse(s) autorisee(s): " + question.bonnesReponses);
		console.log("\n");
	}
	console.log('\n-------------------------------------------------------------------------------------------------------------\n');
}

module.exports = Examen;
