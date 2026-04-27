import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../constants/colors';
import type { CategoryId } from '../types';

type Props = {
  onSelect: (id: CategoryId) => void;
};

type IconName = ComponentProps<typeof Ionicons>['name'];

const ITEMS: { id: CategoryId; label: string; icon: IconName }[] = [
    { id: 'postres', label: 'Postres', icon: 'ice-cream-outline' },
    { id: 'dulceria', label: 'Dulcería', icon: 'gift-outline' },
    { id: 'bebidas', label: 'Bebidas', icon: 'cafe-outline' },
    { id: 'alimentos', label: 'Alimentos', icon: 'fast-food-outline' },
  ];

export function CategoryGrid({ onSelect }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Categorías</Text>
      <View style={styles.grid}>
        {ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.circleBtn}
            onPress={() => onSelect(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`Abrir categoría ${item.label}`}
          >
            <View style={styles.circleInner}>
              <Ionicons name={item.icon} size={32} color={colors.primary} />
            </View>
            <Text style={styles.circleLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  circleBtn: {
    width: '48%',
    alignItems: 'center',
  },
  circleInner: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  circleLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
