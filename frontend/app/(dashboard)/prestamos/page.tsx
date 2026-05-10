'use client';
import { useState, useEffect } from 'react';
import { prestamosService, usuariosService, ejemplaresService } from '@/services';
import { Prestamo } from '@/interfaces/prestamo.interface';
import { UsuarioLector } from '@/interfaces/usuario-lector.interface';
import { Ejemplar } from '@/interfaces/ejemplar.interface';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}

function defaultDevolucion() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split('T')[0];
}

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioLector[]>([]);
  const [ejemplares, setEjemplares] = useState<Ejemplar[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ usuarioId: 0, ejemplarId: 0, fechaDevolucionEsperada: defaultDevolucion() });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [p, u, e] = await Promise.all([prestamosService.getAll(), usuariosService.getAll(), ejemplaresService.getAll()]);
      setPrestamos(p); setUsuarios(u); setEjemplares(e);
    } catch { setAlert({ type: 'error', msg: 'Error al cargar datos' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const disponibles = ejemplares.filter(e => e.estado === 'DISPONIBLE');

  const openCreate = () => {
    setForm({ usuarioId: usuarios[0]?.id || 0, ejemplarId: disponibles[0]?.id || 0, fechaDevolucionEsperada: defaultDevolucion() });
    setModal(true);
  };

  const handleSubmit = async () => {
    if (!form.usuarioId || !form.ejemplarId || !form.fechaDevolucionEsperada) {
      setAlert({ type: 'error', msg: 'Todos los campos son requeridos' }); return;
    }
    setSaving(true);
    try {
      await prestamosService.create(form);
      setAlert({ type: 'success', msg: 'Préstamo registrado correctamente' });
      setModal(false); load();
    } catch (e: any) { setAlert({ type: 'error', msg: e.message }); }
    finally { setSaving(false); }
  };

  const handleDevolver = async (id: number) => {
    if (!confirm('¿Registrar devolución de este préstamo?')) return;
    try { await prestamosService.devolver(id); setAlert({ type: 'success', msg: 'Devolución registrada' }); load(); }
    catch (e: any) { setAlert({ type: 'error', msg: e.message }); }
  };

  const isVencido = (p: Prestamo) => !p.fechaDevolucionReal && new Date(p.fechaDevolucionEsperada) < new Date();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Préstamos</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de préstamos de ejemplares</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Nuevo Préstamo
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['ID','Usuario','Libro / Ejemplar','Fecha Préstamo','Devolución Esperada','Estado','Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {prestamos.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-400">No hay préstamos registrados</td></tr>
              ) : prestamos.map(p => (
                <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${isVencido(p) ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.usuario?.nombre || `#${p.usuarioId}`}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {p.ejemplar?.libro?.titulo || '—'}
                    <span className="text-xs text-gray-400 ml-1">(Ej. #{p.ejemplarId})</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(p.fechaPrestamo)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(p.fechaDevolucionEsperada)}</td>
                  <td className="px-4 py-3">
                    {p.fechaDevolucionReal
                      ? <Badge text="Devuelto" variant="green" />
                      : isVencido(p)
                        ? <Badge text="Vencido" variant="red" />
                        : <Badge text="Activo" variant="blue" />}
                  </td>
                  <td className="px-4 py-3">
                    {!p.fechaDevolucionReal && (
                      <button onClick={() => handleDevolver(p.id)} className="text-green-600 hover:text-green-800 text-sm font-medium">
                        Devolver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} title="Nuevo Préstamo" onClose={() => setModal(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario *</label>
            <select value={form.usuarioId} onChange={e => setForm({...form, usuarioId: +e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value={0}>Seleccionar usuario...</option>
              {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre} ({u.tipo})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ejemplar Disponible *</label>
            <select value={form.ejemplarId} onChange={e => setForm({...form, ejemplarId: +e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value={0}>Seleccionar ejemplar...</option>
              {disponibles.map(e => <option key={e.id} value={e.id}>#{e.id} - {e.libro?.titulo || `Libro #${e.libroId}`}</option>)}
            </select>
            {disponibles.length === 0 && <p className="text-xs text-red-500 mt-1">No hay ejemplares disponibles.</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Devolución Esperada *</label>
            <input type="date" value={form.fechaDevolucionEsperada} onChange={e => setForm({...form, fechaDevolucionEsperada: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
            <button onClick={handleSubmit} disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {saving ? 'Guardando...' : 'Registrar Préstamo'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
