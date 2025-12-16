import { Translations } from "./en"

const fr: Translations = {
  common: {
    ok: "OK !",
    cancel: "Annuler",
    back: "Retour",
  },
  welcomeScreen: {
    postscript:
      "psst  — Ce n'est probablement pas à quoi ressemble votre application. (À moins que votre designer ne vous ait donné ces écrans, dans ce cas, mettez la en prod !)",
    readyForLaunch: "Votre application, presque prête pour le lancement !",
    exciting: "(ohh, c'est excitant !)",
  },
  errorScreen: {
    title: "Quelque chose s'est mal passé !",
    friendlySubtitle:
      "C'est l'écran que vos utilisateurs verront en production lorsqu'une erreur sera lancée. Vous voudrez personnaliser ce message (situé dans `app/i18n/fr.ts`) et probablement aussi la mise en page (`app/screens/ErrorScreen`). Si vous voulez le supprimer complètement, vérifiez `app/app.tsx` pour le composant <ErrorBoundary>.",
    reset: "RÉINITIALISER L'APPLICATION",
  },
  emptyStateComponent: {
    generic: {
      heading: "Si vide... si triste",
      content:
        "Aucune donnée trouvée pour le moment. Essayez de cliquer sur le bouton pour rafraîchir ou recharger l'application.",
      button: "Essayons à nouveau",
    },
  },
  homeScreen: {
    title: "Invygo Shop",
    searchPlaceholder: "Rechercher des voitures...",
    filters: "Filtres",
    noCarsFound: "Aucune voiture trouvée",
    loadingCars: "Chargement des voitures...",
  },
  carDetailsScreen: {
    rentPerDay: "Location: ${{price}}/jour",
    specs: "Spécifications:",
    availableColors: "Couleurs disponibles:",
    selectColor: "Veuillez sélectionner une couleur",
    buyNow: "Acheter maintenant",
    carNotFound: "Voiture non trouvée",
  },
  checkoutModal: {
    title: "Paiement",
    color: "Couleur: {{color}}",
    total: "Total: ${{price}}",
    cardNumber: "Numéro de carte",
    cardHolder: "Nom du titulaire",
    expiryDate: "Date d'expiration",
    cvv: "CVV",
    confirmBuy: "Confirmer l'achat",
  },
  successModal: {
    title: "Félicitations!",
    message: "Vous avez acheté la voiture avec succès!",
  },
  settingsScreen: {
    title: "Paramètres",
    theme: "Thème",
    language: "Langue",
    dark: "Sombre",
    light: "Clair",
    arabic: "Arabe",
    english: "Anglais",
  },
}

export default fr
