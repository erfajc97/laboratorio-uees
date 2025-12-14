# Gestor de Agendamiento Judicial - Frontend

Aplicación web React para la gestión de agendamiento judicial con interfaz moderna y responsive.

## 📋 Descripción

Frontend desarrollado con React y TanStack Router que permite gestionar juicios, participantes y visualizar el estado de notificaciones en tiempo real. La aplicación se conecta con el backend API para realizar operaciones CRUD y mostrar información actualizada mediante polling automático.

## 🏗️ Arquitectura

El proyecto sigue una arquitectura basada en features y utiliza TanStack Router para el enrutamiento:

- **Arquitectura por features:**
  - `juicios` - Gestión de juicios (listado, creación, edición, eliminación)
  - `participantes` - Gestión de participantes
  - `agendamiento` - Formulario de agendamiento rápido
  - `auditoria` - Visualización de eventos y errores del sistema

- **Estructura de carpetas:**

```
src/
├── app/
│   ├── api/                    # Configuración de API (axios, endpoints)
│   ├── features/               # Módulos de funcionalidades
│   │   ├── juicios/
│   │   │   ├── components/     # Componentes específicos
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── mutations/     # Mutaciones (create, update, delete)
│   │   │   ├── services/      # Servicios de API
│   │   │   └── types/         # Tipos TypeScript
│   │   ├── participantes/
│   │   ├── agendamiento/
│   │   └── auditoria/
│   └── queries/                # Query keys y configuraciones
├── components/                 # Componentes compartidos
│   ├── UI/                     # Componentes de UI reutilizables
│   ├── Header.tsx
│   ├── BackButton.tsx
│   └── ToastResponse.tsx
├── routes/                     # Rutas (TanStack Router)
└── integrations/              # Integraciones (TanStack Query)
```

## 🛠️ Tecnologías y Librerías

### Dependencias principales:

- **React** (^19.2.0) - Biblioteca UI
- **@tanstack/react-router** (^1.132.0) - Enrutamiento
- **@tanstack/react-query** (^5.66.5) - Gestión de estado del servidor y caché
- **@heroui/react** (^2.8.5) - Componentes UI modernos
- **axios** (^1.13.2) - Cliente HTTP
- **tailwindcss** (^4.0.6) - Framework CSS utility-first
- **antd** (^6.0.0) - Componentes adicionales (formularios)
- **lucide-react** (^0.545.0) - Iconos
- **vite** (^7.1.7) - Build tool y dev server

### Desarrollo:

- **TypeScript** (^5.7.2) - Tipado estático
- **Vitest** (^3.0.5) - Testing
- **ESLint + Prettier** - Linting y formateo

## 🚀 Configuración Inicial

### 1. Instalación

```bash
npm install
```

