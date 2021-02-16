Slides-Dynamiques 
=================

Projet de R&amp;D réalisé par Alexis BOUTEMY, Latifa HASBILAALAOUI, Philippe PERROT et Assala SOUSSI.

Ce projet est la suite de ce qui a été fait par Liesse NADJI, Philippe BENOIT et Abdoul karim CISSE il y a 7 ans et par Aurelien GEANT et Julian DEMAREST il y a 8 ans. Il consiste à diffuser des slides utilisant la technologie SMIL/EAST sur des postes clients. Les changements de slides, les animations sont synchronisés entre tous les utilisateurs grâce aux Websocket. Les animations sont fonctionnelles et le visionnage des slides se fait sans connexion à internet. Une authentification est nécessaire pour accéder au websocket. Il est aussi possible d'enregistrer une session et d'accorder à certain client les droits d'animation.

Suite à une non-gérence du projet pendant 7 ans les modules node.js utilisés n'ont pas été mis à jour et sont devenus dépréciés ou obsolètes. De fait, le projet est devenu dysfonctionnant. Notre travail a consisté à mettre à jour les différents modules et corriger le code déprécié pour rendre le projet à nouve au fonctionnel.
    
La version actuel est la 0.8.0, n'hésitez pas à consulter son [changelog](https://github.com/OresteVisari/Slides-Dynamiques/wiki/Changelogs).

    
HOW TO
-----------------------------

Faites un *git clone* du projet ou téléchargez l'archive au format zip.
Après avoir installer node.js sur votre PC, il vous faudra vous placer au niveau du répertoire du projet et lancer un :

      npm install

Voir un :

      npm ci
En cas de problèmes.

Assurez-vous ensuite de modifier le certificat dans le dossier ssl_layer en générant le certificat avec openssl en indiquant l'adresse ip locale utilisée pour le serveur et en utilisant le mot de passe "slidedynamique". (Il s'agit des fichiers "cert.pm" et "key.pm")
Pour générer les certificat nous vous recommandons d'utiliser l'outil suivant: https://slproweb.com/products/Win32OpenSSL.html.
Une fois l'outil ouvert lancez la commande suivante : 

      req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
Puis, suivez les instructions.

Ensuite, pour lancer Slides-Dynamiques faite simplement un :

      node server.js

Le compte root à pour mot de passe : *lkp*

Tous les autres utilisateurs ont pour mot de passe : *comete*


FONCTIONNALITÉS
----------------

Voici les fonctionnalités offertes par notre projet :

- **Diffusion des changements de slides et des animations** sur tout les postes esclaves connectés.
- **Channel de discussion** permettant aux utilisateurs connectés de se parler.
- **Channel privé** permettant aux utilisateurs de se parler de manière privé.
- Diffusion de la présentation en **mode hors connexion**.
- **Diffusion de vidéo** synchronisée sur tout les postes esclaves connectés.
- **Enregistrement des sessions** effectués afin de pouvoir les rejouer.
- Possibilité au root d’**allouer des droits à un client**.
- Sécurisation du websocket par un **système d'authentification** et mise en place du **mode HTTPS**.
- Possibilité d'**uploader des diapositives**.
    

INFORMATIONS SUPPLÉMENTAIRES
-----------------------------

Pour toutes informations supplémentaires, veuillez consulter notre [wiki](https://github.com/OresteVisari/Slides-Dynamiques/wiki).
