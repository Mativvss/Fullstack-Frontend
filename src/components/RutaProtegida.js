import { Navigate } from 'react-router-dom';
import { rolDe, rutaPorDefecto } from '../utils/roles';

function RutaProtegida({ usuario, roles, children }) {
  const rol = rolDe(usuario);
  if (!roles.includes(rol)) {
    return <Navigate to={rutaPorDefecto(rol)} replace />;
  }
  return children;
}

export default RutaProtegida;