### 2. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3001
```

En producción, configura la URL del backend API.

### 3. Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Build y Deployment

### Build para Producción

```bash
npm run build
```

Esto generará los archivos estáticos en la carpeta `dist/`.

### Preview del Build

```bash
npm run serve
```

### Deployment

Los archivos en `dist/` pueden ser desplegados en cualquier servidor estático:

- **Vercel** - Deploy automático desde Git
- **Netlify** - Deploy automático desde Git
- **GitHub Pages** - Deploy manual o con GitHub Actions
- **Servidor propio** - Subir archivos `dist/` a tu servidor web

**Nota:** Asegúrate de configurar la variable `VITE_API_URL` con la URL de tu backend en producción.

## 📜 Scripts Disponibles

| Script           | Descripción                                 |
| ---------------- | ------------------------------------------- |
| `npm run dev`    | Inicia servidor de desarrollo (puerto 3000) |
| `npm run build`  | Compila para producción                     |
| `npm run serve`  | Preview del build de producción             |
| `npm run test`   | Ejecuta tests                               |
| `npm run lint`   | Ejecuta ESLint                              |
| `npm run format` | Formatea código con Prettier                |
| `npm run check`  | Formatea y corrige con ESLint               |

## 🎨 Características Principales

### Gestión de Juicios

- Listado con búsqueda en tiempo real
- Creación y edición de juicios
- Eliminación con confirmación
- Modal de detalles con información completa
- Visualización de estados de notificaciones por participante
- Polling automático para actualizar estados (cada 5 segundos)

### Gestión de Participantes

- Listado con búsqueda
- CRUD completo de participantes
- Asignación de tipo (Juez, Abogado, Secretario, Psicólogo, Forense)
- Vinculación con Telegram Chat ID

### Agendamiento Rápido

- Formulario integrado para crear juicios con participantes
- Selector múltiple de participantes
- Validación de campos

### Auditoría

- Visualización de eventos y errores del sistema
- Filtros por tipo de error y estado
- Estadísticas de errores

## 🔄 Gestión de Estado

### TanStack Query

El proyecto utiliza TanStack Query para:

- Caché de datos del servidor
- Sincronización automática
- Polling para actualizaciones en tiempo real
- Optimistic updates en mutaciones

### Estructura de Queries

Las queries están organizadas en `src/app/queries/`:

- `juicios.queries.ts` - Queries y keys para juicios
- `participantes.queries.ts` - Queries y keys para participantes

## 🎯 Rutas Disponibles

| Ruta                        | Descripción                       |
| --------------------------- | --------------------------------- |
| `/`                         | Página de inicio                  |
| `/juicios`                  | Listado de juicios                |
| `/juicios/nuevo`            | Crear nuevo juicio                |
| `/juicios/:id`              | Detalles de juicio                |
| `/participantes`            | Listado de participantes          |
| `/participantes/nuevo`      | Crear nuevo participante          |
| `/participantes/:id/editar` | Editar participante               |
| `/agendamiento`             | Formulario de agendamiento rápido |
| `/auditoria`                | Visualización de auditoría        |

## 🎨 Componentes UI

### Componentes Propios

- **CustomModalNextUI** - Modal personalizado basado en HeroUI
- **Header** - Barra de navegación superior
- **BackButton** - Botón de regreso
- **ToastResponse** - Notificaciones toast

### Librerías de Componentes

- **HeroUI** - Componentes principales (Button, Input, Modal, etc.)
- **Ant Design** - Formularios y componentes adicionales

## 🔔 Estados de Notificación

El sistema muestra tres estados de notificación:

- **🟡 Enviado** - Notificación enviada a Telegram
- **🔵 Entregado** - Confirmado recibido (después de 1 minuto)
- **🟢 Leído** - Usuario confirmó lectura

Los estados se actualizan automáticamente mediante polling cuando el modal de detalles está abierto.

## 🧪 Testing

```bash
npm run test
```

El proyecto utiliza Vitest para testing unitario.

## 📝 Notas Importantes

- El frontend se conecta al backend en `http://localhost:3001` por defecto
- Configura `VITE_API_URL` en producción para apuntar a tu backend
- El polling automático se ejecuta cada 5 segundos cuando hay modales abiertos
- Los errores 404 (juicio eliminado) cierran automáticamente los modales
- CORS debe estar configurado en el backend para permitir requests del frontend

## 🔧 Desarrollo

### Agregar una Nueva Ruta

1. Crea un archivo en `src/routes/` (ej: `mi-ruta.tsx`)
2. TanStack Router generará automáticamente la ruta
3. Usa `Link` de `@tanstack/react-router` para navegación

### Agregar una Nueva Feature

1. Crea carpeta en `src/app/features/mi-feature/`
2. Organiza en: `components/`, `hooks/`, `mutations/`, `services/`, `types/`
3. Crea queries en `src/app/queries/` si es necesario

### Estilos

El proyecto usa Tailwind CSS. Los estilos globales están en `src/styles.css`.

### Tipos TypeScript

Los tipos están organizados por feature en `src/app/features/[feature]/types/index.ts`.
