Slides-Dynamiques 
=================

Projet de R&amp;D réalisé par Liesse NADJI, Philippe BENOIT et Abdoul karim CISSE.

Ce projet est la suite de ce qui a été fait par Aurelien GEANT et Julian DEMAREST l'an dernier. Il consiste à diffuser des slides utilisant la technologie SMIL/EAST sur des postes clients. Les changements de slides, les animations sont synchronisés entre tous les utilisateurs grâce aux Websocket.

Aujourd'hui, les animations sont fonctionnelles et le visionnage des slides se fait sans connexion à internet. Une authentification est désormais nécessaire pour accéder au websocket. Il est ausi possible d'enregistrer une session et d'accorder à certain client les droits d'animation.
    
La vesion actuel est la 0.6.0, n'hésitez pas à consulter son [changelog](https://github.com/AlexPernot/Slides-Dynamiques/wiki/Changelogs).

    
HOW TO
-----------------------------

Faites un *git clone* du projet ou téléchargez l'archive au format zip.
Après avoir installer node.js sur votre PC, faite simplement un :

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

Pour toutes informations supplémentaires, veuillez consulter notre [wiki](https://github.com/AlexPernot/Slides-Dynamiques/wiki).
