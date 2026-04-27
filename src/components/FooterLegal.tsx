import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CONTACT_EMAIL } from '../constants/contact';
import { colors } from '../constants/colors';

export function FooterLegal() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.line}>Derechos reservados © {new Date().getFullYear()}</Text>
      <Text style={styles.line}>Contacto: {CONTACT_EMAIL}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 32,
    marginBottom: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  line: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 6,
  },
});
