import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { BestSellersSection } from '../components/BestSellersSection';
import { CategoryGrid } from '../components/CategoryGrid';
import { FooterLegal } from '../components/FooterLegal';
import { IntroOverlay } from '../components/IntroOverlay';
import { TopBar } from '../components/TopBar';
import type { AppColors } from '../constants/colors';
import { CONTACT_EMAIL } from '../constants/contact';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useAppTheme } from '../context/ThemeContext';
import { getBestSellers } from '../data/mockProducts';
import { AuthModal } from '../features/auth/presentation/components/AuthModal';
import type { AuthTab } from '../features/auth/domain/types';
import type { HomeScreenProps } from '../navigation/types';
import type { CategoryId } from '../types';

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { totalQuantity } = useCart();
  const { colors, isDark, toggleTheme } = useAppTheme();
  const { isAuthenticated, userName, userEmail, logout } = useAuth();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>('login');

  const handleIntroFinish = useCallback(() => {
    setShowIntro(false);
  }, []);

  const bestFiltered = useMemo(() => {
    const base = getBestSellers();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter((p) => p.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const openCategory = useCallback(
    (categoryId: CategoryId) => {
      navigation.navigate('Products', { categoryId });
    },
    [navigation]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.root}>
        <IntroOverlay visible={showIntro} onFinish={handleIntroFinish} />

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TopBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCartPress={() => navigation.navigate('Cart')}
            onAuthPress={() => {
              setAuthTab('login');
              setAuthOpen(true);
            }}
            cartCount={totalQuantity}
            isAuthenticated={isAuthenticated}
          />

          <CategoryGrid onSelect={openCategory} />

          <BestSellersSection products={bestFiltered} />

          <FooterLegal />
        </ScrollView>

        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(12, insets.bottom) },
          ]}
        >
          <TouchableOpacity
            style={styles.hamburger}
            onPress={() => setOptionsOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Opciones"
          >
            <Ionicons name="menu" size={26} color={colors.primaryDark} />
            <Text style={styles.hamburgerLabel}>Opciones</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={optionsOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setOptionsOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <TouchableOpacity
              style={styles.modalDismiss}
              activeOpacity={1}
              onPress={() => setOptionsOpen(false)}
            />
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Opciones</Text>
              <Text style={styles.modalLine}>Contacto: {CONTACT_EMAIL}</Text>
              <Text style={styles.modalLine}>
                Cuenta:{' '}
                {isAuthenticated
                  ? `${userName ?? 'Usuario'} (${userEmail ?? ''})`
                  : 'Sin iniciar sesión'}
              </Text>
              <View style={styles.themeRow}>
                <Text style={styles.modalLine}>Modo oscuro</Text>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={isDark ? colors.accent : colors.white}
                />
              </View>
              <Text style={styles.modalHint}>
                Aquí puedes gestionar preferencias y autenticación institucional.
              </Text>
              {isAuthenticated ? (
                <>
                  <TouchableOpacity
                    style={styles.modalAction}
                    onPress={() => {
                      setOptionsOpen(false);
                      navigation.navigate('History');
                    }}
                  >
                    <Text style={styles.modalActionText}>Historial de compras</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalAction}
                    onPress={() => {
                      logout().finally(() => setOptionsOpen(false));
                    }}
                  >
                    <Text style={styles.modalActionText}>Cerrar sesión</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.modalAction}
                  onPress={() => {
                    setOptionsOpen(false);
                    setAuthTab('register');
                    setAuthOpen(true);
                  }}
                >
                  <Text style={styles.modalActionText}>
                    Iniciar sesión o registrarme
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setOptionsOpen(false)}
              >
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <AuthModal
          visible={authOpen}
          initialTab={authTab}
          onClose={() => setAuthOpen(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  hamburger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hamburgerLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    zIndex: 2,
    elevation: 6,
    backgroundColor: colors.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  modalLine: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  modalHint: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 16,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  modalClose: {
    alignSelf: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalAction: {
    marginTop: 4,
    marginBottom: 8,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  modalActionText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '700',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
});
