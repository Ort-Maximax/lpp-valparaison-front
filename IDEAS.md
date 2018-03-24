## Chromestore 
-> Monte un filesystem depuis une API

Il faut alors creer une image miroir du filesystem, qui ne contient que des mockfiles

Le mockfilesystem est monter dans le navigateur,et on peut le naviguer

Quand on souhaite telecharger / supprimer / modifier / streamer un fichier, on requete sur le vrai filesystem

---

## Metadata en base 
-> Quand un client crée un fichier, une metadata est stocké en base

-> Base relationelle : Une data par fichier, contient son nom, mime type, son chemin

-> NoSQL : Un document par client.

 Utiliser CouchDb / Pouchdb permettrait de repliquer l'index de l'utilisateur dans le WebSQL


```javascript
idCLient : {
  	dossier1 : {
      path : ...,

      fichier1 : {
        path: ...,
        dateCreated : ...,
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

On genere l'arborescence depuis les metadatas stockées, et on genere l'interface graphique.

Quand on interagit avec un fichier, on fait une requete sur le serveur FTP au chemin indiqué par la metadata du fichier

Quand on fait une operation qui modifie l'arborescence, le backend change le document dans le couchDB. Ce dernier est repliquer dans le pouchDB du front, et l'UI est mis à jour 
