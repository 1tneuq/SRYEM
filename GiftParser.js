var Question = require('./Question');


//Parse l'essentiel d'un fichier Gift en decoupant Titre/Intitule/Corps des differentes questions qui le composent
var GiftParser = function (sTokenize, sParsedSymb) {
	// The list of POI parsed from the input file.
	this.parsedQuestion = [];
	this.symb = ["//", "::", "{", "}", "=", "#", "->", "..", "%", ":"];
	this.showTokenize = sTokenize;
	this.showParsedSymbols = sParsedSymb;
	this.errorCount = 0;
}

// Parser procedure

// tokenize : tranform the data input into a list
// <eol> = CRLF
GiftParser.prototype.tokenize = function (data) {
	var separator = /(\r\n|: )/;
	data = data.split(separator);
	data = data.filter((val, idx) => !val.match(separator));
	return data;
}

// parse : analyze data by calling the first non terminal rule of the grammar
GiftParser.prototype.parse = function (data) {
	var tData = this.tokenize(data);
	if (this.showTokenize) {
		console.log(tData);
	}
	this.listQuestion(tData);
}

// Parser operand

GiftParser.prototype.errMsg = function (msg, input) {
	this.errorCount++;
	console.log("Parsing Error ! on " + input + " -- msg : " + msg);
}

// Read and return a symbol from input
GiftParser.prototype.next = function (input) {
	var curS = input.shift();
	if (this.showParsedSymbols) {
		console.log(curS);
	}
	return curS
}

// accept : verify if the arg s is part of the language symbols.
GiftParser.prototype.accept = function (s) {
	var idx = this.symb.indexOf(s);
	if (idx === -1) {
		this.errMsg("symbol " + s + " unknown", [" "]);
		return false;
	}

	return idx;
}



// check : check whether the arg elt is on the head of the list
GiftParser.prototype.check = function (s, input) {
	if (this.accept(input[0]) == this.accept(s)) {
		return true;
	}
	return false;
}

// expect : expect the next symbol to be s.
GiftParser.prototype.expect = function (s, input) {
	if (s == this.next(input)) {
		return true;
	} else {
		this.errMsg("symbol " + s + " doesn't match", input);
	}
	return false;
}


// Parser rules

GiftParser.prototype.listQuestion = function (input) {
	this.question(input);
}


// Decoupe la liste de lignes en questions (Titre, intitule, corps)
GiftParser.prototype.question = function (input) {
	var lignes = input.toString().split("\n");
	var sansCommentaires = lignes.filter(function (ligne) {
		return ligne.indexOf('//') != 0;
	});
	sansCommentaires.toString().replace(/(^[ \t]*\n)/gm, "");

	var titres = [];
	var intitules = [];
	var corps = [];
	var type;

	var index = 0;
	var indexes = [];
	for (var i = 0; i < sansCommentaires.length; i++) {
		if (sansCommentaires[i].includes("::")) {
			index = i;
			indexes.push(index);
			var sousLigne = sansCommentaires[i].split("::");
			titres[index] = sousLigne[1];
			corps[index] = "";
			if (sousLigne[2].includes("{") || sousLigne[2].includes("}")) {
				intitules[index] = "Si deux reponses vous sont demandees pour un meme champ, repondre pareil aux deux.";
				corps[index] += sousLigne[2] + "\n";
			} else {
				intitules[index] = sousLigne[2];
			}
		}

		if (index !== i) {
			corps[index] += sansCommentaires[i] + "\n";
		}
	}

	for (var i = 0; i < indexes.length; i++) {
		var q = new Question(i, null, corps[indexes[i]], null, null, null, null, titres[indexes[i]], intitules[indexes[i]]);
		this.parsedQuestion.push(q);
	}

	return true;

}

//Renvoie les questions parsees par le parser
GiftParser.prototype.getQuestions = function () {
	return this.parsedQuestion;
}

module.exports = GiftParser;
