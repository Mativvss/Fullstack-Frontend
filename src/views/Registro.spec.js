import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Registro from './Registro';

describe('Registro (formulario)', () => {
  const escribir = (etiqueta, valor) =>
    fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

  it('crea la cuenta y muestra el 20% de descuento con un correo @duocuc.cl', async () => {
    const onRegistro = jasmine.createSpy('onRegistro');
    render(<MemoryRouter><Registro onRegistro={onRegistro} /></MemoryRouter>);

    escribir('Nombre completo', 'Matías Franke');
    escribir('Correo electrónico', 'matias@duocuc.cl');
    escribir('Fecha de nacimiento', '2000-01-15');
    escribir('Contraseña', 'clave123');
    escribir('Confirmar contraseña', 'clave123');
    fireEvent.click(screen.getByText('Registrarse'));
    await screen.findByText(/¡Cuenta creada con éxito!/);

    expect(screen.getByText(/¡Cuenta creada con éxito!/)).toBeTruthy();
    expect(screen.getByText(/20% de descuento de por vida/)).toBeTruthy();
    expect(onRegistro).toHaveBeenCalledWith({
      nombre: 'Matías Franke', email: 'matias@duocuc.cl', fecha: '2000-01-15', password: 'clave123',
    });
  });
});
