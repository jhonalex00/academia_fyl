ABRIR WEB
1- npm run dev
2- nodemon server.js

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🚀 Configuración y Ejecución del Dashboard

### Pre-requisitos
- Node.js 18+ instalado
- MySQL Server corriendo en `26.106.45.23:3306`
- Base de datos `practicasfl` creada

### 📋 Configuración de la Base de Datos

1. **Verificar conexión a la base de datos:**
```bash
node test-db.js
```

2. **Configuración del archivo .env:**
El proyecto ya tiene configurado el archivo `.env` con:
```env
DB_HOST=26.106.45.23
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=practicasfl
DB_PORT=3306
```

### 🛠️ Instalación y Ejecución

1. **Instalar dependencias:**
```bash
npm install
```

2. **Ejecutar el proyecto completo (Frontend + Backend):**
```bash
npm run dev:all
```

O ejecutar por separado:

3. **Ejecutar solo el backend (API):**
```bash
npm run start-server
```

4. **Ejecutar solo el frontend (Next.js):**
```bash
npm run dev
```

### 📊 Acceso al Dashboard

- **Frontend:** http://localhost:3000/admin/dashboard
- **Backend API:** http://localhost:3001/api
- **Health Check:** http://localhost:3001/health

### 🔍 Endpoints de la API para el Dashboard

- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/activities` - Actividades recientes
- `GET /api/dashboard/calendar` - Eventos del calendario
- `GET /api/estudiantes` - Lista de estudiantes
- `GET /api/profesores` - Lista de profesores
- `GET /api/asignaturas` - Lista de asignaturas
- `GET /api/academias` - Lista de academias
- `GET /api/horarios` - Lista de horarios

### 🐛 Solución de Problemas

1. **Error de conexión a la base de datos:**
   - Verificar que MySQL esté corriendo
   - Comprobar credenciales en `.env`
   - Ejecutar `node test-db.js` para diagnosticar

2. **Error de CORS:**
   - El servidor está configurado para aceptar requests desde localhost:3000
   - Verificar que ambos servidores estén corriendo

3. **Datos no aparecen en el dashboard:**
   - Verificar que hay datos en las tablas de la base de datos
   - Revisar logs del servidor en la consola
   - Abrir DevTools del navegador para ver errores de red

### 📱 Características del Dashboard

✅ **Implementado:**
- Estadísticas en tiempo real desde la base de datos
- Gráficos de distribución por ciclos educativos
- Lista de estudiantes recientes
- Actividades recientes (mensajes, registros)
- Tarjetas de estadísticas con porcentajes de crecimiento
- Calendario de eventos
- Diseño responsive

✅ **Conectado a la base de datos:**
- Estudiantes (tabla `students`)
- Profesores (tabla `teachers`) 
- Asignaturas (tabla `subjects`)
- Academias (tabla `academies`)
- Horarios (tabla `schedules`)
- Mensajes (tabla `messages`)
- Contactos (tabla `contacts`)

### 🔧 Modo de Desarrollo

Para desarrollo, las rutas de API están temporalmente sin autenticación. Para producción, descomentar las líneas de autenticación en `src/api/routes/index.js`.
