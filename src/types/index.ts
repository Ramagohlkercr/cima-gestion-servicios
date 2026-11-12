export type UserRole = 'admin' | 'supervisor' | 'empleado';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  avatar: string;
  assignedClients?: string[]; // Client IDs
}

export interface Client {
  id: string;
  name: string;
  legalName?: string;
  cuit?: string;
  address: string;
  city: string;
  contactName: string;
  contactPhone: string;
  frequency: string;
  cleaningPlan: string;
  assignedStaff: string[]; // Employee names
  assignedSupervisor: string;
  areas: string[];
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
}

export type VisitStatus = 'Programada' | 'Declarada' | 'Verificada' | 'Pendiente' | 'Ausente';

export interface Visit {
  id: string;
  clientId: string;
  clientName: string;
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1 to 30
  employeeId: string;
  employeeName: string;
  supervisorName: string;
  shift: string; // e.g. "Mañana (07:00 - 13:00)"
  status: VisitStatus;
  checkInTime?: string; // e.g. "07:55"
  checkOutTime?: string; // e.g. "13:05"
  declaredNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  supervisorNotes?: string;
}

export type ChecklistItemRating = 'bien' | 'regular' | 'mal';

export interface ChecklistItem {
  id: string;
  category: string;
  rating: ChecklistItemRating;
  notes?: string;
}

export interface Supervision {
  id: string;
  clientId: string;
  clientName: string;
  supervisorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  checklist: {
    sanitarios: ChecklistItemRating;
    vidrios: ChecklistItemRating;
    pisos: ChecklistItemRating;
    areasCriticas: ChecklistItemRating;
    residuos: ChecklistItemRating;
    insumos: ChecklistItemRating;
  };
  overallScore: number; // 1 to 10
  observations: string;
  photoUrl?: string;
  detectedTask?: {
    title: string;
    priority: 'alta' | 'media' | 'baja';
    description: string;
    createdJobId?: string;
  };
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export type OrderStatus = 'Pendiente' | 'En preparación' | 'Preparado' | 'Entregado';

export interface SupplyOrder {
  id: string;
  orderNumber: string; // e.g. "PED-2026-089"
  clientId: string;
  clientName: string;
  requestedBy: string; // Employee name
  date: string; // YYYY-MM-DD
  items: OrderItem[];
  observations?: string;
  status: OrderStatus;
  remitoId?: string;
  updatedAt: string;
}

export interface Remito {
  id: string;
  remitoNumber: string; // e.g. "R-0001-00000142"
  orderId?: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  clientCuit: string;
  deliveryDate: string; // YYYY-MM-DD
  deliveredBy: string; // Supervisor or delivery person
  receivedBy?: string; // Recipient person at client site
  items: OrderItem[];
  status: 'Pendiente' | 'En tránsito' | 'Entregado';
  signatureData?: string; // base64 or drawn svg
  notes?: string;
  isFiscal: false; // Always false, clearly non-fiscal
  createdAt: string;
}

export type JobPriority = 'alta' | 'media' | 'baja';
export type JobStatus = 'Pendiente' | 'En curso' | 'Finalizado';

export interface AdditionalJob {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  priority: JobPriority;
  status: JobStatus;
  assignedStaff: string;
  source: string; // e.g. "Supervisión #SUP-104" or "Solicitud de cliente"
  targetDate: string;
  completedAt?: string;
  createdAt: string;
}
