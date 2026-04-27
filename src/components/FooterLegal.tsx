import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CONTACT_EMAIL } from '../constants/contact';
import type { AppColors } from '../constants/colors';
import { useAppTheme } from '../context/ThemeContext';

export function FooterLegal() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.line}>Derechos reservados © {new Date().getFullYear()}</Text>
      <Text style={styles.line}>Contacto: {CONTACT_EMAIL}</Text>
    </View>
  );
}

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
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
