import React, { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartLineItem } from '../components/CartLineItem';
import { PaymentMethodPicker } from '../components/PaymentMethodPicker';
import { colors } from '../constants/colors';
import { useCart } from '../context/CartContext';
import type { CartScreenProps } from '../navigation/types';
import type { PaymentMethod } from '../types';

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

export function CartScreen({ navigation }: CartScreenProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [payment, setPayment] = useState<PaymentMethod>('cash');

  const pay = useCallback(() => {
    if (items.length === 0) return;

    const orderNumber = `#${Date.now().toString().slice(-8)}`;
    const ticketCode = `${Math.random().toString(36).substring(2, 6)}-${Math.random()
      .toString(36)
      .substring(2, 6)}`.toUpperCase();

    const lines = items.map((line) => ({
      name: line.product.name,
      quantity: line.quantity,
      unitPrice: line.product.price,
    }));

    navigation.replace('Ticket', {
      orderNumber,
      ticketCode,
      paymentMethod: payment,
      total: totalPrice,
      lines,
    });

    clearCart();
  }, [items, totalPrice, payment, navigation, clearCart]);

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySub}>
            Explora categorías y agrega productos con los botones +/
          </Text>
          <TouchableOpacity
            style={styles.ctaSecondary}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.ctaSecondaryText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <CartLineItem item={item} />}
            ListFooterComponent={
              <View style={styles.footer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
                </View>

                <PaymentMethodPicker value={payment} onChange={setPayment} />

                <TouchableOpacity
                  style={styles.payBtn}
                  onPress={pay}
                  accessibilityRole="button"
                  accessibilityLabel="Enviar pedido a cocina"
                >
                  <Text style={styles.payText}>Enviar pedido a cocina</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  footer: {
    marginTop: 16,
    paddingTop: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  payBtn: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 16,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  payText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyWrap: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  emptySub: {
    marginTop: 10,
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaSecondary: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ctaSecondaryText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },
});
