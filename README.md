## Illustrations
- créer un logo
- mascotte pour la home page
- illustration de validité pour chaque scan sur sa page perso à gauche
- icone pour chaque face d'une sneaker et de la boite et documents
- icon de validité d'une photo sur sa page scan

## Pages

## Fonctionnalités
- mise en place alertes
- envoie d'email (confirmation compte, validité ou non d'un scan)
- mot de passe oublié
- commentaires et avis pour un scan
- sous menu dans admin par composants
- priorité et nom de l'authentificateur pour les scans
- ordre pour les scanfiles
- status scan(0 => fake, 1 => en attente, 2 => authentique, 3 => douteuse => faire voter la communauté)
- image resizer en backend
- files voting for user
- statistiques de validité du scan par rapport au nombre de photo validée (expert et comparer à la communauté)
- authentification a double facteurs (ajouter sms)
- redirection lors de déconnexion et private routes
- backend user abilities for comment

## BDD
- user(_id, username, email, fullName, password, roles, avatarFile*, avatarName*, createdAt, updatedAt*, country*, bannedAt*, confirmationToken*, theme*, lastLoginIP*,
  lastLoginAt*)
  
- emailVerification(_id, email, author, createdAt, token)
  
- scan (_id, title, description, status, isVisible, createdAt, updatedAt, user, scan_files[])
  
- scan_file (_id, original_name, current_name, size, extension, category, status, orientation, priority%, order%, votesCount, scan_id)

- comments (_id, content, author: User, parent: Comment, replies: Comments[])

## Photos
- right, left, front, above, back, bottom
- box front, box tag-étiquette, inside box
- facture, lacets, languette, tags

## Descriptions
- Salut les bgs! J'ai un doute sur l'authenticité de cette paire que je veux acheter sur Vinted. J'ai besoin de votre aide. Merci d'avance.
- Petite authentification de cette paire de nike air max 90 svp ! Merci d'avance les bgs, je compte sur vous !
  
## Rappels
- Enlever _id in populate  '-_id'

## Devops
- Docker ou kubernetes
- Support déploiement le plus simple
- Réplication asynchrone de la bdd
- nom de domaine
- Répartition traffic
- Déploiement en une commande
- Logs de l'application
- Monitoring
- CICD

## Branches
- Dev, prod, master

## 
<div>
<h5 className="h5 mb2">Besoin d'aide ?</h5>
<p className="text-light">
<a className="underline">Clique ici</a> pour accéder à un exemple
de création de scans.
</p>
</div>