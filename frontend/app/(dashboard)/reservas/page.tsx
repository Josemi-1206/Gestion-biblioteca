'use client';
import { useState, useEffect } from 'react';
import { reservasService, usuariosService, librosService } from '@/services';
import { Reserva } from '@/interfaces/reserva.interface';
import { UsuarioLector } from '@/interfaces/usuario-lector.interface';
import { Libro } from '@/interfaces/libro.interface';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioLector[]>([]);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ usuarioId: 0, libroId: 0 });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [r, u, l] = await Promise.all([reservasService.getAll(), usuariosService.getAll(), librosService.getAll()]);
      setReservas(r); setUsuarios(u); setLibros(l);
    } catch { setAlert({ type: 'error', msg: 'Error al cargar datos' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ usuarioId: usuarios[0]?.id || 0, libroId: libros[0]?.id || 0 }); setModal(true);
  };

  const handleSubmit = async () => {
    if (!form.usuarioId || !form.libroId) { setAlert({ type: 'error', msg: 'Selecciona usuario y libro' }); return; }
    setSaving(true);
    try {
      await reservasService.create(form);
      setAlert({ type: 'success', msg: 'Reserva creada correctamente' });
      setModal(false); load();
    } catch (e: any) { setAlert({ type: 'error', msg: e.message }); }
    finally { setSaving(false); }
  };

  const handleCancelar = async (id: number) => {
    if (!confirm('¿Cancelar esta reserva?')) return;
    try { await reservasService.cancelar(id); setAlert({ type: 'success', msg: 'Reserva cancelada' }); load(); }
    catch (e: any) { setAlert({ type: 'error', msg: e.message }); }
  };

  const badgeVariant = (estado: string) => {
    if (estado === 'activa') return 'blue';
    if (estado === 'cancelada') return 'red';
    return 'gray';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de reservas de libros</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Nueva Reserva
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
                {['ID','Usuario','Libro','Fecha de Reserva','Estado','Acciones'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reservas.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">No hay reservas registradas</td></tr>
              ) : reservas.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{r.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{r.usuario?.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{r.libro?.titulo}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(r.fechaReserva)}</td>
                  <td className="px-6 py-4"><Badge text={r.estado} variant={badgeVariant(r.estado)} /></td>
                  <td className="px-6 py-4">
                    {r.estado === 'activa' && (
                      <button onClick={() => handleCancelar(r.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} title="Nueva Reserva" onClose={() => setModal(false)}>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Libro *</label>
            <select value={form.libroId} onChange={e => setForm({...form, libroId: +e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value={0}>Seleccionar libro...</option>
              {libros.map(l => <option key={l.id} value={l.id}>{l.titulo}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
            <button onClick={handleSubmit} disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {saving ? 'Guardando...' : 'Crear Reserva'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
