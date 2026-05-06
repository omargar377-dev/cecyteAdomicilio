import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { AppColors } from '../constants/colors';
import { useAppTheme } from '../context/ThemeContext';
import type { CartItem } from '../types';
import { useCart } from '../context/CartContext';

type Props = {
  item: CartItem;
};

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

export function CartLineItem({ item }: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { decrement } = useCart();
  const lineTotal = item.product.price * item.quantity;
  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={styles.name}>{item.product.name}</Text>
        <Text style={styles.meta}>
          {formatPrice(item.product.price)} × {item.quantity}
        </Text>
      </View>
      <View style={styles.rightCol}>
        <Text style={styles.lineTotal}>{formatPrice(lineTotal)}</Text>
        <TouchableOpacity
          onPress={() => decrement(item.product)}
          style={styles.removeBtn}
          accessibilityRole="button"
          accessibilityLabel="Quitar una unidad de este producto del carrito"
        >
          <Text style={styles.removeText}>Quitar 1</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  textCol: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    marginTop: 4,
    fontSize: 15,
    color: colors.muted,
  },
  lineTotal: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  removeBtn: {
    marginTop: 4,
  },
  removeText: {
    fontSize: 13,
    color: colors.muted,
    textDecorationLine: 'underline',
  },
});
