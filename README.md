[![forthebadge](https://forthebadge.com/images/badges/powered-by-electricity.svg)](https://forthebadge.com)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FOrt-Maximax%2Flpp-valparaiso-front.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FOrt-Maximax%2Flpp-valparaiso-front?ref=badge_shield) [![Build Status](https://travis-ci.org/Ort-Maximax/lpp-valparaiso-front.svg?branch=react)](https://travis-ci.org/Ort-Maximax/lpp-valparaiso-front) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/add09b5c9e3b4e03a6fdd9a5ec02c072)](https://www.codacy.com/app/EISAWESOME/lpp-valparaiso-front?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Ort-Maximax/lpp-valparaiso-front&amp;utm_campaign=Badge_Grade) 

# client

> Web client for Valparaiso project
> https://valparaiso.netlify.com/

## Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload
yarn start

# build for production
yarn build

# serve build locally
yarn serve:build

```

## Hostname

Pour afficher le hostname dans le browser :
- Dans le container Docker, dans le repertoire 'build' avant de serve 
``` javascript
 echo "setTimeout(() => {document.querySelector('#hostname').innerHTML = '`hostname`';}, 300);" > ./hostname.js 
```
- Ca va creer un fichier hostname.js et y ecrire un script qui stock le hostname de la machine, et l'inscrit dans le DOM


## License 

MIT.



