import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import type { AppColors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { ordersService } from '../infrastructure/services';
import type { HistoryScreenProps } from '../navigation/types';
import type { OrderRecord } from '../types';

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export function HistoryScreen({ navigation }: HistoryScreenProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { isAuthenticated, userEmail } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!userEmail) {
      setOrders([]);
      return;
    }
    setLoading(true);
    try {
      const list = await ordersService.listOrdersForUser(userEmail);
      setOrders(list);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (!isAuthenticated || !userEmail) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.emptyWrap}>
          <Text style={styles.title}>Historial</Text>
          <Text style={styles.sub}>
            Inicia sesión para ver tu historial de compras.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryBtnText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      {orders.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.title}>Historial</Text>
          <Text style={styles.sub}>Aún no tienes compras registradas.</Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.primaryBtnText}>Hacer un pedido</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.orderNumber}>{item.orderNumber}</Text>
                <Text style={styles.total}>{formatPrice(item.total)}</Text>
              </View>
              <Text style={styles.meta}>
                {formatDate(item.createdAt)} ·{' '}
                {item.paymentMethod === 'card' ? 'Tarjeta' : 'Efectivo'}
              </Text>
              <Text style={styles.meta}>
                {item.lines.reduce((sum, l) => sum + l.quantity, 0)} artículos
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    list: {
      padding: 16,
      paddingBottom: 32,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    orderNumber: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
    },
    total: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.primary,
    },
    meta: {
      marginTop: 6,
      fontSize: 14,
      color: colors.muted,
    },
    emptyWrap: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: '900',
      color: colors.text,
      textAlign: 'center',
    },
    sub: {
      marginTop: 10,
      fontSize: 15,
      lineHeight: 22,
      color: colors.muted,
      textAlign: 'center',
    },
    primaryBtn: {
      marginTop: 18,
      minHeight: 48,
      paddingHorizontal: 18,
      borderRadius: 14,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryBtnText: {
      color: colors.white,
      fontSize: 15,
      fontWeight: '800',
    },
  });

