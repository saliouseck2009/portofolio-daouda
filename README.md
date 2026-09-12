# Cayor Électricité Générale

Site vitrine en français, réalisé en HTML, CSS et JavaScript natifs. Aucune installation de dépendances ni étape de compilation.

## Aperçu local

Depuis le dossier du projet :

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Ouvrir http://127.0.0.1:4173.

## Organisation

- `index.html` : contenus, navigation et sections du site.
- `css/style.css` : identité visuelle et adaptations desktop, tablette, mobile et impression.
- `js/site.js` : menu mobile, navigation active, filtres, galerie et préparation des demandes.
- `images/optimized/` : versions WebP des photographies existantes. Les originaux sont conservés.
- `documents/` : justificatifs accessibles depuis les références et le témoignage.

Les anciennes bibliothèques présentes dans le dépôt ne sont plus chargées par la page. Le site fonctionne sans CDN, police distante, bibliothèque JavaScript ou service de cartographie embarqué.

## Contact

L’hébergement est statique. Le formulaire prépare un e-mail à `cayoreg@gmail.com` dans la messagerie du visiteur, qui doit ensuite l’envoyer. Une solution de copie est proposée si aucune messagerie n’est configurée. Aucun message n’est envoyé automatiquement et aucune donnée de formulaire n’est enregistrée par le site.

Pour proposer un envoi directement depuis le site, il faudra connecter un service de formulaire ou une API de messagerie.

## Vérifications

- Navigation, menu mobile, filtres et galerie avec fermeture Échap et flèches du clavier.
- Présélection de l’expertise depuis les cartes de services.
- Liens locaux, documents, ancres, attributs d’images et syntaxe JavaScript.
- Contrôle visuel desktop, tablette et mobile ; absence de débordement horizontal entre 320 et 1440 pixels sur les largeurs vérifiées.

Le fichier `CNAME` existant est conservé. Cette refonte ne déclenche aucun déploiement.
