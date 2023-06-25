const fs = require('fs');
const colors = require('colors');
const Examen = require('./Examen.js');
const GiftParser = require('./GiftParser.js');
const Contact = require('./Contact.js');
const vg = require('vega');
const vegalite = require('vega-lite');
const cli = require("@caporal/core").default;

cli
	.version('0.1')
	// Créer un examen
	.command('examC', 'Cree un examen au format GIFT')
	.argument('<nomFichier>', 'Le nom du fichier GIFT en sortie')
	.action(({ args, options, logger }) => {

		var exam = new Examen();
		exam.demanderCaracteristiques();
		exam.demanderQuestions();
		exam.convertirExamen(args.nomFichier);
	})

	// Passer un examen
	.command('examP', 'Passer un examen')
	.argument('<nomFichier>', 'Le fichier gift de l\'examen')
	.action(({ args, options, logger }) => {

		var exam = new Examen();
		exam.passerExamen(args.nomFichier);
		exam.verifierExamen();
	})

	// Parser un fichier gift (pour l'instant juste titre/intitule/corps)
	.command('parser', 'Parse legerement un fichier Gift')
	.argument('<file>', 'Le fichier gift')
	.action(({ args, options, logger }) => {
		fs.readFile(args.file, 'utf8', function (err, data) {
			if (err) {
				return logger.warn(err);
			}
			analyzer = new GiftParser();
			analyzer.parse(data);
			analyzer.getQuestions(data);
			for (var i = 0; i < analyzer.parsedQuestion.length; i++) {
				console.log(analyzer.parsedQuestion[i].titre);
			}
		})
	})

	// Créer un contact
	.command('contact', 'Cree un contact au format vCard')
	.action(({ args, options, logger }) => {

		var contact = new Contact();
		contact.creerContact();
	})

	// Créer un histogramme
	.command('histo', 'Cree un histogramme')
	.argument('<file>', 'Le fichier gift')
	.action(({ args, options, logger }) => {

		var examen = new Examen();
		examen.creerHistogramme(args.file);
	})

	// Comparer deux examens avec création d 'un histogramme
	.command('histoC', 'Compare  histogramme')
	.argument('<file>', 'Le fichier gift')
	.argument('<file2>', 'Le fichier gift')
	.action(({ args, options, logger }) => {

		var examen = new Examen();
		examen.comparerHistogramme(args.file, args.file2);
	})


cli.run(process.argv.slice(2));
