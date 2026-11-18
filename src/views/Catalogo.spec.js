import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Catalogo from './Catalogo';
import { productosPrueba as productos } from '../testing/datosPrueba';

describe('Catalogo', () => {
  it('muestra todos los productos y los filtra al elegir una categoría', () => {
    render(<MemoryRouter><Catalogo productos={productos} onAgregar={() => {}} /></MemoryRouter>);
    expect(screen.getAllByText('Agregar al carrito').length).toBe(productos.length);

    fireEvent.change(screen.getByLabelText('Filtrar por categoría'), { target: { value: 'Consolas' } });
    expect(screen.getAllByText('Agregar al carrito').length).toBe(1);
    expect(screen.getByText('PlayStation 5')).toBeTruthy();
    expect(screen.queryByText('Catan')).toBeNull();
  });
});
