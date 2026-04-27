import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { useAppTheme } from '../context/ThemeContext';
import { CATEGORY_LABELS } from '../data/mockProducts';
import { CartScreen } from '../screens/CartScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { TicketScreen } from '../screens/TicketScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.primaryDark,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={({ route }) => ({
          title: CATEGORY_LABELS[route.params.categoryId],
        })}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Carrito y pago' }}
      />
      <Stack.Screen
        name="Ticket"
        component={TicketScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
