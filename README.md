# cecyteAdomicilio

App móvil con **Expo SDK 54** y **React Native**: catálogo por categorías, carrito y ticket de ejemplo (sin backend ni pagos reales).

## Requisitos

- [Node.js](https://nodejs.org/) (LTS recomendado)
- Para probar en dispositivo: app **Expo Go** y la misma red Wi‑Fi que el PC (modo LAN) o `npx expo start --tunnel`

## Instalación

```bash
npm install
```

### Si `npm` falla en PowerShell (ejecución de scripts deshabilitada)

Puedes usar cualquiera de estas opciones:

1. **Abrir Símbolo del sistema (cmd)** y ejecutar `npm install` desde la carpeta del proyecto.

2. **Usar los scripts `.cmd`** incluidos (no dependen de la política de PowerShell):

   - `scripts\npm-install.cmd` — equivale a `npm install`
   - `scripts\expo-start.cmd` — arranca Expo (`npx expo start`)
   - `scripts\expo-start-lan.cmd` — arranca en modo LAN para el teléfono en la misma red

3. **Habilitar scripts en PowerShell** (solo tu usuario):

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

## Desarrollo

| Comando | Descripción |
|--------|-------------|
| `npm start` | Servidor de desarrollo Expo (Metro). |
| `npm run android` / `npm run ios` / `npm run web` | Abre en emulador o navegador según plataforma. |
| `npm run lint` | ESLint (`expo lint`). |
| `npm test` | Tests con Jest (`jest-expo`). |

### Probar en el teléfono sin usar “localhost” en el móvil

En el teléfono no uses `localhost` (apunta al propio teléfono). Opciones:

- **LAN** (misma Wi‑Fi): `npx expo start --lan` o ejecuta `scripts\expo-start-lan.cmd`, luego escanea el QR con Expo Go.

- **Túnel** (otra red o problemas de firewall): `npx expo start --tunnel`.

## Estructura principal

- `App.tsx` — entrada y providers (carrito, navegación).
- `src/screens/` — pantallas.
- `src/data/mockProducts.ts` — productos de demostración.
- `assets/` — iconos y splash referenciados en `app.json`.

## Licencia

Proyecto privado (`private` en `package.json`).
