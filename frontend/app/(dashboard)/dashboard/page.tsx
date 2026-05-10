'use client';
import { useState, useEffect } from 'react';
import { librosService, usuariosService, prestamosService, multasService, reservasService, ejemplaresService } from '@/services';
import Link from 'next/link';

interface Stats {
  libros: number; usuarios: number; prestamosActivos: number;
  multasPendientes: number; reservasActivas: number; ejemplaresDisponibles: number;
  totalMultas: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [prestamosVencidos, setPrestamosVencidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [libros, usuarios, prestamos, multas, reservas, ejemplares] = await Promise.all([
          librosService.getAll(), usuariosService.getAll(), prestamosService.getAll(),
          multasService.getAll(), reservasService.getAll(), ejemplaresService.getAll(),
        ]);
        const ahora = new Date();
        const activos = prestamos.filter(p => !p.fechaDevolucionReal);
        const vencidos = activos.filter(p => new Date(p.fechaDevolucionEsperada) < ahora);
        setPrestamosVencidos(vencidos.slice(0, 5));
        setStats({
          libros: libros.length, usuarios: usuarios.length,
          prestamosActivos: activos.length,
          multasPendientes: multas.filter(m => m.estado === 'pendiente').length,
          reservasActivas: reservas.filter(r => r.estado === 'activa').length,
          ejemplaresDisponibles: ejemplares.filter(e => e.estado === 'DISPONIBLE').length,
          totalMultas: multas.filter(m => m.estado === 'pendiente').reduce((s, m) => s + m.valor, 0),
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const cards = stats ? [
    { label: 'Libros en Catálogo', value: stats.libros, icon: '📚', href: '/libros', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { label: 'Usuarios Lectores', value: stats.usuarios, icon: '👤', href: '/usuarios', color: 'bg-purple-50 border-purple-200 text-purple-700' },
    { label: 'Préstamos Activos', value: stats.prestamosActivos, icon: '📖', href: '/prestamos', color: 'bg-green-50 border-green-200 text-green-700' },
    { label: 'Ejemplares Disponibles', value: stats.ejemplaresDisponibles, icon: '🗂️', href: '/ejemplares', color: 'bg-teal-50 border-teal-200 text-teal-700' },
    { label: 'Multas Pendientes', value: stats.multasPendientes, icon: '⚠️', href: '/multas', color: 'bg-red-50 border-red-200 text-red-700' },
    { label: 'Reservas Activas', value: stats.reservasActivas, icon: '🔖', href: '/reservas', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  ] : [];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen general del Sistema de Gestión de Biblioteca Digital</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <Link key={c.label} href={c.href} className={`rounded-xl border p-5 flex flex-col gap-2 hover:shadow-md transition-shadow ${c.color}`}>
            <div className="text-2xl">{c.icon}</div>
            <div className="text-3xl font-bold">{c.value}</div>
            <div className="text-sm font-medium opacity-80">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats && stats.totalMultas > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <h2 className="font-semibold text-red-700 mb-1">💰 Multas por Cobrar</h2>
            <p className="text-3xl font-bold text-red-800">${stats.totalMultas.toLocaleString()}</p>
            <p className="text-sm text-red-600 mt-1">{stats.multasPendientes} multa(s) pendiente(s)</p>
            <Link href="/multas" className="text-sm text-red-700 underline mt-2 inline-block">Ver multas →</Link>
          </div>
        )}

        {prestamosVencidos.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-800 mb-3">🚨 Préstamos Vencidos</h2>
            <div className="space-y-2">
              {prestamosVencidos.map(p => (
                <div key={p.id} className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700">{p.usuario?.nombre}</span>
                  <span className="text-gray-500 text-xs">{p.ejemplar?.libro?.titulo}</span>
                  <span className="text-red-500 text-xs">
                    {Math.floor((new Date().getTime() - new Date(p.fechaDevolucionEsperada).getTime()) / 86400000)} días
                  </span>
                </div>
              ))}
            </div>
            <Link href="/prestamos" className="text-sm text-blue-600 underline mt-2 inline-block">Ver todos →</Link>
          </div>
        )}

        {prestamosVencidos.length === 0 && stats?.totalMultas === 0 && (
          <div className="md:col-span-2 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <h2 className="font-semibold text-green-700">¡Todo en orden!</h2>
            <p className="text-sm text-green-600 mt-1">No hay préstamos vencidos ni multas pendientes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
