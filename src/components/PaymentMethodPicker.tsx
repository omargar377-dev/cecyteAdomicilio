import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { AppColors } from '../constants/colors';
import { useAppTheme } from '../context/ThemeContext';
import type { PaymentMethod } from '../types';

type Props = {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
};

export function PaymentMethodPicker({ value, onChange }: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Forma de pago</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.option, value === 'card' && styles.optionSelected]}
          onPress={() => onChange('card')}
          accessibilityRole="button"
          accessibilityState={{ selected: value === 'card' }}
        >
          <Ionicons
            name="card-outline"
            size={26}
            color={value === 'card' ? colors.white : colors.primary}
          />
          <Text
            style={[styles.optionText, value === 'card' && styles.optionTextOn]}
          >
            Tarjeta
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, value === 'cash' && styles.optionSelected]}
          onPress={() => onChange('cash')}
          accessibilityRole="button"
          accessibilityState={{ selected: value === 'cash' }}
        >
          <Ionicons
            name="cash-outline"
            size={26}
            color={value === 'cash' ? colors.white : colors.primary}
          />
          <Text
            style={[styles.optionText, value === 'cash' && styles.optionTextOn]}
          >
            Efectivo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
  wrap: {
    marginTop: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 52,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  optionTextOn: {
    color: colors.white,
  },
});
