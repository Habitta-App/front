import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { InicioRedirect } from './InicioRedirect';
import { MainLayout } from '../layouts/MainLayout';
import { LoadingState } from '../components/feedback/LoadingState';
import { ROLES } from '../utils/roles';

// Carga perezosa por pagina: reduce el bundle inicial (cada modulo se
// descarga solo cuando el usuario navega a el).
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const MiPerfilPage = lazy(() => import('../pages/perfil/MiPerfilPage').then((m) => ({ default: m.MiPerfilPage })));
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const UsuariosListPage = lazy(() =>
  import('../pages/admin/usuarios/UsuariosListPage').then((m) => ({ default: m.UsuariosListPage })),
);
const InmueblesListPage = lazy(() =>
  import('../pages/admin/inmuebles/InmueblesListPage').then((m) => ({ default: m.InmueblesListPage })),
);
const VinculosPage = lazy(() =>
  import('../pages/admin/inmuebles/VinculosPage').then((m) => ({ default: m.VinculosPage })),
);
const InmuebleCobrosPage = lazy(() =>
  import('../pages/admin/inmuebles/InmuebleCobrosPage').then((m) => ({ default: m.InmuebleCobrosPage })),
);
const CobrosPage = lazy(() => import('../pages/admin/cobros/CobrosPage').then((m) => ({ default: m.CobrosPage })));
const VerificacionPagosPage = lazy(() =>
  import('../pages/admin/pagos/VerificacionPagosPage').then((m) => ({ default: m.VerificacionPagosPage })),
);
const ReporteCarteraPage = lazy(() =>
  import('../pages/reportes/ReporteCarteraPage').then((m) => ({ default: m.ReporteCarteraPage })),
);
const MiCuentaPage = lazy(() => import('../pages/residente/MiCuentaPage').then((m) => ({ default: m.MiCuentaPage })));
const AnunciosPage = lazy(() => import('../pages/anuncios/AnunciosPage').then((m) => ({ default: m.AnunciosPage })));
const VisitasPage = lazy(() => import('../pages/residente/VisitasPage').then((m) => ({ default: m.VisitasPage })));
const ControlAccesoPage = lazy(() =>
  import('../pages/guarda/ControlAccesoPage').then((m) => ({ default: m.ControlAccesoPage })),
);
const PaquetesResidentePage = lazy(() =>
  import('../pages/residente/PaquetesResidentePage').then((m) => ({ default: m.PaquetesResidentePage })),
);
const PaquetesGuardaPage = lazy(() =>
  import('../pages/guarda/PaquetesGuardaPage').then((m) => ({ default: m.PaquetesGuardaPage })),
);
const AccesoDenegadoPage = lazy(() =>
  import('../pages/errors/AccesoDenegadoPage').then((m) => ({ default: m.AccesoDenegadoPage })),
);
const NoEncontradoPage = lazy(() =>
  import('../pages/errors/NoEncontradoPage').then((m) => ({ default: m.NoEncontradoPage })),
);

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/403" element={<AccesoDenegadoPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<InicioRedirect />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/perfil" element={<MiPerfilPage />} />
            <Route path="/anuncios" element={<AnunciosPage />} />

            <Route element={<ProtectedRoute rolesPermitidos={[ROLES.ADMIN]} />}>
              <Route path="/admin/usuarios" element={<UsuariosListPage />} />
              <Route path="/admin/inmuebles" element={<InmueblesListPage />} />
              <Route path="/admin/inmuebles/:inmuebleId/vinculos" element={<VinculosPage />} />
              <Route path="/admin/inmuebles/:inmuebleId/cobros" element={<InmuebleCobrosPage />} />
              <Route path="/admin/cobros" element={<CobrosPage />} />
              <Route path="/admin/pagos/verificacion" element={<VerificacionPagosPage />} />
            </Route>

            <Route element={<ProtectedRoute rolesPermitidos={[ROLES.ADMIN, ROLES.CONSEJO]} />}>
              <Route path="/reportes/cartera" element={<ReporteCarteraPage />} />
            </Route>

            <Route element={<ProtectedRoute rolesPermitidos={[ROLES.RESIDENTE]} />}>
              <Route path="/residente/mi-cuenta" element={<MiCuentaPage />} />
              <Route path="/residente/visitas" element={<VisitasPage />} />
              <Route path="/residente/paquetes" element={<PaquetesResidentePage />} />
            </Route>

            <Route element={<ProtectedRoute rolesPermitidos={[ROLES.GUARDA]} />}>
              <Route path="/guarda/control-acceso" element={<ControlAccesoPage />} />
              <Route path="/guarda/paquetes" element={<PaquetesGuardaPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NoEncontradoPage />} />
      </Routes>
    </Suspense>
  );
}
