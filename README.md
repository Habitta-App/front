# Habitta - Frontend

## 📝 Resumen del Proyecto

Habitta es una plataforma web para la administración integral de conjuntos residenciales y condominios. Este repositorio contiene la aplicación **Frontend**, desarrollada con React, Vite y Material-UI (MUI).

El sistema está diseñado con múltiples roles y módulos:
- **Administrador**: Gestión de inmuebles, usuarios, finanzas (cobros y pagos), reportes de cartera y publicación de anuncios.
- **Guardia de Seguridad**: Control de acceso (entradas/salidas) y registro y entrega de paquetes.
- **Residente**: Consulta de su estado de cuenta, autorización de visitas, revisión de paquetes recibidos y anuncios del condominio.

## 🛠️ Stack Tecnológico

- **Core**: React 19, Vite, React Router DOM
- **UI/Estilos**: Material-UI (MUI), Emotion
- **Formularios y Validación**: React Hook Form, Zod
- **Cliente HTTP**: Axios
- **Calidad de Código**: Oxlint

## 📂 Estructura Principal

- `src/api`: Configuración del cliente HTTP (Axios) e interceptores.
- `src/components`: Componentes reutilizables de UI (comunes, formularios, feedback y específicos por dominio).
- `src/contexts`: Estados globales de la aplicación (Autenticación, Notificaciones/Snackbars).
- `src/hooks`: Custom hooks para el manejo de lógica (paginación, auth, inmuebles).
- `src/layouts`: Componentes de estructura de página (MainLayout).
- `src/pages`: Vistas principales agrupadas por rol o dominio (`admin`, `residente`, `guarda`, `auth`, etc.).
- `src/routes`: Configuración de navegación y protección de rutas.
- `src/services`: Módulos que interactúan con el backend siguiendo los endpoints de la API.
- `src/utils`: Utilidades generales (manejo de tokens JWT, formato de fechas/monedas, roles).

---

## 🚀 Guía de Instalación (Paso a Paso)

Esta sección está diseñada para que cualquier desarrollador, incluyendo perfiles Junior, pueda levantar el proyecto desde cero sin problemas.

### 1. Requisitos Previos
Asegúrate de tener instalado en tu sistema:
- **Node.js** (Versión 18 o superior recomendada). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
- **Git** para clonar el repositorio.

### 2. Clonar el repositorio
Abre tu terminal y ejecuta:
```bash
git clone <URL_DEL_REPOSITORIO>
cd front
```

### 3. Instalar dependencias
Dentro de la carpeta `front`, ejecuta el siguiente comando para descargar todas las librerías necesarias:
```bash
npm install
```

### 4. Configurar variables de entorno
El proyecto necesita conectarse con el servidor Backend.
1. En la raíz del proyecto (al nivel de `package.json`), crea un archivo llamado `.env`
2. Abre el archivo y añade la siguiente línea:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```
*(Asegúrate de cambiar la URL si tu backend se está ejecutando en otro puerto o dirección).*

### 5. Iniciar el servidor de desarrollo
Finalmente, levanta el proyecto ejecutando:
```bash
npm run dev
```
En la terminal verás una URL (generalmente `http://localhost:5173`). ¡Abre ese enlace en tu navegador y listo!

---

## 🤝 Buenas Prácticas para el Desarrollo

- **Componentes**: Utiliza componentes pequeños con una única responsabilidad apoyándote de `src/components/common`.
- **Rutas y Roles**: Las nuevas pantallas deben ser declaradas en `src/routes/routesConfig.js` asegurando los niveles correctos de acceso.
- **Manejo de Errores**: Usa `useSnackbar()` para notificar al usuario sobre cualquier éxito o fracaso en operaciones hacia la API.
- **Validaciones**: Confía en **Zod** y **React Hook Form** para garantizar la integridad de todos los formularios de la aplicación.
