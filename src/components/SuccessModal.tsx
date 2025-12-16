import React from "react"
import { View, StyleSheet, Modal } from "react-native"
import { useAppTheme } from "@/theme/context"
import { Screen } from "./Screen"
import { Text } from "./Text"
import { Button } from "./Button"

interface SuccessModalProps {
  visible: boolean
  onClose: () => void
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onClose }) => {
  const { theme } = useAppTheme()

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <Text preset="heading" text="🎉" style={styles.emoji} />
          <Text preset="heading" text="Congratulations!" style={styles.title} />
          <Text text="You successfully bought the car!" style={styles.message} />
          <Button text="OK" preset="filled" onPress={onClose} style={styles.button} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    minWidth: 120,
  },
})

