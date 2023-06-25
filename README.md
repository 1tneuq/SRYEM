# Projet SRYEM

## Description générale du projet

Réalisation d’un utilitaire en invite de commandes qui permettra aux gestionnaires et enseignants de composer des tests au format GIFT à partir d’une large banque de questions certifiées dont disposeront les différents services.
Ce logiciel devra aussi avoir un certain nombre de fonctions qui permettront la vérification des tests composés par les enseignants ainsi que la comparaison des tests à des fichiers témoins.


## Specifications demandées

1. Créer un examen
2. Recherche une question
3. Passer l’examen
4. Vérifier l’examen
5. Créer la fiche contact
6. Générer un histogramme
7. Comparer l’histogramme

8. Logiciel en invite de commandes
9. Les comparaisons entre un examen et la banque de questions sont sous forme d’histogramme


## Dépendances - installation des modules manquants

```bash
npm install
```


## Logiciel

```
caporalKlient v1.0

USAGE

    node caporalKlient.js <commande> <argument(s)>

COMMANDES 

    examC <fichier> : crée un examen avec comme nom nomFichier entré en argument. Demande a l'utilisateur un ensemble de données pour crée cet examen.

    examP <fichier> : permet à l'utilisateur de répondre à l'examen d'un fichier GIFT, d'obtenir sa note et la correction

    contact : crée un contact en fonction des données demandées à l'utilisateur

    histo <fichier> : crée un histogramme en fonction du fichier GIFT donné, qui visualise le pourcentage de chaque type de question dans l'examen analysé, ou banque de questions

    histoC <fichier1,fichier2> : crée un histogramme de comparaison des fichiers GIFTS donnés, pour visualiser les similitudes

    parser <fichier> : parse le fichier .GIFT entré en 3 blocs distincts : id, contenu et réponses

```


## Tests (TestUnit)

```
node Tests/TestsUnit.js
```


## Bugs connus :

- Problèmes avec le parser Gift-pegjs, dus à la grande variété de syntaxes dans la banque de données
- Certains types de questions ne sont pas bien traités (en lien avec le parser), notemment les questions de type appariement


## Ecarts au cahier des charges :

- De nombreuses données optionnelles de la spec 5 ont été omises pour des questions pratiques.
- L'attribut "sequentiel" de Question n'est pas utilisé car nous ne savions pas à quoi il correspondait
- L'ABNF de vCard, sans explication complémentaire, est partiellement incomprehensible. En particulier le passage sur les param-value.
- Dans la spec 1, il était demandé d'arreter la création de l'examen en fin de processus avec affichage d'une erreur en cas de mauvais type de donnée entré par l'utilisateur. Au lieu de cela, nous avons opté pour une redemande de champ afin que l'utilisateur n'ait pas à tout recommencer.
- Dans les spec 3 et 4, il est demandé d'utiliser une liste de diffusion pour envoyer le formaulaire; pour des raisons de temps nous n'avons pas implémenté ces options, celles restantes sont donc la possibilité de répondre aux questions d'un examen, et d'obtenir leur correction ainsi que la note qui va avec.
- Dans la spec 1, la fonctionnalité pour vérifier la certification d'un examen était floue, nous avons donc opté pour une génération aléatoire de certification.


### Contributeurs

Développeurs : Equipe Exotik

- Julien CRABOS
- Fabien PETIT
- Quentin LACOMBE


Mainteneurs : Equipe HDEZ

- Eve BERNHARD
- Dorian LADRUZE
- Hugo EFLIGENIR
- Kaixuan ZHANG

