'use client';
import { useState, useEffect } from 'react';
import { usuariosService } from '@/services';
import { UsuarioLector } from '@/interfaces/usuario-lector.interface';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';

const empty = { nombre: '', tipo: 'ESTUDIANTE', limitePrestamos: 3 };

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioLector[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<UsuarioLector | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { setUsuarios(await usuariosService.getAll()); }
    catch { setAlert({ type: 'error', msg: 'Error al cargar usuarios' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (u: UsuarioLector) => {
    setEditing(u); setForm({ nombre: u.nombre, tipo: u.tipo, limitePrestamos: u.limitePrestamos }); setModal(true);
  };

  const handleSubmit = async () => {
    if (!form.nombre.trim()) { setAlert({ type: 'error', msg: 'El nombre es requerido' }); return; }
    setSaving(true);
    try {
      if (editing) await usuariosService.update(editing.id, form);
      else await usuariosService.create(form);
      setAlert({ type: 'success', msg: editing ? 'Usuario actualizado' : 'Usuario creado' });
      setModal(false); load();
    } catch (e: any) { setAlert({ type: 'error', msg: e.message }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    try { await usuariosService.delete(id); setAlert({ type: 'success', msg: 'Usuario eliminado' }); load(); }
    catch (e: any) { setAlert({ type: 'error', msg: e.message }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios Lectores</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de lectores registrados en la biblioteca</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Nuevo Usuario
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
                {['ID','Nombre','Tipo','Límite de Préstamos','Acciones'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usuarios.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No hay usuarios registrados</td></tr>
              ) : usuarios.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{u.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{u.nombre}</td>
                  <td className="px-6 py-4">
                    <Badge text={u.tipo} variant={u.tipo === 'DOCENTE' ? 'blue' : 'gray'} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.limitePrestamos} préstamos</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(u)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                    <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} title={editing ? 'Editar Usuario' : 'Nuevo Usuario'} onClose={() => setModal(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nombre completo" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuario</label>
            <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value, limitePrestamos: e.target.value === 'DOCENTE' ? 5 : 3})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="ESTUDIANTE">Estudiante</option>
              <option value="DOCENTE">Docente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Límite de Préstamos Simultáneos</label>
            <input type="number" min={1} max={10} value={form.limitePrestamos} onChange={e => setForm({...form, limitePrestamos: +e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
