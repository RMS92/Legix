## Illustrations

- créer un logo
- mascotte pour la home page
- illustration de validité pour chaque scan sur sa page perso à gauche
- icone pour chaque face d'une sneaker et de la boite et documents
- icon de validité d'une photo sur sa page scan

## Pages

- statistique for scans

## Fonctionnalités Done

- mise en place alertes floating
- envoie d'email confirmation compte
- mot de passe oublié
- commentaires et avis pour un scan
- status scan(0 => fake, 1 => en attente, 2 => authentique, 3 => douteuse => faire voter la communauté)
- backend user abilities for comment
- système de notifications app (ex: Votre scan a été validé, réponse à un commentaire)
- pages mes notifications
- multiple animations modals
- change message erreur login page when user do not exists
- bloquer création scan si user pas connecté et private routes for role (frontend)
- ordre pour les scans

## Fonctionnalités TODO

- set more user infos in bdd (last login at, ip, updated at )
- nom de l'authentificateur pour les scans (expert field for scan)
- files voting for user on douteux scan
- flash messages class à la place de "object" (backend)
- admin for users (edit and view)
- faire tous les updated date
- image resizer en backend
- design stats page
- delete auto last notifications ou pagination notifications
- Edit admin and random profil information
- statistiques de validité du scan par rapport au nombre de photo validée (expert et comparer à la communauté)
- path submenu ex: scans -> scans title
- paypal module
- envoie email validité ou non d'un scan
- sous menu dans admin par composants
- ordre pour les scanfiles
- authentification a double facteurs (ajouter sms) et oauth (fb, gmail)
- verify abilities for notification route (a voir)

## fix

- when delete parent comment, delete children comment in front (1 comment not update)
- delete replies comment in bdd
- simplify code of remove and unlike file

## BDD

- user (_id, username, email, fullName, password, roles, avatarFile*, avatarName*, createdAt, updatedAt*, age*, country*,
  bannedAt*, deletedAt*, confirmationToken*, theme*, lastLoginIP*, lastLoginAt*)

- avatarFile (_id, original_name, current_name, size, extension)

- emailVerification (_id, email, author, createdAt, token)

- PasswordResetToken (_id, created_at, token, user)

- scan (_id, title, description, status, isVisible, createdAt, updatedAt, user, scan_files[])

- scan_file (_id, original_name, current_name, size, extension, category, status, orientation, priority%, order%,
  votesCount, scan_id)

- comments (_id, content, author: User, parent: Comment, replies: Comments[])

- notification (_id, user: User, message, url, channel="public", createdAt, target: Document)

## Photos

- right, left, front, above, back, bottom
- box front, box tag-étiquette, inside box
- facture, lacets, languette, tags

## Descriptions

- Salut les bgs! J'ai un doute sur l'authenticité de cette paire que je veux acheter sur Vinted. J'ai besoin de votre
  aide. Merci d'avance.
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