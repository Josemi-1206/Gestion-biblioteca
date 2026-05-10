'use client';
import { useState, useEffect } from 'react';
import { ejemplaresService, librosService } from '@/services';
import { Ejemplar } from '@/interfaces/ejemplar.interface';
import { Libro } from '@/interfaces/libro.interface';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';

export default function EjemplaresPage() {
  const [ejemplares, setEjemplares] = useState<Ejemplar[]>([]);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ libroId: 0, estado: 'DISPONIBLE' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [e, l] = await Promise.all([ejemplaresService.getAll(), librosService.getAll()]);
      setEjemplares(e); setLibros(l);
    } catch { setAlert({ type: 'error', msg: 'Error al cargar datos' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ libroId: libros[0]?.id || 0, estado: 'DISPONIBLE' }); setModal(true); };

  const handleSubmit = async () => {
    if (!form.libroId) { setAlert({ type: 'error', msg: 'Selecciona un libro' }); return; }
    setSaving(true);
    try {
      await ejemplaresService.create({ libroId: form.libroId, estado: form.estado });
      setAlert({ type: 'success', msg: 'Ejemplar creado' });
      setModal(false); load();
    } catch (e: any) { setAlert({ type: 'error', msg: e.message }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este ejemplar?')) return;
    try { await ejemplaresService.delete(id); setAlert({ type: 'success', msg: 'Ejemplar eliminado' }); load(); }
    catch (e: any) { setAlert({ type: 'error', msg: e.message }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ejemplares</h1>
          <p className="text-sm text-gray-500 mt-1">Inventario físico de copias de cada libro</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Nuevo Ejemplar
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
                {['ID','Libro','ISBN','Estado','Acciones'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ejemplares.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No hay ejemplares registrados</td></tr>
              ) : ejemplares.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{e.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{e.libro?.titulo || '—'}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">{e.libro?.isbn || '—'}</td>
                  <td className="px-6 py-4">
                    <Badge text={e.estado} variant={e.estado === 'DISPONIBLE' ? 'green' : 'red'} />
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(e.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} title="Nuevo Ejemplar" onClose={() => setModal(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Libro *</label>
            <select value={form.libroId} onChange={e => setForm({...form, libroId: +e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value={0}>Seleccionar libro...</option>
              {libros.map(l => <option key={l.id} value={l.id}>{l.titulo} ({l.isbn})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado inicial</label>
            <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="DISPONIBLE">Disponible</option>
              <option value="PRESTADO">Prestado</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
            <button onClick={handleSubmit} disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
