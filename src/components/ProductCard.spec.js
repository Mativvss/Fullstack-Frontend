import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  const producto = { id: 5, categoria: 'Consolas', nombre: 'PlayStation 5', precio: 549990, stock: 5, img: '/assets/img/ps5.jpg' };

  it('muestra el producto y llama a onAgregar con el producto al hacer clic en "Agregar al carrito"', () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    render(<MemoryRouter><ProductCard producto={producto} onAgregar={onAgregar} /></MemoryRouter>);

    expect(screen.getByText('PlayStation 5')).toBeTruthy();
    expect(screen.getByText('$549.990 CLP')).toBeTruthy();

    fireEvent.click(screen.getByText('Agregar al carrito'));
    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(producto);
  });

  it('muestra "Agotado" y deshabilita el botón cuando no hay stock', () => {
    render(<MemoryRouter><ProductCard producto={{ ...producto, stock: 0 }} onAgregar={() => {}} /></MemoryRouter>);
    expect(screen.getByText('Agotado')).toBeTruthy();
    expect(screen.getByText('Sin stock').disabled).toBe(true);
  });
});
