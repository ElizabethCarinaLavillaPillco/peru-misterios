// =============================================================
// ARCHIVO: src/pages/admin/users/UsersListPage.jsx
// =============================================================
import React from 'react';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import { 
  IoSearch, 
  IoAdd,
  IoPencil, 
  IoTrash,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoPersonOutline,
  IoShieldCheckmark
} from 'react-icons/io5';

export default function UsersListPage() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data.data || []);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      alert('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      alert('Error al eliminar el usuario');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600 mt-1">
              {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => {/* Implementar modal de crear */}}
            className="flex items-center gap-2 bg-pm-gold text-white px-6 py-3 rounded-lg hover:bg-pm-gold/90 transition-colors font-semibold shadow-md"
          >
            <IoAdd size={20} />
            Crear Usuario
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="client">Clientes</option>
            </select>
          </div>
        </div>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <IoPersonOutline size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Los usuarios registrados aparecerán aquí'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha de Registro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-semibold text-gray-900">{u.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            <IoShieldCheckmark size={14} />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            <IoPersonOutline size={14} />
                            Cliente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {u.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            <IoCheckmarkCircle size={14} />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            <IoCloseCircle size={14} />
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(u.created_at).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {/* Implementar edición */}}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <IoPencil size={18} />
                          </button>
                          {u.id !== user.id && (
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <IoTrash size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}