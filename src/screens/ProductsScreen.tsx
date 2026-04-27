import { Ionicons } from '@expo/vector-icons';
import React, { useLayoutEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductRow } from '../components/ProductRow';
import { colors } from '../constants/colors';
import { useCart } from '../context/CartContext';
import { getProductsByCategory } from '../data/mockProducts';
import type { ProductsScreenProps } from '../navigation/types';

export function ProductsScreen({ navigation, route }: ProductsScreenProps) {
  const { categoryId } = route.params;
  const { items, getQuantity, increment, decrement } = useCart();

  const products = getProductsByCategory(categoryId);

  const cartQty = (pid: string) => getQuantity(pid);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerCart}
          onPress={() => navigation.navigate('Cart')}
          accessibilityRole="button"
          accessibilityLabel="Ir al carrito"
        >
          <Ionicons name="cart-outline" size={26} color={colors.primaryDark} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <FlatList
        data={products}
        extraData={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay productos en esta categoría.</Text>
        }
        renderItem={({ item }) => (
          <ProductRow
            product={item}
            quantity={cartQty(item.id)}
            onIncrement={() => increment(item)}
            onDecrement={() => decrement(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: colors.muted,
  },
  headerCart: {
    marginRight: 4,
    padding: 8,
  },
});
