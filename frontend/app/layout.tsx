import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Biblioteca Digital - CORHUILA',
  description: 'Sistema de Gestión de Biblioteca Digital',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
