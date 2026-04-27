import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

type Props = {
  visible: boolean;
  onFinish: () => void;
};

export function IntroOverlay({ visible, onFinish }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!visible) return;

    finishedRef.current = false;
    opacity.setValue(1);
    translateY.setValue(16);

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished && !finishedRef.current) {
          finishedRef.current = true;
          onFinish();
        }
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [visible, onFinish, opacity, translateY]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.backdrop} pointerEvents="auto">
      <Animated.View
        style={[
          styles.card,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.brand}>Cafetería</Text>
        <Text style={styles.tagline}>Bienvenido</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  card: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  brand: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 1,
  },
  tagline: {
    marginTop: 8,
    fontSize: 18,
    color: colors.cream,
    fontWeight: '500',
  },
});
