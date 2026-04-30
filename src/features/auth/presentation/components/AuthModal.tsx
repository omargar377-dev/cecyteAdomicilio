import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { AppColors } from '../../../../constants/colors';
import { useAuth } from '../../../../context/AuthContext';
import { useAppTheme } from '../../../../context/ThemeContext';
import type { AuthTab } from '../../domain/types';
import { authCopy } from '../hooks/useAuthUiCopy';

type Props = {
  visible: boolean;
  onClose: () => void;
  initialTab?: AuthTab;
};

export function AuthModal({ visible, onClose, initialTab = 'login' }: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { login, register, forgotPassword } = useAuth();
  const [tab, setTab] = useState<AuthTab>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (!visible) return;
    setTab(initialTab);
    setFeedback(null);
    setIsError(false);
    setIsSubmitting(false);
    setPassword('');
    setConfirmPassword('');
  }, [visible, initialTab]);

  async function submit() {
    setFeedback(null);
    setIsError(false);
    setIsSubmitting(true);
    try {
      if (tab === 'login') {
        await login({ email, password });
        onClose();
        return;
      }
      if (tab === 'register') {
        await register({ fullName, email, password, confirmPassword });
        onClose();
        return;
      }
      await forgotPassword({ email });
      setFeedback(
        'Si el correo existe, recibirás instrucciones de recuperación en el canal institucional configurado.'
      );
      setIsError(false);
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : 'No fue posible completar la operación.'
      );
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  const title =
    tab === 'login'
      ? authCopy.loginTitle
      : tab === 'register'
        ? authCopy.registerTitle
        : authCopy.forgotTitle;
  const subtitle =
    tab === 'login'
      ? authCopy.loginSubtitle
      : tab === 'register'
        ? authCopy.registerSubtitle
        : authCopy.forgotSubtitle;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.dismissLayer} activeOpacity={1} onPress={onClose} />
        <View style={styles.card}>
          <View style={styles.tabRow}>
            <TabButton
              label="Entrar"
              active={tab === 'login'}
              onPress={() => setTab('login')}
              styles={styles}
            />
            <TabButton
              label="Registro"
              active={tab === 'register'}
              onPress={() => setTab('register')}
              styles={styles}
            />
            <TabButton
              label="Olvidé"
              active={tab === 'forgot'}
              onPress={() => setTab('forgot')}
              styles={styles}
            />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>

            {tab === 'register' ? (
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                placeholderTextColor={colors.muted}
                autoCapitalize="words"
                value={fullName}
                onChangeText={setFullName}
              />
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Correo institucional"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            {tab !== 'forgot' ? (
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor={colors.muted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            ) : null}

            {tab === 'register' ? (
              <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                placeholderTextColor={colors.muted}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            ) : null}

            {feedback ? (
              <Text style={[styles.feedback, isError ? styles.feedbackError : styles.feedbackOk]}>
                {feedback}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={submit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitText}>
                {isSubmitting
                  ? 'Procesando...'
                  : tab === 'login'
                    ? 'Iniciar sesión'
                    : tab === 'register'
                      ? 'Crear cuenta'
                      : 'Solicitar recuperación'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function TabButton({
  label,
  active,
  onPress,
  styles,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <TouchableOpacity style={[styles.tabBtn, active && styles.tabBtnActive]} onPress={onPress}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    dismissLayer: {
      ...StyleSheet.absoluteFillObject,
    },
    card: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 18,
      paddingTop: 14,
      paddingBottom: 24,
      maxHeight: '88%',
    },
    tabRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 14,
    },
    tabBtn: {
      flex: 1,
      minHeight: 40,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.cream,
    },
    tabBtnActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    tabLabel: {
      color: colors.primaryDark,
      fontWeight: '700',
      fontSize: 13,
    },
    tabLabelActive: {
      color: colors.white,
    },
    title: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '800',
      marginBottom: 6,
    },
    subtitle: {
      color: colors.muted,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 12,
    },
    input: {
      minHeight: 50,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.cream,
      color: colors.text,
      fontSize: 16,
      paddingHorizontal: 12,
      marginBottom: 10,
    },
    feedback: {
      fontSize: 13,
      marginBottom: 8,
    },
    feedbackError: {
      color: '#B3261E',
    },
    feedbackOk: {
      color: '#1B6E44',
    },
    submitBtn: {
      marginTop: 8,
      minHeight: 52,
      borderRadius: 14,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitBtnDisabled: {
      opacity: 0.65,
    },
    submitText: {
      color: colors.white,
      fontWeight: '800',
      fontSize: 16,
    },
  });
