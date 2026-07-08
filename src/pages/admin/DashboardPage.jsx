import Grid from '@mui/material/Grid';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import { PageHeader } from '../../components/common/PageHeader';
import { DashboardCard } from '../../components/common/DashboardCard';
import { useAuth } from '../../hooks/useAuth';

const TARJETAS = [
  {
    titulo: 'Directorio de Usuarios',
    descripcion: 'Administra residentes, administradores y personal de seguridad',
    Icono: PeopleAltOutlinedIcon,
    ruta: '/admin/usuarios',
  },
  {
    titulo: 'Gestión de Unidades',
    descripcion: 'Control completo de las unidades y sus respectivos residentes',
    Icono: HomeWorkOutlinedIcon,
    ruta: '/admin/inmuebles',
  },
  {
    titulo: 'Gestión de Cartera',
    descripcion: 'Generación de cuotas de administración y cobranzas',
    Icono: PaymentsOutlinedIcon,
    ruta: '/admin/cobros',
  },
  {
    titulo: 'Validación de Pagos',
    descripcion: 'Revisión y aprobación de transacciones reportadas',
    Icono: FactCheckOutlinedIcon,
    ruta: '/admin/pagos/verificacion',
  },
  {
    titulo: 'Reporte Financiero',
    descripcion: 'Análisis de recaudo y estado de la cartera general',
    Icono: AssessmentOutlinedIcon,
    ruta: '/reportes/cartera',
  },
  {
    titulo: 'Circulares y Avisos',
    descripcion: 'Gestión del tablero de comunicaciones del conjunto',
    Icono: CampaignOutlinedIcon,
    ruta: '/anuncios',
  },
];

export function DashboardPage() {
  const { usuario } = useAuth();

  return (
    <>
      <PageHeader titulo={`¡Hola, ${usuario.nombre}!`} subtitulo="Tu panel de control para la gestión de la copropiedad" />
      <Grid container spacing={3}>
        {TARJETAS.map((tarjeta) => (
          <Grid key={tarjeta.ruta} size={{ xs: 12, sm: 6, md: 4 }}>
            <DashboardCard {...tarjeta} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
