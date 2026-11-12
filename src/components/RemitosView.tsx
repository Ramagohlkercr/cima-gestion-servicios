import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SignaturePad } from './SignaturePad';
import type { Remito } from '../types';
import {
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Building2,
  Calendar,
  User,
  ShieldAlert,
  X,
  ExternalLink,
  ChevronRight,
  PenTool,
} from 'lucide-react';

export const RemitosView: React.FC = () => {
  const { remitos, selectedRemitoId, setSelectedRemitoId, updateRemitoStatus } = useApp();

  const [isSigning, setIsSigning] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [drawnSignature, setDrawnSignature] = useState<string | null>(null);

  const activeRemito = remitos.find((r) => r.id === selectedRemitoId);

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRemito) return;

    updateRemitoStatus(
      activeRemito.id,
      'Entregado',
      drawnSignature || `Firma Conforme: ${recipientName.trim() || 'Receptor'}`,
      recipientName.trim() || activeRemito.receivedBy
    );
    setIsSigning(false);
  };

  const getRemitoStatusBadge = (status: Remito['status']) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'En tránsito':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Entregado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header (hidden in print) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-7 h-7 text-blue-600" />
              <span>Remitos Digitales ({remitos.length})</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Control de Entregas
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Digitalización de los remitos X impresos: trazabilidad de despacho, firma digital en móvil y vista imprimible en PDF.
          </p>
        </div>
      </div>

      {/* Remitos List (hidden in print) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
        {remitos.map((remito) => (
          <div
            key={remito.id}
            onClick={() => {
              setSelectedRemitoId(remito.id);
              setRecipientName(remito.receivedBy || '');
            }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-blue-400 transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition">
                    {remito.remitoNumber}
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 mt-0.5">{remito.clientName}</h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRemitoStatusBadge(
                    remito.status
                  )}`}
                >
                  {remito.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">{remito.clientAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Fecha de emisión: {remito.deliveryDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    Entrega:{' '}
                    <strong>{remito.receivedBy ? `${remito.receivedBy}` : 'Pendiente de firma'}</strong>
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <span className="font-bold text-slate-700">Contenido ({remito.items.length} ítems):</span>
                <p className="line-clamp-1 mt-0.5">
                  {remito.items.map((i) => `${i.quantity} ${i.unit} de ${i.name.split('(')[0]}`).join(', ')}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span className="text-slate-400 font-normal text-[11px]">Doc. No Fiscal · Demo</span>
              <div className="flex items-center gap-1 group-hover:translate-x-1 transition">
                <span>Ver Remito Imprimible</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: PRINTABLE REMITO VIEW (FORMAL CORPORATE DESIGN) */}
      {activeRemito && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 overflow-y-auto printable-area">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-auto max-h-[95vh] overflow-y-auto">
            {/* Top Toolbar (no-print) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 no-print">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Vista de Remito</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRemitoStatusBadge(
                    activeRemito.status
                  )}`}
                >
                  {activeRemito.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {activeRemito.status !== 'Entregado' && (
                  <button
                    onClick={() => setIsSigning(!isSigning)}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Firmar Recepción</span>
                  </button>
                )}

                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / PDF</span>
                </button>

                <button
                  onClick={() => setSelectedRemitoId(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* FORMAL REMITO DOCUMENT LAYOUT */}
            <div className="border-2 border-slate-900 rounded-xl p-6 bg-white text-slate-900 text-xs">
              {/* Document Header */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pb-4 border-b-2 border-slate-900">
                {/* Left: CIMA Brand */}
                <div className="sm:col-span-5 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0B2545] text-white flex items-center justify-center font-black text-sm">
                      C
                    </div>
                    <div>
                      <h2 className="font-extrabold text-lg tracking-tight text-[#0B2545]">
                        CIMA LIMPIEZA
                      </h2>
                      <p className="text-[10px] text-slate-500 font-bold tracking-wider">
                        GESTIÓN DE SERVICIOS
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug pt-1">
                    Servicios de Limpieza Integral y Suministro de Insumos<br />
                    Rosario, Santa Fe · Argentina<br />
                    Tel: 0341-325-0517 · www.cimalimpieza.com
                  </p>
                </div>

                {/* Center: "X" box */}
                <div className="sm:col-span-2 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-2 border-slate-900 flex flex-col items-center justify-center font-black text-2xl bg-slate-50">
                    X
                  </div>
                  <span className="text-[9px] font-bold text-center mt-1 uppercase text-slate-700">
                    Doc. No Válido Como Factura
                  </span>
                </div>

                {/* Right: Remito Number & Date */}
                <div className="sm:col-span-5 text-left sm:text-right space-y-1 sm:pl-4">
                  <div className="text-xs uppercase font-extrabold text-slate-600">REMITO</div>
                  <div className="text-xl font-black text-slate-900 tracking-wider">
                    {activeRemito.remitoNumber}
                  </div>
                  <div className="text-xs text-slate-700 font-semibold">
                    Fecha de Emisión: <strong>{activeRemito.deliveryDate}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    CUIT: 30-71889922-4 · Ing. Brutos: 902-182901-2
                  </div>
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="py-4 border-b border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Cliente / Destinatario:
                  </div>
                  <div className="font-extrabold text-sm text-slate-900">{activeRemito.clientName}</div>
                  <div className="text-slate-700 mt-0.5">CUIT: {activeRemito.clientCuit}</div>
                  <div className="text-slate-700">Domicilio de Entrega: {activeRemito.clientAddress}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Datos del Traslado / Despacho:
                  </div>
                  <div className="text-slate-700">
                    Responsable de Entrega: <strong>{activeRemito.deliveredBy}</strong>
                  </div>
                  <div className="text-slate-700">
                    Condición de Pago / Pliego: <strong>Abono Mensual de Servicios</strong>
                  </div>
                  {activeRemito.orderId && (
                    <div className="text-slate-700">
                      Pedido de Origen: <strong>#{activeRemito.orderId}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="py-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-bold text-slate-700 uppercase">
                      <th className="py-2 px-3 w-16">Cant.</th>
                      <th className="py-2 px-3 w-28">Unidad</th>
                      <th className="py-2 px-3">Descripción del Insumo / Material</th>
                      <th className="py-2 px-3 w-24 text-center">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {activeRemito.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-slate-600">{item.unit}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{item.name}</td>
                        <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">
                          ✓ Conforme
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notes */}
              {activeRemito.notes && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-4">
                  <strong>Observaciones:</strong> {activeRemito.notes}
                </div>
              )}

              {/* Signatures Block */}
              <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center text-xs">
                <div className="pt-10 border-t border-slate-400">
                  <div className="font-bold text-slate-900">{activeRemito.deliveredBy}</div>
                  <div className="text-[11px] text-slate-500">Por CIMA Limpieza (Despacho)</div>
                </div>

                <div className="pt-10 border-t border-slate-400">
                  {activeRemito.signatureData?.startsWith('data:image') ? (
                    <img
                      src={activeRemito.signatureData}
                      alt="Firma"
                      className="h-12 mx-auto mb-1 object-contain"
                    />
                  ) : (
                    <div className="font-bold text-slate-900 italic mb-1">
                      {activeRemito.signatureData || 'Firma de recepción'}
                    </div>
                  )}
                  <div className="font-bold text-slate-900">
                    {activeRemito.receivedBy || 'Firma y Aclaración del Receptor'}
                  </div>
                  <div className="text-[11px] text-slate-500">Recibí Conforme / Personal Autorizado</div>
                </div>
              </div>

              {/* Mandatory Non-Fiscal Disclaimer */}
              <div className="mt-6 pt-3 border-t border-dashed border-slate-300 text-center text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                * DOCUMENTO INTERNO DE TRASLADO Y CONTROL DE SERVICIOS · DEMOSTRACIÓN COMERCIAL CIMA · NO CONSTITUYE FACTURA *
              </div>
            </div>

            {/* Interactive Signature Box (no-print) */}
            {isSigning && activeRemito.status !== 'Entregado' && (
              <div className="mt-6 p-4 rounded-xl border border-blue-200 bg-blue-50/40 no-print animate-in fade-in duration-150">
                <h4 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-blue-600" />
                  <span>Constancia de Recepción en el Celular</span>
                </h4>

                <form onSubmit={handleConfirmDelivery} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre y DNI de quien recibe en cliente *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Sergio Menéndez (DNI 28.491.022)"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Firma Digital en Pantalla
                    </label>
                    <SignaturePad onSave={(dataUrl) => setDrawnSignature(dataUrl)} />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSigning(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                    >
                      Confirmar Entrega y Guardar Firma
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
