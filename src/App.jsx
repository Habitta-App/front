import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <SnackbarProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </SnackbarProvider>
    </BrowserRouter>
  );
}

export default App;
