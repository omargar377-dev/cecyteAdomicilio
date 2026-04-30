import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { AppColors } from '../constants/colors';
import { useAppTheme } from '../context/ThemeContext';

type Props = {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onCartPress: () => void;
  onAuthPress: () => void;
  cartCount: number;
  isAuthenticated: boolean;
};

export function TopBar({
  searchQuery,
  onSearchChange,
  onCartPress,
  onAuthPress,
  cartCount,
  isAuthenticated,
}: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <View style={styles.logoWrap}>
        <TouchableOpacity
          style={styles.logoButton}
          onPress={onAuthPress}
          accessibilityRole="button"
          accessibilityLabel={
            isAuthenticated ? 'Cuenta autenticada CECyte' : 'Abrir autenticación'
          }
        >
          <Text style={styles.logoText}>☕</Text>
          <Text
            style={[
              styles.logoLabel,
              isAuthenticated && styles.logoLabelAuthenticated,
            ]}
          >
            CECyte
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons
          name="search"
          size={18}
          color={colors.muted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
          accessibilityLabel="Buscar productos"
        />
      </View>

      <View style={styles.actionsWrap}>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={onCartPress}
          accessibilityRole="button"
          accessibilityLabel="Ver carrito"
        >
          <Ionicons name="cart-outline" size={26} color={colors.primaryDark} />
          {cartCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  logoWrap: {
    alignItems: 'center',
    minWidth: 56,
  },
  logoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 56,
    borderRadius: 10,
    paddingHorizontal: 2,
  },
  logoText: {
    fontSize: 28,
  },
  logoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginTop: -2,
  },
  logoLabelAuthenticated: {
    color: colors.accent,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    minHeight: 48,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 8,
  },
  actionsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
