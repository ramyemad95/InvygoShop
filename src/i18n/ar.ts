import { Translations } from "./en"

const ar: Translations = {
  common: {
    ok: "نعم",
    cancel: "حذف",
    back: "خلف",
  },
  welcomeScreen: {
    postscript:
      "ربما لا يكون هذا هو الشكل الذي يبدو عليه تطبيقك مالم يمنحك المصمم هذه الشاشات وشحنها في هذه الحالة",
    readyForLaunch: "تطبيقك تقريبا جاهز للتشغيل",
    exciting: "اوه هذا مثير",
  },
  errorScreen: {
    title: "هناك خطأ ما",
    friendlySubtitle:
      "هذه هي الشاشة التي سيشاهدها المستخدمون في عملية الانتاج عند حدوث خطأ. سترغب في تخصيص هذه الرسالة ( الموجودة في 'ts.en/i18n/app') وربما التخطيط ايضاً ('app/screens/ErrorScreen'). إذا كنت تريد إزالة هذا بالكامل، تحقق من 'app/app.tsp' من اجل عنصر <ErrorBoundary>.",
    reset: "اعادة تعيين التطبيق",
  },
  emptyStateComponent: {
    generic: {
      heading: "فارغة جداً....حزين",
      content: "لا توجد بيانات حتى الآن. حاول النقر فوق الزر لتحديث التطبيق او اعادة تحميله.",
      button: "لنحاول هذا مرّة أخرى",
    },
  },
  homeScreen: {
    title: "متجر إنفيجو",
    searchPlaceholder: "البحث عن السيارات...",
    filters: "المرشحات",
    pullToRefresh: "اسحب للتحديث",
    priceRange: "نطاق السعر",
    minPrice: "الحد الأدنى",
    maxPrice: "الحد الأقصى",
    colors: "الألوان",
    reset: "إعادة تعيين",
    apply: "تطبيق",
    noCarsFound: "لم يتم العثور على سيارات",
    loadingCars: "جاري تحميل السيارات...",
  },
  carDetailsScreen: {
    rentPerDay: "الإيجار: ${{price}}/يوم",
    specs: "المواصفات:",
    availableColors: "الألوان المتاحة:",
    selectColor: "يرجى اختيار لون",
    buyNow: "اشتري الآن",
    carNotFound: "السيارة غير موجودة",
  },
  checkoutModal: {
    title: "الدفع",
    color: "اللون: {{color}}",
    total: "المجموع: ${{price}}",
    cardNumber: "رقم البطاقة",
    cardHolder: "اسم حامل البطاقة",
    expiryDate: "تاريخ الانتهاء",
    cvv: "CVV",
    confirmBuy: "تأكيد الشراء",
    processing: "جاري المعالجة...",
    cardNumberError: "أدخل رقم بطاقة مكونًا من 16 رقمًا.",
    cardHolderError: "اسم حامل البطاقة مطلوب.",
    expiryFormatError: "استخدم صيغة MM/YY.",
    expiryMonthError: "أدخل شهرًا صالحًا.",
    cvvError: "أدخل رمز CVV مكونًا من 3 أرقام.",
  },
  successModal: {
    title: "تهانينا!",
    message: "لقد اشتريت السيارة بنجاح!",
  },
  settingsScreen: {
    title: "الإعدادات",
    theme: "المظهر",
    language: "اللغة",
    dark: "داكن",
    light: "فاتح",
    arabic: "العربية",
    english: "الإنجليزية",
  },
}

export default ar
