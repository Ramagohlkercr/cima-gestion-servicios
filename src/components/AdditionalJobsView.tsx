import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { AdditionalJob, JobPriority, JobStatus } from '../types';
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  User,
  ArrowRight,
  X,
  Filter,
} from 'lucide-react';

export const AdditionalJobsView: React.FC = () => {
  const { clients, additionalJobs, addAdditionalJob, updateJobStatus } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // New Job Form State
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<JobPriority>('alta');
  const [assignedStaff, setAssignedStaff] = useState('Cuadrilla Especial CIMA');
  const [targetDate, setTargetDate] = useState('2026-11-13');
  const [source, setSource] = useState('Solicitud Directa del Cliente');

  const filteredJobs = additionalJobs.filter((job) => {
    if (filterPriority !== 'all' && job.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && job.status !== filterStatus) return false;
    return true;
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId);
    if (!client || !title.trim()) return;

    addAdditionalJob({
      clientId: client.id,
      clientName: client.name,
      title: title.trim(),
      description: description.trim() || 'Servicio de limpieza y mantenimiento especializado fuera de abono.',
      priority,
      status: 'Pendiente',
      assignedStaff,
      source,
      targetDate,
    });

    // Reset
    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  const getPriorityBadge = (p: JobPriority) => {
    switch (p) {
      case 'alta':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'media':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'baja':
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusBadge = (s: JobStatus) => {
    switch (s) {
      case 'Pendiente':
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: <Clock className="w-3.5 h-3.5 text-slate-500" />,
        };
      case 'En curso':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: <Wrench className="w-3.5 h-3.5 text-blue-600" />,
        };
      case 'Finalizado':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Wrench className="w-7 h-7 text-purple-600" />
              <span>Trabajos Adicionales ({additionalJobs.length})</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Servicios Especiales
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tareas correctivas, hidrolavados, pulido de pisos y requerimientos especiales fuera del abono mensual.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-2 shrink-0 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Trabajo Extra</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-700">Filtros:</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Estado:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-300 font-medium"
          >
            <option value="all">Todos los estados</option>
            <option value="Pendiente">Pendientes</option>
            <option value="En curso">En curso</option>
            <option value="Finalizado">Finalizados</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Prioridad:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-300 font-medium"
          >
            <option value="all">Todas</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJobs.map((job) => {
          const statusBadge = getStatusBadge(job.status);
          const isDone = job.status === 'Finalizado';

          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                      {job.clientName}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-0.5 leading-snug">
                      {job.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getPriorityBadge(
                        job.priority
                      )}`}
                    >
                      {job.priority}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${statusBadge.bg}`}
                    >
                      {statusBadge.icon}
                      <span>{job.status}</span>
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed mb-3">
                  {job.description}
                </p>

                {/* Info row */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Origen de la Tarea
                    </span>
                    <span className="font-medium text-slate-800">{job.source}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Personal Designado
                    </span>
                    <span className="font-medium text-slate-800">{job.assignedStaff}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Fecha Límite / Programada
                    </span>
                    <span className="font-medium text-slate-800">{job.targetDate}</span>
                  </div>
                  {job.completedAt && (
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Finalizado el
                      </span>
                      <span className="font-bold text-emerald-700">{job.completedAt}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons to Transition Status */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-slate-400">ID: {job.id}</span>

                <div className="flex items-center gap-2">
                  {job.status === 'Pendiente' && (
                    <button
                      onClick={() => updateJobStatus(job.id, 'En curso')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                    >
                      Iniciar Trabajo
                    </button>
                  )}

                  {job.status === 'En curso' && (
                    <button
                      onClick={() => updateJobStatus(job.id, 'Finalizado')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Marcar Finalizado</span>
                    </button>
                  )}

                  {job.status === 'Finalizado' && (
                    <button
                      onClick={() => updateJobStatus(job.id, 'Pendiente')}
                      className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-[11px] font-medium"
                    >
                      Reabrir tarea
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: NUEVO TRABAJO ADICIONAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-purple-600" />
                <span>Registrar Trabajo Adicional</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cliente Asociado *</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Título del Trabajo Extra *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Limpieza de conductos de ventilación, Pulido de mármol"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción del Trabajo</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles técnicos, productos requeridos y alcance pactado con el cliente..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prioridad</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-800 font-semibold"
                  >
                    <option value="alta">Alta (Urgente)</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha Programada</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cuadrilla Asignada</label>
                  <input
                    type="text"
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Origen del Requerimiento</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20"
                >
                  Crear Trabajo Adicional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
