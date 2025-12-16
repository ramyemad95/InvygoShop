import { Translations } from "./en"

const es: Translations = {
  common: {
    ok: "OK",
    cancel: "Cancelar",
    back: "Volver",
  },
  welcomeScreen: {
    postscript:
      "psst — Esto probablemente no es cómo se va a ver tu app. (A menos que tu diseñador te haya enviado estas pantallas, y en ese caso, ¡lánzalas en producción!)",
    readyForLaunch: "Tu app, casi lista para su lanzamiento",
    exciting: "(¡ohh, esto es emocionante!)",
  },
  errorScreen: {
    title: "¡Algo salió mal!",
    friendlySubtitle:
      "Esta es la pantalla que verán tus usuarios en producción cuando haya un error. Vas a querer personalizar este mensaje (que está ubicado en `app/i18n/es.ts`) y probablemente también su diseño (`app/screens/ErrorScreen`). Si quieres eliminarlo completamente, revisa `app/app.tsx` y el componente <ErrorBoundary>.",
    reset: "REINICIA LA APP",
  },
  emptyStateComponent: {
    generic: {
      heading: "Muy vacío... muy triste",
      content:
        "No se han encontrado datos por el momento. Intenta darle clic en el botón para refrescar o recargar la app.",
      button: "Intentemos de nuevo",
    },
  },
  homeScreen: {
    title: "Invygo Shop",
    searchPlaceholder: "Buscar coches...",
    filters: "Filtros",
    noCarsFound: "No se encontraron coches",
    loadingCars: "Cargando coches...",
  },
  carDetailsScreen: {
    rentPerDay: "Alquiler: ${{price}}/día",
    specs: "Especificaciones:",
    availableColors: "Colores disponibles:",
    selectColor: "Por favor seleccione un color",
    buyNow: "Comprar ahora",
    carNotFound: "Coche no encontrado",
  },
  checkoutModal: {
    title: "Pago",
    color: "Color: {{color}}",
    total: "Total: ${{price}}",
    cardNumber: "Número de tarjeta",
    cardHolder: "Nombre del titular",
    expiryDate: "Fecha de vencimiento",
    cvv: "CVV",
    confirmBuy: "Confirmar compra",
  },
  successModal: {
    title: "¡Felicidades!",
    message: "¡Compraste el coche con éxito!",
  },
  settingsScreen: {
    title: "Configuración",
    theme: "Tema",
    language: "Idioma",
    dark: "Oscuro",
    light: "Claro",
    arabic: "Árabe",
    english: "Inglés",
  },
}

export default es
