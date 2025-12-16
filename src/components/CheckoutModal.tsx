import React, { useState } from "react"
import { View, StyleSheet, Modal, ScrollView } from "react-native"
import { useAppTheme } from "@/theme/context"
import { Car } from "@/types/car"
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

  const handleConfirm = () => {
    // Validate form (simplified)
    if (cardNumber && cardHolder && expiryDate && cvv) {
      setIsProcessing(true)
      onConfirm()
    }
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
          <Text preset="heading" text="Checkout" style={styles.title} />

          <View style={styles.carSummary}>
            <Text preset="subheading" text={`${car.brand} ${car.name}`} />
            <Text text={`Color: ${selectedColor}`} />
            <Text preset="subheading" text={`Total: $${car.price.toLocaleString()}`} />
          </View>

          <View style={styles.form}>
            <Text preset="formLabel" text="Card Number" />
            <TextField
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              maxLength={19}
            />

            <Text preset="formLabel" text="Card Holder Name" style={styles.label} />
            <TextField placeholder="John Doe" value={cardHolder} onChangeText={setCardHolder} />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text preset="formLabel" text="Expiry Date" style={styles.label} />
                <TextField
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  maxLength={5}
                />
              </View>
              <View style={styles.halfWidth}>
                <Text preset="formLabel" text="CVV" style={styles.label} />
                <TextField
                  placeholder="123"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <Button text="Cancel" onPress={onClose} style={styles.button} disabled={isProcessing} />
            <Button
              text={isProcessing ? "Processing..." : "Confirm Buy"}
              preset="filled"
              onPress={handleConfirm}
              style={styles.button}
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
