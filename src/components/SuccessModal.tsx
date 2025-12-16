import { type FC } from "react"
import { View, StyleSheet, Modal } from "react-native"

import { useAppTheme } from "@/theme/context"

import { Button } from "./Button"
import { Text } from "./Text"

interface SuccessModalProps {
  visible: boolean
  onClose: () => void
}

export const SuccessModal: FC<SuccessModalProps> = ({ visible, onClose }) => {
  const { theme } = useAppTheme()

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: theme.colors.palette.overlay50 }]}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <Text preset="heading" text="🎉" style={styles.emoji} />
          <Text preset="heading" tx="successModal:title" style={styles.title} />
          <Text tx="successModal:message" style={styles.message} />
          <Button tx="common:ok" preset="filled" onPress={onClose} style={styles.button} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  button: {
    minWidth: 120,
  },
  container: {
    alignItems: "center",
    borderRadius: 16,
    padding: 24,
    width: "80%",
  },
  emoji: {
    fontSize: 64,
    lineHeight: 72,
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  overlay: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
})
