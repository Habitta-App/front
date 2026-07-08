import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { ROLES } from '../utils/roles';

/**
 * Unica fuente de verdad de la navegacion: usada por AppRouter (rutas
 * protegidas) y por MainLayout (menu lateral), para que nunca se desincronicen
 * "lo que se ve en el menu" y "lo que realmente esta protegido".
 */
export const ITEMS_MENU = [
  { etiqueta: 'Inicio', ruta: '/dashboard', Icono: DashboardOutlinedIcon, roles: [ROLES.ADMIN, ROLES.CONSEJO, ROLES.GUARDA, ROLES.RESIDENTE] },
  { etiqueta: 'Directorio de Usuarios', ruta: '/admin/usuarios', Icono: PeopleAltOutlinedIcon, roles: [ROLES.ADMIN] },
  { etiqueta: 'Gestión de Unidades', ruta: '/admin/inmuebles', Icono: HomeWorkOutlinedIcon, roles: [ROLES.ADMIN] },
  { etiqueta: 'Gestión de Cartera', ruta: '/admin/cobros', Icono: PaymentsOutlinedIcon, roles: [ROLES.ADMIN] },
  {
    etiqueta: 'Validación de Pagos',
    ruta: '/admin/pagos/verificacion',
    Icono: FactCheckOutlinedIcon,
    roles: [ROLES.ADMIN],
  },
  {
    etiqueta: 'Reporte Financiero',
    ruta: '/reportes/cartera',
    Icono: AssessmentOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.CONSEJO],
  },
  {
    etiqueta: 'Circulares y Avisos',
    ruta: '/anuncios',
    Icono: CampaignOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.RESIDENTE, ROLES.CONSEJO, ROLES.GUARDA],
  },
  {
    etiqueta: 'Mi Estado de Cuenta',
    ruta: '/residente/mi-cuenta',
    Icono: AccountBalanceWalletOutlinedIcon,
    roles: [ROLES.RESIDENTE],
  },
  { etiqueta: 'Mis Visitantes', ruta: '/residente/visitas', Icono: HowToRegOutlinedIcon, roles: [ROLES.RESIDENTE] },
  { etiqueta: 'Mi Correspondencia', ruta: '/residente/paquetes', Icono: Inventory2OutlinedIcon, roles: [ROLES.RESIDENTE] },
  {
    etiqueta: 'Portería y Accesos',
    ruta: '/guarda/control-acceso',
    Icono: SecurityOutlinedIcon,
    roles: [ROLES.GUARDA],
  },
  {
    etiqueta: 'Recepción de Paquetes',
    ruta: '/guarda/paquetes',
    Icono: LocalShippingOutlinedIcon,
    roles: [ROLES.GUARDA],
  },
  {
    etiqueta: 'Mi Perfil',
    ruta: '/perfil',
    Icono: PersonOutlineOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.RESIDENTE, ROLES.CONSEJO, ROLES.GUARDA],
  },
];

/** Ruta a la que se redirige inmediatamente despues del login, segun el rol. */
export function obtenerRutaInicioPorRol() {
  return '/dashboard';
}
