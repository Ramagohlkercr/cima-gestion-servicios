import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { ChecklistItemRating, Supervision } from '../types';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Camera,
  Plus,
  Calendar,
  Clock,
  User,
  Building2,
  Wrench,
  ChevronRight,
  Sparkles,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

export const SupervisionsView: React.FC = () => {
  const { clients, supervisions, addSupervision, currentUser, setActiveTab } = useApp();
  const [showNewForm, setShowNewForm] = useState(false);

  // Form State
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [date, setDate] = useState('2026-11-12');
  const [time, setTime] = useState('11:30');
  const [observations, setObservations] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600'
  );

  // Checklist ratings
  const [ratings, setRatings] = useState<{
    sanitarios: ChecklistItemRating;
    vidrios: ChecklistItemRating;
    pisos: ChecklistItemRating;
    areasCriticas: ChecklistItemRating;
    residuos: ChecklistItemRating;
    insumos: ChecklistItemRating;
  }>({
    sanitarios: 'bien',
    vidrios: 'bien',
    pisos: 'bien',
    areasCriticas: 'bien',
    residuos: 'bien',
    insumos: 'bien',
  });

  // Detected Task toggle & fields
  const [hasDetectedTask, setHasDetectedTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'alta' | 'media' | 'baja'>('alta');
  const [taskDescription, setTaskDescription] = useState('');

  const checklistCategories = [
    { key: 'sanitarios', label: '1. Sanitarios y Griferías', desc: 'Inodoros, bachas, espejos y desinfección profunda' },
    { key: 'vidrios', label: '2. Vidrios y Carpinterías', desc: 'Mamparas, aberturas, vidrios bajos y puertas' },
    { key: 'pisos', label: '3. Pisos, Zócalos y Pasillos', desc: 'Aspirado, baldeado con amonio y brillo general' },
    { key: 'areasCriticas', label: '4. Áreas Críticas / Quirófanos', desc: 'Protocolo aséptico y control bacteriológico' },
    { key: 'residuos', label: '5. Cestos y Retiro de Residuos', desc: 'Bolsas reemplazadas, cestos limpios y clasificados' },
    { key: 'insumos', label: '6. Reposición de Insumos Básicos', desc: 'Jabón, toallas de papel y alcohol en gel disponibles' },
  ];

  const handleRatingChange = (key: keyof typeof ratings, rating: ChecklistItemRating) => {
    setRatings((prev) => ({ ...prev, [key]: rating }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateScore = () => {
    const values = Object.values(ratings);
    let points = 0;
    values.forEach((v) => {
      if (v === 'bien') points += 10;
      else if (v === 'regular') points += 6;
      else points += 2;
    });
    return Math.round(points / values.length);
  };

  const handleSubmitSupervision = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId);
    if (!client) return;

    addSupervision(
      {
        clientId: client.id,
        clientName: client.name,
        supervisorName: currentUser.name,
        date,
        time,
        checklist: ratings,
        overallScore: calculateScore(),
        observations: observations.trim() || 'Auditoría presencial completada conforme a protocolo.',
        photoUrl: photoUrl || undefined,
        detectedTask: hasDetectedTask
          ? {
              title: taskTitle.trim() || `Trabajo adicional en ${client.name}`,
              priority: taskPriority,
              description: taskDescription.trim() || 'Detectado durante supervisión técnica.',
            }
          : undefined,
      },
      hasDetectedTask
    );

    // Reset Form
    setShowNewForm(false);
    setObservations('');
    setHasDetectedTask(false);
    setTaskTitle('');
    setTaskDescription('');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ClipboardCheck className="w-7 h-7 text-emerald-600" />
              <span>Supervisiones en Terreno ({supervisions.length})</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Control Calidad CIMA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Auditorías con checklist móvil, calificación Bien/Regular/Mal, fotos y derivación de trabajos extra.
          </p>
        </div>

        {!showNewForm && (
          <button
            onClick={() => setShowNewForm(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Supervisión en Sitio</span>
          </button>
        )}
      </div>

      {/* NEW SUPERVISION FORM (MOBILE FIRST DESIGN) */}
      {showNewForm && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-5 sm:p-7 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <div>
              <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                Auditoría Presencial
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                Formulario Móvil de Supervisión
              </h2>
            </div>
            <button
              onClick={() => setShowNewForm(false)}
              className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 text-xs font-semibold"
            >
              Cerrar Formulario
            </button>
          </div>

          <form onSubmit={handleSubmitSupervision} className="space-y-6 text-xs">
            {/* 1. Client & Supervisor Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cliente a Auditar *</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Supervisor Responsable</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.name}
                  className="w-full px-3 py-2 bg-slate-100 rounded-xl border border-slate-200 text-slate-700 font-semibold cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2 py-2 bg-white rounded-xl border border-slate-300 text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hora</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-2 py-2 bg-white rounded-xl border border-slate-300 text-slate-800 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* 2. Checklist (Bien / Regular / Mal) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Checklist de Puntos de Control Obligatorios
                </h3>
                <span className="text-[11px] text-slate-500">
                  Puntaje proyectado: <strong>{calculateScore()} / 10</strong>
                </span>
              </div>

              <div className="space-y-3">
                {checklistCategories.map((cat) => {
                  const currentRating = ratings[cat.key as keyof typeof ratings];
                  return (
                    <div
                      key={cat.key}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{cat.label}</div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{cat.desc}</p>
                      </div>

                      {/* 3 Rating Buttons */}
                      <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() =>
                            handleRatingChange(cat.key as keyof typeof ratings, 'bien')
                          }
                          className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition text-xs ${
                            currentRating === 'bien'
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Bien</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleRatingChange(cat.key as keyof typeof ratings, 'regular')
                          }
                          className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition text-xs ${
                            currentRating === 'regular'
                              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Regular</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleRatingChange(cat.key as keyof typeof ratings, 'mal')
                          }
                          className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition text-xs ${
                            currentRating === 'mal'
                              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                              : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Mal</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Observations & Photo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Observaciones Generales de la Inspección
                </label>
                <textarea
                  rows={4}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Detallar sectores revisados, diálogo con el cliente o sugerencias para el operario..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Fotografía de Evidencia en Terreno
                </label>
                <div className="flex items-center gap-3">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Evidencia"
                      className="w-20 h-20 rounded-xl object-cover border border-slate-300 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400">
                      <Camera className="w-8 h-8" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <label className="block">
                      <span className="sr-only">Subir fotografía</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="block w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                      />
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Foto cargada para respaldar informe ante el cliente.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Detect Tarea Pendiente / Trabajo Adicional */}
            <div className="p-4 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/40 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-blue-950 text-sm">
                <input
                  type="checkbox"
                  checked={hasDetectedTask}
                  onChange={(e) => setHasDetectedTask(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>¿Detectó una tarea pendiente o necesidad de Trabajo Adicional?</span>
              </label>

              {hasDetectedTask && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">
                        Título de la Tarea / Trabajo *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Pulido de pisos por manchas de lluvia, Hidrolavado de fachada"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-800 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Prioridad</label>
                      <select
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-800 font-semibold"
                      >
                        <option value="alta">Alta (Urgente)</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Descripción del Trabajo Adicional
                    </label>
                    <input
                      type="text"
                      placeholder="Detalle los recursos o cuadrilla requerida para cotizar / programar..."
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-800"
                    />
                  </div>
                  <p className="text-[11px] text-blue-700 italic">
                    ✓ Al finalizar la supervisión, esta tarea se creará automáticamente en el módulo de Trabajos Adicionales y alertará a Administración.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 text-sm transition flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Finalizar Supervisión</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUPERVISIONS HISTORY LIST */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
          Historial de Supervisiones Registradas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {supervisions.map((sup) => {
            const hasTask = !!sup.detectedTask;
            return (
              <div
                key={sup.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Top: Client and Score */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-bold text-base text-slate-900">{sup.clientName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sup.date} a las {sup.time} hs</span>
                        <span>· Por {sup.supervisorName}</span>
                      </p>
                    </div>

                    <div className="text-center px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-xl">
                      <div className="text-lg font-black text-emerald-700 leading-none">
                        {sup.overallScore}
                      </div>
                      <div className="text-[9px] font-bold text-emerald-800 uppercase">Puntos</div>
                    </div>
                  </div>

                  {/* Checklist Summary Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] mb-3">
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">Sanitarios:</span>
                      <strong className={sup.checklist.sanitarios === 'bien' ? 'text-emerald-700 capitalize' : 'text-amber-700 capitalize'}>
                        {sup.checklist.sanitarios}
                      </strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">Vidrios:</span>
                      <strong className={sup.checklist.vidrios === 'bien' ? 'text-emerald-700 capitalize' : 'text-amber-700 capitalize'}>
                        {sup.checklist.vidrios}
                      </strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">Pisos:</span>
                      <strong className={sup.checklist.pisos === 'bien' ? 'text-emerald-700 capitalize' : 'text-amber-700 capitalize'}>
                        {sup.checklist.pisos}
                      </strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">Áreas Crít.:</span>
                      <strong className={sup.checklist.areasCriticas === 'bien' ? 'text-emerald-700 capitalize' : 'text-amber-700 capitalize'}>
                        {sup.checklist.areasCriticas}
                      </strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">Residuos:</span>
                      <strong className={sup.checklist.residuos === 'bien' ? 'text-emerald-700 capitalize' : 'text-amber-700 capitalize'}>
                        {sup.checklist.residuos}
                      </strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">Insumos:</span>
                      <strong className={sup.checklist.insumos === 'bien' ? 'text-emerald-700 capitalize' : 'text-amber-700 capitalize'}>
                        {sup.checklist.insumos}
                      </strong>
                    </div>
                  </div>

                  {/* Observations */}
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 italic leading-relaxed mb-3">
                    "{sup.observations}"
                  </p>

                  {/* Evidence Photo thumbnail */}
                  {sup.photoUrl && (
                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src={sup.photoUrl}
                        alt="Evidencia"
                        className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                      />
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                        <span>Fotografía adjunta en reporte</span>
                      </span>
                    </div>
                  )}

                  {/* Detected Task Badge */}
                  {hasTask && (
                    <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-purple-600 shrink-0" />
                        <div>
                          <div className="font-bold text-purple-950">{sup.detectedTask?.title}</div>
                          <div className="text-[10px] text-purple-700">
                            Prioridad: {sup.detectedTask?.priority.toUpperCase()} · Se envió a Trabajos Extra
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('jobs')}
                        className="text-[11px] font-bold text-purple-700 hover:underline"
                      >
                        Ver →
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>ID: {sup.id}</span>
                  <span className="text-emerald-600 font-bold">✓ Auditoría Oficial CIMA</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
