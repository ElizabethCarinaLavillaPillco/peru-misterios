import React from 'react';
import { useState } from "react";

export default function TravelerForm({ user, onUpdateUser, onNext }) {
  const [form, setForm] = useState({
    nombre: user?.name || "",
    email: user?.email || "",
    nacionalidad: user?.location || "Perú",
    telefono: user?.phone || "",
    adultos: 2,
    ninos: 0,
    notas: "",
  });

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email) return; // validación mínima
    onUpdateUser?.({
      ...user,
      name: form.nombre,
      email: form.email,
      phone: form.telefono,
      location: form.nacionalidad,
    });
    onNext?.();
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-amber-400/40 bg-white p-6 lg:p-7 shadow-sm font-metropolis text-pm-black"
    >
      <h3 className="font-russo text-xl md:text-2xl">
        Información del viajero
        <span className="block h-1 w-14 rounded-full bg-pm-gold mt-2" />
      </h3>

      <div className="mt-4 space-y-3">
        <Field label="Nombre completo">
          <Input
            name="nombre"
            value={form.nombre}
            onChange={set}
            placeholder="Nombre completo"
            required
            aria-label="Nombre completo"
          />
        </Field>

        <Field label="Email">
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={set}
            placeholder="correo@ejemplo.com"
            required
            aria-label="Correo electrónico"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Nacionalidad">
            <Select
              name="nacionalidad"
              value={form.nacionalidad}
              onChange={set}
              aria-label="Nacionalidad"
            >
              <option>Perú</option>
              <option>Chile</option>
              <option>Argentina</option>
              <option>Bolivia</option>
              <option>Colombia</option>
              <option>Otro</option>
            </Select>
          </Field>

          <Field label="Teléfono (con código de país)">
            <Input
              name="telefono"
              value={form.telefono}
              onChange={set}
              placeholder="+51 9XX XXX XXX"
              inputMode="tel"
              aria-label="Teléfono de contacto"
            />
          </Field>
        </div>

        <h4 className="mt-4 font-semibold tracking-wide">Participantes</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="N.° de adultos">
            <Input
              type="number"
              min={1}
              step={1}
              name="adultos"
              value={form.adultos}
              onChange={set}
              aria-label="Número de adultos"
            />
          </Field>

          <Field label="N.° de niños (de 3 a 11 años)">
            <Input
              type="number"
              min={0}
              step={1}
              name="ninos"
              value={form.ninos}
              onChange={set}
              aria-label="Número de niños"
            />
          </Field>
        </div>

        <Field label="Notas (opcional)">
          <Textarea
            name="notas"
            value={form.notas}
            onChange={set}
            placeholder="Añade nombres de acompañantes, horarios preferidos u otras peticiones"
            aria-label="Notas adicionales"
          />
        </Field>
      </div>

      {/* Botón invisible por accesibilidad (el CTA real está fuera) */}
      <button type="submit" className="sr-only">Continuar al pago</button>
    </form>
  );
}

/* ---------- UI helpers coherentes con el tema ---------- */
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-pm-gray-dark">{label}</span>
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-amber-400/50 bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
    />
  );
}

function Select({ children, ...rest }) {
  return (
    <select
      {...rest}
      className="w-full rounded-xl border border-amber-400/50 bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
    >
      {children}
    </select>
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full min-h-[96px] rounded-xl border border-amber-600/80 bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
    />
  );
}
