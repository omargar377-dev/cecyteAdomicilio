import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { AppColors } from '../constants/colors';
import { useAppTheme } from '../context/ThemeContext';
import type { Product } from '../types';

type Props = {
  products: Product[];
};

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

export function BestSellersSection({ products }: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (products.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Artículos más vendidos</Text>
        <Text style={styles.empty}>Sin resultados para tu búsqueda.</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Artículos más vendidos</Text>
      <FlatList
        horizontal
        data={products}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
  },
  empty: {
    fontSize: 16,
    color: colors.muted,
  },
  listContent: {
    paddingRight: 8,
    gap: 14,
  },
  card: {
    width: 160,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginRight: 4,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  name: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    minHeight: 40,
  },
  price: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },
});
