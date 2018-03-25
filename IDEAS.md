## Chromestore 
---
-> Monte un filesystem depuis une API

Il faut alors creer une image miroir du filesystem, qui ne contient que des mockfiles

Le mockfilesystem est monter dans le navigateur,et on peut le naviguer

Quand on souhaite telecharger / supprimer / modifier / streamer un fichier, on requete sur le vrai filesystem


## Metadata en base 
---
-> Quand un client crée un fichier, une metadata est stocké en base

-> Base relationelle : Une data par fichier, contient son nom, mime type, son chemin

-> NoSQL : Un document par client.

On genere l'arborescence depuis les metadatas stockées, et on genere l'interface graphique d'après l'arborescence.

Quand on interagit avec un fichier, on fait une requete sur le serveur FTP au chemin indiqué par la metadata du fichier


```json
idCLient : {
  dossier1 : {
    path : ...,

    fichier1 : {
      path: ...,
      dateCreated : ...,
      lastUpdated : ...,
      mimeType : ...,
      ...       
    },

    fichier2 : {
      ...
    }
  },

  dossier2 {
    ...
  }
  ...
}
```

## Couch + PouchDB
---
 Utiliser CouchDb / Pouchdb permettrait de repliquer l'index de l'utilisateur dans le WebSQL

 Fonctionnement : Quand le JSON de l'archi est generé par le backend, on le stock dans l'index qui correspond au client.

 Quand un client se connecte sur le front, il fait une requete au backend pour repliquer son index.

Le backend lui donne un token qui lui permet de repliquer son index jusqu'a ce que le token soit perimé, ou qu'il se logout.

Ainsi, des qu'un changement est effectuer sur l'archi du client, le backend n'a qu'a changer le document dans le couchDB, et les clients authorisés repliquerons automatiquement ces changements, mettant à jour l'UI.


