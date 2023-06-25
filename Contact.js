const fs = require('fs');
const prompt = require('prompt-sync')();


const regex_tel = /^(0[1-9]\d{8}|0[1-9]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}|0[1-9]\-?\d{2}\-?\d{2}\-?\d{2}\-?\d{2})$/;
const regex_email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const regex_date = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

var Contact = function (id, n, p, a, d, email, t) {
  this.nom = n;
  this.prenom = p
  this.Adresse = a;
  this.DateNaiss = d;
  this.email = email;
  this.identifiant = 0;
  this.tel = t;

}
Contact.prototype.creerContact = function () {

  console.log('--------------------------------------------Structure du Contact---------------------------------------------\n');
  this.nom = prompt('-Entrer le nom du contact : ');
  if (typeof this.nom !== "string") {
    console.log("Erreur dans la donnée, fin de la création de contact");
    return 0;
  }
  this.prenom = prompt('-Entrer le prénom du contact : ');
  if (typeof this.prenom !== "string") {
    console.log("Erreur dans la donnée, fin de la création de contact");
    return 0;
  }
  this.Adresse = prompt("-Entrer l'adresse du contact : ");
  if (typeof this.Adresse !== "string") {
    console.log("Erreur dans la donnée, fin de la création de contact");
    return 0;
  }
  this.DateNaiss = prompt('-Entrer la date de naissance du contact: JJ/MM/AAAA  ');
  if (!regex_date.test(this.DateNaiss)) {
    console.log("Erreur dans la donnée, fin de la création de contact");
    return 0;
  }
  this.email = prompt("-Entrer l'email du contact: exemple@utt.fr  ");
  if (!regex_email.test(this.email)) {
    console.log("Erreur dans la donnée, fin de la création de contact");
    return 0;
  }
  this.tel = prompt('-Entrer le teléphone du contact : 00-00-00-00-00 ou 0000000000 ');
  if (!regex_tel.test(this.tel)) {
    console.log("Erreur dans la donnée, fin de la création de contact");
    return 0;
  }

  this.identifiant = this.identifiant + 1;

  // test savoir si contact existe deja
  try {
    var file = new fs.statSync(this.nom + "_" + this.prenom + ".vcf");
    console.log("Contact deja existant, pas de création de contact");
    return 0;
  } catch {

  }


  console.log('\n--------------------------------------------------Resultat---------------------------------------------------\n');

  var ecriture = fs.createWriteStream(this.nom + "_" + this.prenom + ".vcf");
  ecriture.write("BEGIN:VCARD\nVERSION:4.0\n");

  ecriture.write(this.identifiant + "." + 'nom' + '; ' + ":" + this.nom + "\n");
  ecriture.write("." + 'prenom' + '; ' + ":" + this.prenom + "\n");
  ecriture.write("." + 'adresse' + '; ' + ":" + this.Adresse + "\n");
  ecriture.write("." + 'date de naissance' + '; ' + ":" + this.DateNaiss + "\n");
  ecriture.write("." + 'email' + '; ' + ":" + this.email + "\n");
  ecriture.write("." + 'tel' + '; ' + ":" + this.tel + "\n");
  ecriture.write("END:VCARD\n");

  ecriture.end();
  console.log('Le fichier ' + this.nom + "_" + this.prenom + ".vcf" + " a ete cree avec succes !");
  console.log('\n--------------------------------------------------------------------------------------------------------------\n');

  console.log('\n--------------------------------------------------------------------------------------------------------------\n');
}
module.exports = Contact;
