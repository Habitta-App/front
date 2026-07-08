import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

export function DashboardCard({ titulo, descripcion, Icono, ruta }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardActionArea onClick={() => navigate(ruta)} sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ color: 'primary.main' }}>
            <Icono sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {titulo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {descripcion}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
