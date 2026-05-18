import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartLineItem } from '../components/CartLineItem';
import { PaymentMethodPicker } from '../components/PaymentMethodPicker';
import type { AppColors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useAppTheme } from '../context/ThemeContext';
import { ordersService } from '../infrastructure/services';
import { AuthModal } from '../features/auth/presentation/components/AuthModal';
import type { CartScreenProps } from '../navigation/types';
import type { PaymentMethod } from '../types';

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

export function CartScreen({ navigation }: CartScreenProps) {
  const { colors } = useAppTheme();
  const { isAuthenticated, userEmail, userName } = useAuth();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { items, totalPrice, clearCart } = useCart();
  const [payment, setPayment] = useState<PaymentMethod>('cash');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const pay = useCallback(async () => {
    if (items.length === 0) return;
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    if (!userEmail) {
      setShowAuthPrompt(true);
      return;
    }

    const orderNumber = `#${Date.now().toString().slice(-8)}`;
    const ticketCode = `${Math.random().toString(36).substring(2, 6)}-${Math.random()
      .toString(36)
      .substring(2, 6)}`.toUpperCase();

    const lines = items.map((line) => ({
      name: line.product.name,
      quantity: line.quantity,
      unitPrice: line.product.price,
    }));

    const orderRecord = {
      id: `o_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
      orderNumber,
      ticketCode,
      userEmail,
      userName,
      paymentMethod: payment,
      total: totalPrice,
      lines,
      createdAt: new Date().toISOString(),
    };

    try {
      await ordersService.appendOrder(orderRecord);
    } catch {
      // Si falla el guardado local, igual se muestra el ticket.
    }

    clearCart();

    navigation.replace('Ticket', {
      orderNumber,
      ticketCode,
      paymentMethod: payment,
      total: totalPrice,
      lines,
    });
  }, [
    items,
    totalPrice,
    payment,
    navigation,
    clearCart,
    isAuthenticated,
    userEmail,
    userName,
  ]);

  return (
    <>
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
      <Modal
        visible={showAuthPrompt}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAuthPrompt(false)}
      >
        <View style={styles.promptBackdrop}>
          <View style={styles.promptCard}>
            <Text style={styles.promptTitle}>Inicia sesión para continuar</Text>
            <Text style={styles.promptText}>
              Para enviar el pedido, autentícate con tu correo institucional
              @cecytebc.edu.mx.
            </Text>
            <TouchableOpacity
              style={styles.promptPrimary}
              onPress={() => {
                setShowAuthPrompt(false);
                setAuthOpen(true);
              }}
            >
              <Text style={styles.promptPrimaryText}>Abrir autenticación</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAuthPrompt(false)}>
              <Text style={styles.promptCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <AuthModal
        visible={authOpen}
        initialTab="login"
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
}

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
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
  promptBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  promptCard: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 18,
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.muted,
    marginBottom: 14,
  },
  promptPrimary: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptPrimaryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  promptCloseText: {
    marginTop: 12,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '700',
  },
});
