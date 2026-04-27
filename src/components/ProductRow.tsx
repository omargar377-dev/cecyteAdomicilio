import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../constants/colors';
import type { Product } from '../types';

type Props = {
  product: Product;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

export function ProductRow({
  product,
  quantity,
  onIncrement,
  onDecrement,
}: Props) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <View style={styles.stepper}>
          <TouchableOpacity
            style={[styles.stepBtn, quantity === 0 && styles.stepBtnMuted]}
            onPress={onDecrement}
            accessibilityRole="button"
            accessibilityLabel="Disminuir cantidad"
          >
            <Text style={styles.stepBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qty}>{quantity}</Text>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={onIncrement}
            accessibilityRole="button"
            accessibilityLabel="Aumentar cantidad"
          >
            <Text style={styles.stepBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: 92,
    height: 92,
    borderRadius: 14,
    backgroundColor: colors.border,
  },
  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  price: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  stepBtn: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnMuted: {
    opacity: 0.6,
  },
  stepBtnText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  qty: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    minWidth: 28,
    textAlign: 'center',
  },
});
