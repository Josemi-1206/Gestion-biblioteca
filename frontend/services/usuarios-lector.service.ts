import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { UsuarioLector } from '@/interfaces/usuario-lector.interface';

export const usuariosService = {
  getAll: () => apiGet<UsuarioLector[]>('/usuarios'),
  getOne: (id: number) => apiGet<UsuarioLector>(`/usuarios/${id}`),
  create: (data: Omit<UsuarioLector, 'id'>) => apiPost<UsuarioLector>('/usuarios', data),
  update: (id: number, data: Partial<UsuarioLector>) => apiPut<UsuarioLector>(`/usuarios/${id}`, data),
  delete: (id: number) => apiDelete<UsuarioLector>(`/usuarios/${id}`),
};
