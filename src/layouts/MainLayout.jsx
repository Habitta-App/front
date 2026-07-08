import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useAuth } from '../hooks/useAuth';
import { ITEMS_MENU } from '../routes/routesConfig';

const ANCHO_DRAWER = 260;

export function MainLayout() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerMovilAbierto, setDrawerMovilAbierto] = useState(false);
  const [anchorMenuUsuario, setAnchorMenuUsuario] = useState(null);

  const itemsVisibles = ITEMS_MENU.filter((item) => item.roles.includes(usuario.rol));

  const manejarLogout = () => {
    setAnchorMenuUsuario(null);
    cerrarSesion();
    navigate('/login', { replace: true });
  };

  const contenidoMenu = (
    <List sx={{ pt: 1 }}>
      {itemsVisibles.map(({ etiqueta, ruta, Icono }) => (
        <ListItemButton
          key={ruta}
          selected={location.pathname === ruta}
          onClick={() => {
            navigate(ruta);
            setDrawerMovilAbierto(false);
          }}
        >
          <ListItemIcon>
            <Icono />
          </ListItemIcon>
          <ListItemText primary={etiqueta} />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (tema) => tema.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerMovilAbierto(true)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuOutlinedIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Habitta-app
          </Typography>
          <IconButton onClick={(evento) => setAnchorMenuUsuario(evento.currentTarget)} color="inherit">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
              {usuario.nombre?.charAt(0)?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorMenuUsuario} open={Boolean(anchorMenuUsuario)} onClose={() => setAnchorMenuUsuario(null)}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2">{usuario.nombre}</Typography>
              <Typography variant="caption" color="text.secondary">
                {usuario.rol}
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              onClick={() => {
                setAnchorMenuUsuario(null);
                navigate('/perfil');
              }}
            >
              Mi perfil
            </MenuItem>
            <MenuItem onClick={manejarLogout}>
              <LogoutOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              Cerrar sesion
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: ANCHO_DRAWER }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={drawerMovilAbierto}
          onClose={() => setDrawerMovilAbierto(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: ANCHO_DRAWER } }}
        >
          {contenidoMenu}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: ANCHO_DRAWER, boxSizing: 'border-box' },
          }}
          open
        >
          <Toolbar />
          {contenidoMenu}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${ANCHO_DRAWER}px)` }, bgcolor: 'background.default', minHeight: '100vh' }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
