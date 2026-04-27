import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppColors } from '../constants/colors';
import { useAppTheme } from '../context/ThemeContext';
import type { TicketScreenProps } from '../navigation/types';

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

export function TicketScreen({ navigation, route }: TicketScreenProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { orderNumber, ticketCode, paymentMethod, total, lines } = route.params;

  const paymentLabel = useMemo(
    () => (paymentMethod === 'card' ? 'Tarjeta' : 'Efectivo'),
    [paymentMethod]
  );

  const finish = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Pedido registrado</Text>
        <Text style={styles.sub}>
          Presenta este ticket en barra o espera tu número en pantalla.
        </Text>

        <View style={styles.ticket}>
          <Text style={styles.brand}>Cafetería CECyte</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>Número de pedido</Text>
          <Text style={styles.emphasis}>{orderNumber}</Text>

          <Text style={[styles.label, styles.mt]}>Código</Text>
          <Text style={styles.code}>{ticketCode}</Text>

          <Text style={[styles.label, styles.mt]}>Forma de pago</Text>
          <Text style={styles.rowText}>{paymentLabel}</Text>

          <View style={styles.divider} />

          {lines.map((line, index) => (
            <View key={`${line.name}-${index}`} style={styles.lineRow}>
              <Text style={styles.lineName}>
                {line.quantity}× {line.name}
              </Text>
              <Text style={styles.linePrice}>
                {formatPrice(line.unitPrice * line.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.totalBar}>
            <Text style={styles.totalBarLabel}>Total</Text>
            <Text style={styles.totalBarValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.finishBtn} onPress={finish}>
          <Text style={styles.finishText}>Finalizar y nuevo pedido</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  sub: {
    marginTop: 8,
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  ticket: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  brand: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  mt: {
    marginTop: 14,
  },
  emphasis: {
    marginTop: 6,
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 1,
  },
  code: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 2,
  },
  rowText: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  lineName: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  linePrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 2,
    borderTopColor: colors.border,
  },
  totalBarLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  totalBarValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  finishBtn: {
    marginTop: 28,
    backgroundColor: colors.primary,
    borderRadius: 16,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  finishText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
  },
});
