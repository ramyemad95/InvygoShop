import React, { useState } from "react"
import { View, StyleSheet, Modal, ScrollView } from "react-native"
import { useAppTheme } from "@/theme/context"
import { Car } from "@/types/car"
import { translate } from "@/i18n/translate"
import { Text } from "./Text"
import { TextField } from "./TextField"
import { Button } from "./Button"

interface CheckoutModalProps {
  visible: boolean
  car: Car
  selectedColor: string
  onConfirm: () => void
  onClose: () => void
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  visible,
  car,
  selectedColor,
  onConfirm,
  onClose,
}) => {
  const { theme } = useAppTheme()
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<{
    cardNumber?: string
    cardHolder?: string
    expiryDate?: string
    cvv?: string
  }>({})

  const handleCardNumberChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 16)
    const groups = digitsOnly.match(/.{1,4}/g) || []
    setCardNumber(groups.join(" "))
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: undefined }))
    }
  }

  const handleExpiryDateChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 4)
    if (digitsOnly.length <= 2) {
      setExpiryDate(digitsOnly)
      if (errors.expiryDate) {
        setErrors((prev) => ({ ...prev, expiryDate: undefined }))
      }
      return
    }

    const month = digitsOnly.slice(0, 2)
    const year = digitsOnly.slice(2, 4)
    setExpiryDate(`${month}/${year}`)
    if (errors.expiryDate) {
      setErrors((prev) => ({ ...prev, expiryDate: undefined }))
    }
  }

  const handleConfirm = () => {
    const newErrors: typeof errors = {}

    const cardNumberDigits = cardNumber.replace(/\s/g, "")
    if (cardNumberDigits.length !== 16) {
      newErrors.cardNumber = translate("checkoutModal:cardNumberError")
    }

    if (!cardHolder.trim()) {
      newErrors.cardHolder = translate("checkoutModal:cardHolderError")
    }

    const expiryMatch = expiryDate.match(/^(\d{2})\/(\d{2})$/)
    if (!expiryMatch) {
      newErrors.expiryDate = translate("checkoutModal:expiryFormatError")
    } else {
      const month = Number(expiryMatch[1])
      if (month < 1 || month > 12) {
        newErrors.expiryDate = translate("checkoutModal:expiryMonthError")
      }
    }

    if (!/^\d{3}$/.test(cvv)) {
      newErrors.cvv = translate("checkoutModal:cvvError")
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    setIsProcessing(true)
    onConfirm()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <View style={[styles.sheet, { backgroundColor: theme.colors.background }]}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <Text preset="heading" tx="checkoutModal:title" style={styles.title} />

          <View style={styles.carSummary}>
            <Text preset="subheading" text={`${car.brand} ${car.name}`} />
            <Text tx="checkoutModal:color" txOptions={{ color: selectedColor }} />
            <Text
              preset="subheading"
              tx="checkoutModal:total"
              txOptions={{ price: car.price.toLocaleString() }}
            />
          </View>

          <View style={styles.form}>
            <Text preset="formLabel" tx="checkoutModal:cardNumber" />
            <TextField
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              keyboardType="numeric"
              maxLength={19}
              status={errors.cardNumber ? "error" : undefined}
              helper={errors.cardNumber}
            />

            <Text preset="formLabel" tx="checkoutModal:cardHolder" style={styles.label} />
            <TextField
              placeholder="John Doe"
              value={cardHolder}
              onChangeText={(text) => {
                setCardHolder(text)
                if (errors.cardHolder) {
                  setErrors((prev) => ({ ...prev, cardHolder: undefined }))
                }
              }}
              status={errors.cardHolder ? "error" : undefined}
              helper={errors.cardHolder}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text preset="formLabel" tx="checkoutModal:expiryDate" style={styles.label} />
                <TextField
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={handleExpiryDateChange}
                  keyboardType="numeric"
                  maxLength={5}
                  status={errors.expiryDate ? "error" : undefined}
                  helper={errors.expiryDate}
                />
              </View>
              <View style={styles.halfWidth}>
                <Text preset="formLabel" tx="checkoutModal:cvv" style={styles.label} />
                <TextField
                  placeholder="123"
                  value={cvv}
                  onChangeText={(text) => {
                    const digitsOnly = text.replace(/\D/g, "").slice(0, 3)
                    setCvv(digitsOnly)
                    if (errors.cvv) {
                      setErrors((prev) => ({ ...prev, cvv: undefined }))
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                  status={errors.cvv ? "error" : undefined}
                  helper={errors.cvv}
                />
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              tx="common:cancel"
              onPress={onClose}
              style={styles.button}
              testID="checkout-cancel"
              disabled={isProcessing}
            />
            <Button
              tx={isProcessing ? undefined : "checkoutModal:confirmBuy"}
              text={isProcessing ? translate("checkoutModal:processing") : undefined}
              preset="filled"
              onPress={handleConfirm}
              style={styles.button}
              testID="checkout-confirm"
              disabled={isProcessing}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    paddingTop: 24,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  carSummary: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  form: {
    marginBottom: 24,
  },
  label: {
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: "auto",
  },
  button: {
    flex: 1,
  },
})
