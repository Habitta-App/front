import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { PageHeader } from '../../../components/common/PageHeader';
import { EstadoCuentaContent } from '../../../components/cartera/EstadoCuentaContent';
import { obtenerInmueblePorId } from '../../../services/inmuebleService';

export function InmuebleCobrosPage() {
  const { inmuebleId } = useParams();
  const navigate = useNavigate();
  const [inmueble, setInmueble] = useState(null);

  useEffect(() => {
    obtenerInmueblePorId(inmuebleId).then(setInmueble).catch(() => setInmueble(null));
  }, [inmuebleId]);

  return (
    <>
      <PageHeader
        titulo={inmueble ? `Estado de cuenta de ${inmueble.numeroIdentificador}` : 'Estado de cuenta'}
        accion={
          <Button startIcon={<ArrowBackOutlinedIcon />} onClick={() => navigate('/admin/inmuebles')}>
            Volver
          </Button>
        }
      />
      <EstadoCuentaContent inmuebleId={inmuebleId} puedeReportarPago />
    </>
  );
}
