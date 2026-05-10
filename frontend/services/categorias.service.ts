import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Categoria } from '@/interfaces/categoria.interface';

export const categoriasService = {
  getAll: () => apiGet<Categoria[]>('/categorias'),
  getOne: (id: number) => apiGet<Categoria>(`/categorias/${id}`),
  create: (data: Omit<Categoria, 'id'>) => apiPost<Categoria>('/categorias', data),
  update: (id: number, data: Partial<Categoria>) => apiPut<Categoria>(`/categorias/${id}`, data),
  delete: (id: number) => apiDelete<Categoria>(`/categorias/${id}`),
};
