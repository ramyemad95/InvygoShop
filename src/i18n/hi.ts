import { Translations } from "./en"

const hi: Translations = {
  common: {
    ok: "ठीक है!",
    cancel: "रद्द करें",
    back: "वापस",
  },
  welcomeScreen: {
    postscript:
      "psst - शायद आपका ऐप ऐसा नहीं दिखता है। (जब तक कि आपके डिजाइनर ने आपको ये स्क्रीन नहीं दी हों, और उस स्थिति में, इसे लॉन्च करें!)",
    readyForLaunch: "आपका ऐप, लगभग लॉन्च के लिए तैयार है!",
    exciting: "(ओह, यह रोमांचक है!)",
  },
  errorScreen: {
    title: "कुछ गलत हो गया!",
    friendlySubtitle:
      "यह वह स्क्रीन है जो आपके उपयोगकर्ता संचालन में देखेंगे जब कोई त्रुटि होगी। आप इस संदेश को बदलना चाहेंगे (जो `app/i18n/hi.ts` में स्थित है) और शायद लेआउट भी (`app/screens/ErrorScreen`)। यदि आप इसे पूरी तरह से हटाना चाहते हैं, तो `app/app.tsx` में <ErrorBoundary> कंपोनेंट की जांच करें।",
    reset: "ऐप रीसेट करें",
  },
  emptyStateComponent: {
    generic: {
      heading: "इतना खाली... इतना उदास",
      content: "अभी तक कोई डेटा नहीं मिला। रीफ्रेश करने या ऐप को पुनः लोड करने के लिए बटन दबाएं।",
      button: "चलो फिर से कोशिश करते हैं",
    },
  },
  homeScreen: {
    title: "Invygo Shop",
    searchPlaceholder: "कार खोजें...",
    filters: "फ़िल्टर",
    noCarsFound: "कोई कार नहीं मिली",
    loadingCars: "कारें लोड हो रही हैं...",
  },
  carDetailsScreen: {
    rentPerDay: "किराया: ${{price}}/दिन",
    specs: "विशिष्टताएं:",
    availableColors: "उपलब्ध रंग:",
    selectColor: "कृपया एक रंग चुनें",
    buyNow: "अभी खरीदें",
    carNotFound: "कार नहीं मिली",
  },
  checkoutModal: {
    title: "चेकआउट",
    color: "रंग: {{color}}",
    total: "कुल: ${{price}}",
    cardNumber: "कार्ड नंबर",
    cardHolder: "कार्ड धारक का नाम",
    expiryDate: "समाप्ति तिथि",
    cvv: "CVV",
    confirmBuy: "खरीदारी की पुष्टि करें",
  },
  successModal: {
    title: "बधाई हो!",
    message: "आपने सफलतापूर्वक कार खरीदी!",
  },
  settingsScreen: {
    title: "सेटिंग्स",
    theme: "थीम",
    language: "भाषा",
    dark: "डार्क",
    light: "लाइट",
    arabic: "अरबी",
    english: "अंग्रेजी",
  },
}

export default hi
