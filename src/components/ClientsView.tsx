import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Client } from '../types';
import {
  Building2,
  Search,
  Plus,
  MapPin,
  Phone,
  User,
  Clock,
  ShieldCheck,
  ChevronRight,
  X,
  CalendarCheck,
  PackageOpen,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const ClientsView: React.FC = () => {
  const { clients, addClient, visits, orders, selectedClientId, setSelectedClientId, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Client Form state
  const [newClientName, setNewClientName] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');
  const [newClientContact, setNewClientContact] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientFrequency, setNewClientFrequency] = useState('Lunes a Viernes · 08:00 a 14:00 hs');
  const [newClientPlan, setNewClientPlan] = useState('Limpieza Integral y Mantenimiento Diario');
  const [newClientStaff, setNewClientStaff] = useState('Mariela Gómez');
  const [newClientAreas, setNewClientAreas] = useState('Oficinas, Sanitarios, Hall de entrada');

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeClient = clients.find((c) => c.id === selectedClientId);

  // Related data for active client modal
  const clientVisits = activeClient
    ? visits.filter((v) => v.clientId === activeClient.id && v.dayNumber <= 15)
    : [];
  const clientOrders = activeClient
    ? orders.filter((o) => o.clientId === activeClient.id)
    : [];

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientAddress.trim()) return;

    addClient({
      name: newClientName.trim(),
      legalName: `${newClientName.trim()} S.R.L.`,
      cuit: '30-71999888-9',
      address: newClientAddress.trim(),
      city: 'Rosario, Santa Fe',
      contactName: newClientContact.trim() || 'Contacto Responsable',
      contactPhone: newClientPhone.trim() || '0341-400-0000',
      frequency: newClientFrequency,
      cleaningPlan: newClientPlan,
      assignedStaff: [newClientStaff],
      assignedSupervisor: 'Carlos Benítez',
      areas: newClientAreas.split(',').map((a) => a.trim()).filter(Boolean),
      status: 'active',
      notes: 'Cliente de demostración incorporado a la plataforma CIMA.',
    });

    // Reset form
    setNewClientName('');
    setNewClientAddress('');
    setNewClientContact('');
    setNewClientPhone('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-600" />
            <span>Fichas de Clientes ({clients.length})</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestión de servicios asignados, pliegos operativos, frecuencias y cuadrillas en Rosario.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente o dirección..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 shrink-0 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
          const todayVisit = visits.find((v) => v.clientId === client.id && v.dayNumber === 12);
          return (
            <div
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition leading-snug">
                      {client.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{client.legalName}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Activo
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800">{client.address}, {client.city}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{client.frequency}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      Personal: <strong>{client.assignedStaff.join(', ')}</strong>
                    </span>
                  </div>
                </div>

                {/* Cleaning Plan Summary */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-snug">
                  <strong className="text-slate-800">Plan:</strong> {client.cleaningPlan}
                </div>
              </div>

              {/* Card Footer: Today status & action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Hoy (12/11):</span>
                  {todayVisit ? (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        todayVisit.status === 'Verificada'
                          ? 'bg-emerald-100 text-emerald-800'
                          : todayVisit.status === 'Declarada'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {todayVisit.status}
                    </span>
                  ) : (
                    <span className="text-slate-400">Sin servicio</span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-blue-600 font-bold group-hover:translate-x-0.5 transition">
                  <span>Ver Ficha</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: CLIENT DETAIL FICHA */}
      {activeClient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">{activeClient.name}</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Activo
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  CUIT: {activeClient.cuit} · Razón Social: {activeClient.legalName}
                </p>
              </div>
              <button
                onClick={() => setSelectedClientId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-5">
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Ubicación y Contacto
                  </span>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{activeClient.address}, {activeClient.city}</span>
                  </div>
                  <div className="text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeClient.contactName}</span>
                  </div>
                  <div className="text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeClient.contactPhone}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Operación y Cuadrilla
                  </span>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{activeClient.frequency}</span>
                  </div>
                  <div className="text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Personal: {activeClient.assignedStaff.join(', ')}</span>
                  </div>
                  <div className="text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Supervisor: {activeClient.assignedSupervisor}</span>
                  </div>
                </div>
              </div>

              {/* Sectores y Áreas */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Áreas e Instalaciones Asignadas
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeClient.areas.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pliego y Observaciones */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950">
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Protocolo de Limpieza & Instrucciones Operativas</span>
                </div>
                <p className="leading-relaxed">{activeClient.cleaningPlan}</p>
                {activeClient.notes && (
                  <p className="mt-1.5 text-amber-900 font-medium italic">
                    Nota especial: "{activeClient.notes}"
                  </p>
                )}
              </div>

              {/* Recent Visits for this Client */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Historial de Visitas Recientes (Noviembre 2026)
                  </h4>
                  <button
                    onClick={() => {
                      setSelectedClientId(null);
                      setActiveTab('visits');
                    }}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Ver en Planilla Completa →
                  </button>
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {clientVisits.slice(-5).map((visit) => (
                    <div
                      key={visit.id}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{visit.date}</span>
                        <span className="text-slate-500">· {visit.employeeName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {visit.checkInTime && (
                          <span className="text-slate-500">
                            {visit.checkInTime} - {visit.checkOutTime || 'en curso'}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            visit.status === 'Verificada'
                              ? 'bg-emerald-100 text-emerald-800'
                              : visit.status === 'Declarada'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {visit.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supply Orders for this Client */}
              {clientOrders.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Pedidos de Insumos Registrados
                  </h4>
                  <div className="space-y-2">
                    {clientOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{ord.orderNumber}</span>
                          <span className="text-slate-500 ml-2">({ord.items.length} ítems)</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.status === 'Entregado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'Pendiente'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedClientId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ALTA DE NUEVO CLIENTE DEMO */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Agregar Nuevo Cliente</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Comercial / Sucursal *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Sanatorio Pellegrini, Concesionaria Rosario Sur"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dirección en Rosario *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Corrientes 1520"
                  value={newClientAddress}
                  onChange={(e) => setNewClientAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Persona de Contacto</label>
                  <input
                    type="text"
                    placeholder="Ej. Laura González (Admin)"
                    value={newClientContact}
                    onChange={(e) => setNewClientContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="0341-455-1234"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Frecuencia y Horario</label>
                <input
                  type="text"
                  value={newClientFrequency}
                  onChange={(e) => setNewClientFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Personal Asignado</label>
                <input
                  type="text"
                  value={newClientStaff}
                  onChange={(e) => setNewClientStaff(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Áreas a Limpiar (separadas por coma)</label>
                <input
                  type="text"
                  value={newClientAreas}
                  onChange={(e) => setNewClientAreas(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20"
                >
                  Guardar Cliente Demo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
