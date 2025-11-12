import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ContactForm from '@/components/sections/contacto/ContactForm';

const FUTURE = '2099-12-31';

describe('ContactForm', () => {
  beforeEach(() => {
    // mock de fetch en cada test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('muestra errores de validación si se envía vacío', async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(await screen.findByText(/Ingresa tu nombre/i)).toBeInTheDocument();
    expect(screen.getByText(/Ingresa tu correo/i)).toBeInTheDocument();
    expect(screen.getByText(/Selecciona una fecha/i)).toBeInTheDocument();
    expect(screen.getByText(/Selecciona adultos/i)).toBeInTheDocument();
    expect(screen.getByText(/Selecciona niños/i)).toBeInTheDocument();
    expect(screen.getByText(/Indica un destino/i)).toBeInTheDocument();
    expect(screen.getByText(/Debes aceptar la política de privacidad/i)).toBeInTheDocument();

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('si el canal es WhatsApp requiere teléfono válido', async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/nombre/i), 'Ana');
    await user.type(screen.getByLabelText(/correo/i), 'ana@mail.com');
    await user.type(screen.getByLabelText(/destino/i), 'Cusco');
    await user.type(screen.getByLabelText(/^mensaje$/i), 'mensaje válido de prueba');
    await user.selectOptions(screen.getByLabelText(/adultos/i), '1');
    await user.selectOptions(screen.getByLabelText(/niños/i), '0');
    await user.type(screen.getByLabelText(/fecha/i), FUTURE);
    await user.selectOptions(screen.getByLabelText(/preferencia de contacto/i), 'whatsapp');
    await user.click(screen.getByLabelText(/acepto la/i));

    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(await screen.findByText(/teléfono válido/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('envía correctamente cuando el formulario es válido (muestra mensaje de éxito)', async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({ ok: true });

    await user.type(screen.getByLabelText(/nombre/i), 'Carlos Test');
    await user.type(screen.getByLabelText(/correo/i), 'carlos@test.com');
    await user.type(screen.getByLabelText(/destino/i), 'Lima');
    await user.type(screen.getByLabelText(/^mensaje$/i), 'Somos 2, viajamos en verano.');
    await user.selectOptions(screen.getByLabelText(/adultos/i), '2');
    await user.selectOptions(screen.getByLabelText(/niños/i), '0');
    await user.type(screen.getByLabelText(/fecha/i), FUTURE);
    await user.click(screen.getByLabelText(/acepto la/i));

    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toBe('/api/contacto');
    expect(opts.method).toBe('POST');
    expect(opts.headers['Content-Type']).toBe('application/json');

    const body = JSON.parse(opts.body);
    expect(body.nombre).toBe('Carlos Test');
    expect(body.correo).toBe('carlos@test.com');
    expect(body.destino).toBe('Lima');
    expect(body.adultos).toBe(2);
    expect(body.ninos).toBe(0);
    expect(body.canal).toBe('email');

    expect(await screen.findByRole('status')).toHaveTextContent(/mensaje enviado/i);
  });

  it('si el backend responde error, muestra alerta', async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({ ok: false });

    await user.type(screen.getByLabelText(/nombre/i), 'Carlos');
    await user.type(screen.getByLabelText(/correo/i), 'carlos@test.com');
    await user.type(screen.getByLabelText(/destino/i), 'Cusco');
    await user.type(screen.getByLabelText(/^mensaje$/i), 'mensaje válido');
    await user.selectOptions(screen.getByLabelText(/adultos/i), '1');
    await user.selectOptions(screen.getByLabelText(/niños/i), '0');
    await user.type(screen.getByLabelText(/fecha/i), FUTURE);
    await user.click(screen.getByLabelText(/acepto la/i));

    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/no se pudo enviar/i);
  });
});
