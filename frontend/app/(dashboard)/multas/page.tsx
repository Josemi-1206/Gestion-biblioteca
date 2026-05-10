'use client';
import { useState, useEffect } from 'react';
import { multasService } from '@/services';
import { Multa } from '@/interfaces/multa.interface';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function MultasPage() {
  const [multas, setMultas] = useState<Multa[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const load = async () => {
    try { setMultas(await multasService.getAll()); }
    catch { setAlert({ type: 'error', msg: 'Error al cargar multas' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handlePagar = async (id: number) => {
    if (!confirm('¿Registrar pago de esta multa?')) return;
    try { await multasService.pagar(id); setAlert({ type: 'success', msg: 'Multa pagada correctamente' }); load(); }
    catch (e: any) { setAlert({ type: 'error', msg: e.message }); }
  };

  const total = multas.reduce((s, m) => s + (m.estado === 'pendiente' ? m.valor : 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Multas</h1>
          <p className="text-sm text-gray-500 mt-1">Multas generadas por devoluciones tardías</p>
        </div>
        {total > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm">
            <span className="text-red-600 font-semibold">Total pendiente: </span>
            <span className="text-red-700 font-bold">${total.toLocaleString()}</span>
          </div>
        )}
      </div>

      {alert && <Alert type={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['ID','Préstamo #','Usuario','Libro','Días de Retraso','Valor','Estado','Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {multas.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-gray-400">No hay multas registradas</td></tr>
              ) : multas.map(m => (
                <tr key={m.id} className={`hover:bg-gray-50 transition-colors ${m.estado === 'pendiente' ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-3 text-sm text-gray-500">{m.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">#{m.prestamoId}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{m.prestamo?.usuario?.nombre || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{m.prestamo?.ejemplar?.libro?.titulo || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-medium">{m.diasRetraso} días</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900">${m.valor.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge text={m.estado} variant={m.estado === 'pagada' ? 'green' : 'red'} />
                  </td>
                  <td className="px-4 py-3">
                    {m.estado === 'pendiente' && (
                      <button onClick={() => handlePagar(m.id)} className="text-green-600 hover:text-green-800 text-sm font-medium">
                        Registrar Pago
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
