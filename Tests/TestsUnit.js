describe("Program Syntactic testing of GiftParser", function () {

	beforeAll(function () {
		const Contact = require('../Contact');
		const Examen = require('../Examen');
		const Question = require('../Question');
		const GiftParser = require('../GiftParser')
		this.analyzer = new GiftParser();
		this.cEmptyRating = new Contact(1, "Bob", "Bob", "rue", "00/00/00", "bob.bob@orange.fr", "07 64 64 46 46");
	});

	it("peut lire le prénom du contact", function () {
		let input = ["prenom", "Bob"];
		expect(this.analyzer.prenom(input)).toBe("Bob");
	});

	it("peut lire un numéro de téléphone", function () {
		let input = ["tel", "07 64 64 46 46"];
		expect(this.analyzer.tel(input)).toBe("07 64 64 46 46");
	});

	// test sur Question
	this.qEmptyRating = new Question(1, 2, "texte", 10, null, ["oui"], ["non"], "titre", "intitule");
	expect(this.analyzer.titre(intput)).toBe("titre");
	expect(this.analyzer.type(intput)).toBe(2);
	// there is something missing here and this.pEmptyRating will certainly be usesul there
});


const Contact = require('../Contact');
const Examen = require('../Examen');
const Question = require('../Question');

describe("Program Semantic testing of // Contact: ", function () {

	beforeAll(function () {
		this.c = new Contact(1, "Bob", "Bob", "rue", "00/00/00", "bob.bob@orange.fr", "07 64 64 46 46");
		this.e = new Examen();
		this.q = new Question(1, 2, "texte", 10, null, ["oui"], ["non"], "titre", "intitule");
	});
	it("can create a new Contact", function () {
		expect(this.c).toBeDefined();
		expect(this.c.nom).toBe("Bob");
		expect(this.c).toEqual(jasmine.objectContaining({ nom: "Bob" }));
	});


	// question
	it("can create a new Question", function () {
		expect(this.q).toBeDefined();
		// toBe is === on simple values
		expect(this.q.titre).toBe("titre");
		expect(this.q).toEqual(jasmine.objectContaining({ titre: "titre" }));
	});
	it("can convert Question", function () {
		var questionGift = this.q.convertirQuestion();
		// toEqual is === on complex values - deepEquality
		expect(questionGift).toEqual("::titre:: intitule\ntexte {T}");
	});


	//examen
	it("can create a new Examen", function () {
		expect(this.e).toBeDefined();
		expect(this.e.validite).toBe(true);
		expect(this.e).toEqual(jasmine.objectContaining({ validite: true }));
	});
	it("can add a new Question and get it", function () {
		this.e.getQuestions().push(this.q);
		expect(this.e.getQuestions()).toEqual([this.q]);
	});


});
