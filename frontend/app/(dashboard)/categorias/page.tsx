'use client';
import { useState, useEffect } from 'react';
import { categoriasService } from '@/services';
import { Categoria } from '@/interfaces/categoria.interface';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [nombre, setNombre] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { setCategorias(await categoriasService.getAll()); }
    catch { setAlert({ type: 'error', msg: 'Error al cargar categorías' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setNombre(''); setModal(true); };
  const openEdit = (c: Categoria) => { setEditing(c); setNombre(c.nombre); setModal(true); };

  const handleSubmit = async () => {
    if (!nombre.trim()) { setAlert({ type: 'error', msg: 'El nombre es requerido' }); return; }
    setSaving(true);
    try {
      if (editing) await categoriasService.update(editing.id, { nombre });
      else await categoriasService.create({ nombre });
      setAlert({ type: 'success', msg: editing ? 'Categoría actualizada' : 'Categoría creada' });
      setModal(false); load();
    } catch (e: any) { setAlert({ type: 'error', msg: e.message }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try { await categoriasService.delete(id); setAlert({ type: 'success', msg: 'Categoría eliminada' }); load(); }
    catch (e: any) { setAlert({ type: 'error', msg: e.message }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-sm text-gray-500 mt-1">Clasificación temática de libros</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Nueva Categoría
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
                {['ID','Nombre','Acciones'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categorias.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-10 text-center text-gray-400">No hay categorías registradas</td></tr>
              ) : categorias.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{c.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{c.nombre}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(c)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} title={editing ? 'Editar Categoría' : 'Nueva Categoría'} onClose={() => setModal(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Novela, Ciencia, Historia..." />
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
