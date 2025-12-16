import { Translations } from "./en"

const ja: Translations = {
  common: {
    ok: "OK",
    cancel: "キャンセル",
    back: "戻る",
  },
  welcomeScreen: {
    postscript:
      "注目！ — このアプリはお好みの見た目では無いかもしれません(デザイナーがこのスクリーンを送ってこない限りは。もしそうなら公開しちゃいましょう！)",
    readyForLaunch: "このアプリはもう少しで公開できます！",
    exciting: "(楽しみですね！)",
  },
  errorScreen: {
    title: "問題が発生しました",
    friendlySubtitle:
      "本番では、エラーが投げられた時にこのページが表示されます。もし使うならこのメッセージに変更を加えてください(`app/i18n/jp.ts`)レイアウトはこちらで変更できます(`app/screens/ErrorScreen`)。もしこのスクリーンを取り除きたい場合は、`app/app.tsx`にある<ErrorBoundary>コンポーネントをチェックしてください",
    reset: "リセット",
  },
  emptyStateComponent: {
    generic: {
      heading: "静かだ...悲しい。",
      content:
        "データが見つかりません。ボタンを押してアプリをリロード、またはリフレッシュしてください。",
      button: "もう一度やってみよう",
    },
  },
  homeScreen: {
    title: "Invygo Shop",
    searchPlaceholder: "車を検索...",
    filters: "フィルター",
    noCarsFound: "車が見つかりません",
    loadingCars: "車を読み込み中...",
  },
  carDetailsScreen: {
    rentPerDay: "レンタル: ${{price}}/日",
    specs: "仕様:",
    availableColors: "利用可能な色:",
    selectColor: "色を選択してください",
    buyNow: "今すぐ購入",
    carNotFound: "車が見つかりません",
  },
  checkoutModal: {
    title: "チェックアウト",
    color: "色: {{color}}",
    total: "合計: ${{price}}",
    cardNumber: "カード番号",
    cardHolder: "カード名義人",
    expiryDate: "有効期限",
    cvv: "CVV",
    confirmBuy: "購入を確認",
  },
  successModal: {
    title: "おめでとうございます！",
    message: "車の購入に成功しました！",
  },
  settingsScreen: {
    title: "設定",
    theme: "テーマ",
    language: "言語",
    dark: "ダーク",
    light: "ライト",
    arabic: "アラビア語",
    english: "英語",
  },
}

export default ja
