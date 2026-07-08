import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import { LoadingState } from '../feedback/LoadingState';
import { EmptyState } from '../feedback/EmptyState';
import { ErrorState } from '../feedback/ErrorState';

/**
 * Tabla generica reutilizable para todos los listados administrativos.
 * `columnas`: [{ campo, encabezado, render?(fila) }]
 */
export function PaginatedTable({
  columnas,
  filas,
  pagina,
  tamanoPagina,
  totalElementos,
  onCambiarPagina,
  onCambiarTamano,
  cargando,
  error,
  mensajeVacio,
  renderAcciones,
}) {
  if (cargando) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState mensaje={error} />;
  }

  if (!filas || filas.length === 0) {
    return <EmptyState mensaje={mensajeVacio} />;
  }

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columnas.map((columna) => (
                <TableCell key={columna.campo}>{columna.encabezado}</TableCell>
              ))}
              {renderAcciones && <TableCell align="right">Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filas.map((fila) => (
              <TableRow key={fila.id} hover>
                {columnas.map((columna) => (
                  <TableCell key={columna.campo}>
                    {columna.render ? columna.render(fila) : fila[columna.campo]}
                  </TableCell>
                ))}
                {renderAcciones && <TableCell align="right">{renderAcciones(fila)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {onCambiarPagina && (
        <TablePagination
          component="div"
          count={totalElementos}
          page={pagina}
          onPageChange={(_evento, nuevaPagina) => onCambiarPagina(nuevaPagina)}
          rowsPerPage={tamanoPagina}
          onRowsPerPageChange={(evento) => onCambiarTamano(Number(evento.target.value))}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas por pagina"
        />
      )}
    </Paper>
  );
}
