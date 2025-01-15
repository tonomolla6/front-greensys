# GreenSys Frontend

## Descripción
Sistema de gestión empresarial moderno construido con React, TypeScript y Tailwind CSS.

## Características
- 🔐 Autenticación y autorización avanzada
- 📊 Dashboard interactivo con gráficos en tiempo real
- 👥 Gestión de clientes y perfiles
- 🎫 Sistema de tickets y soporte
- 💳 Integración con pasarela de pagos
- 📱 Diseño responsive y moderno
- 🌍 Internacionalización
- 🎨 Tema personalizable
- 📈 Reportes y análisis

## Requisitos
- Node.js >= 18
- npm >= 9

## Instalación
```bash
npm install
npm run dev
```

## Scripts
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run test`: Ejecuta los tests
- `npm run lint`: Verifica el código
- `npm run format`: Formatea el código

## Estructura del Proyecto
```
src/
  ├── api/          # Llamadas a API y tipos
  ├── assets/       # Recursos estáticos
  ├── components/   # Componentes reutilizables
  ├── config/       # Configuración de la aplicación
  ├── constants/    # Constantes y enums
  ├── features/     # Características principales
  ├── hooks/        # Hooks personalizados
  ├── i18n/         # Internacionalización
  ├── layouts/      # Layouts de la aplicación
  ├── pages/        # Páginas principales
  ├── services/     # Servicios y lógica de negocio
  ├── store/        # Estado global
  ├── types/        # Tipos TypeScript
  └── utils/        # Utilidades
```

## Convenciones de Código
- Seguimos las guías de estilo de Airbnb
- Commits semánticos
- Tests para componentes críticos
- Documentación JSDoc

## Contribución
1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m "feat: add amazing feature"`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia
MIT
