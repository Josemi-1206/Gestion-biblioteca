'use client';
import { useState, useEffect } from 'react';
import { librosService, categoriasService, autoresService } from '@/services';
import { Libro } from '@/interfaces/libro.interface';
import { Categoria } from '@/interfaces/categoria.interface';
import { Autor } from '@/interfaces/autor.interface';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';

const empty = { isbn: '', titulo: '', editorial: '', anio: new Date().getFullYear(), categoriaId: 0, autoresIds: [] as number[] };

export default function LibrosPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Libro | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [l, c, a] = await Promise.all([librosService.getAll(), categoriasService.getAll(), autoresService.getAll()]);
      setLibros(l); setCategorias(c); setAutores(a);
    } catch { setAlert({ type: 'error', msg: 'Error al cargar datos' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...empty, categoriaId: categorias[0]?.id || 0 }); setModal(true); };
  const openEdit = (l: Libro) => {
    setEditing(l);
    setForm({
      isbn: l.isbn, titulo: l.titulo, editorial: l.editorial, anio: l.anio,
      categoriaId: l.categoriaId, autoresIds: l.autores?.map(a => a.autor.id) || [],
    });
    setModal(true);
  };

  const toggleAutor = (id: number) => {
    setForm(f => ({ ...f, autoresIds: f.autoresIds.includes(id) ? f.autoresIds.filter(x => x !== id) : [...f.autoresIds, id] }));
  };

  const handleSubmit = async () => {
    if (!form.titulo.trim() || !form.isbn.trim() || !form.categoriaId) {
      setAlert({ type: 'error', msg: 'Título, ISBN y categoría son requeridos' }); return;
    }
    setSaving(true);
    try {
      if (editing) await librosService.update(editing.id, form);
      else await librosService.create(form);
      setAlert({ type: 'success', msg: editing ? 'Libro actualizado' : 'Libro creado' });
      setModal(false); load();
    } catch (e: any) { setAlert({ type: 'error', msg: e.message }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este libro?')) return;
    try { await librosService.delete(id); setAlert({ type: 'success', msg: 'Libro eliminado' }); load(); }
    catch (e: any) { setAlert({ type: 'error', msg: e.message }); }
  };

  const disponibles = (l: Libro) => l.ejemplares?.filter(e => e.estado === 'DISPONIBLE').length ?? 0;
  const total = (l: Libro) => l.ejemplares?.length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Libros</h1>
          <p className="text-sm text-gray-500 mt-1">Catálogo bibliográfico del sistema</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Nuevo Libro
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
                {['ID','ISBN','Título','Editorial','Año','Categoría','Autores','Ejemplares','Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {libros.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-10 text-center text-gray-400">No hay libros registrados</td></tr>
              ) : libros.map(l => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-500">{l.id}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{l.isbn}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[160px] truncate">{l.titulo}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{l.editorial}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{l.anio}</td>
                  <td className="px-4 py-3"><Badge text={l.categoria?.nombre || '—'} variant="blue" /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {l.autores?.map(a => a.autor.nombre).join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge text={`${disponibles(l)}/${total(l)}`} variant={disponibles(l) > 0 ? 'green' : 'red'} />
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => openEdit(l)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                    <button onClick={() => handleDelete(l.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} title={editing ? 'Editar Libro' : 'Nuevo Libro'} onClose={() => setModal(false)}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ISBN *</label>
              <input value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="978-..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
              <input type="number" value={form.anio} onChange={e => setForm({...form, anio: +e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Título del libro" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Editorial</label>
            <input value={form.editorial} onChange={e => setForm({...form, editorial: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Editorial" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
            <select value={form.categoriaId} onChange={e => setForm({...form, categoriaId: +e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value={0}>Seleccionar categoría...</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Autores</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {autores.map(a => (
                <label key={a.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.autoresIds.includes(a.id)} onChange={() => toggleAutor(a.id)}
                    className="rounded text-blue-600" />
                  <span className="text-sm text-gray-700">{a.nombre}</span>
                </label>
              ))}
            </div>
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
