import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

function App() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    getAccessTokenSilently,
    isLoading,
  } = useAuth0();

  const [perfil, setPerfil] = useState<any>(null);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  // 🔥 EDICIÓN
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: '',
    institucionId: '',
  });

  // 🔥 INVITAR
  const [nuevoUsuario, setNuevoUsuario] = useState({
    email: '',
    nombre: '',
  });

  // =========================
  // 🔹 PERFIL
  // =========================

  const obtenerPerfil = async () => {
    const token = await getAccessTokenSilently();

    const res = await fetch(
      'https://prometeo-z6hv.onrender.com/usuarios/perfil',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setPerfil(data);
  };

  // =========================
  // 🔹 LISTAR USUARIOS
  // =========================

  const obtenerUsuarios = async () => {
    const token = await getAccessTokenSilently();

    const res = await fetch(
      'https://prometeo-z6hv.onrender.com/usuarios/todos',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setUsuarios(data);
  };

  // =========================
  // 🔹 ELIMINAR
  // =========================

  const eliminarUsuario = async (id: string) => {
    const token = await getAccessTokenSilently();

    await fetch(
      `https://prometeo-z6hv.onrender.com/usuarios/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    obtenerUsuarios();
  };

  // =========================
  // 🔹 ACTUALIZAR
  // =========================

  const actualizarUsuario = async (id: string) => {
    const token = await getAccessTokenSilently();

    await fetch(
      `https://prometeo-z6hv.onrender.com/usuarios/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      }
    );

    setEditandoId(null);
    obtenerUsuarios();
  };

  // =========================
  // 🔥 INVITAR USUARIO
  // =========================

  const invitarUsuario = async () => {
    try {
      const token = await getAccessTokenSilently();

      await fetch(
        'https://prometeo-z6hv.onrender.com/usuarios/invitar',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoUsuario),
        }
      );

      setNuevoUsuario({ email: '', nombre: '' });
      obtenerUsuarios();
    } catch (e) {
      console.error(e);
      alert('Error invitando usuario');
    }
  };

  // =========================

  useEffect(() => {
    if (isAuthenticated) {
      obtenerPerfil();
    }
  }, [isAuthenticated]);

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!isAuthenticated && (
        <div className="flex justify-center items-center h-screen">
          <button
            onClick={() => loginWithRedirect()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow"
          >
            Login
          </button>
        </div>
      )}

      {isAuthenticated && perfil && (
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-2xl font-bold">
              Bienvenido {perfil.nombre}
            </h2>
            <p className="text-gray-600">{perfil.email}</p>
            <p className="mt-2">
              Rol: <span className="font-semibold">{perfil.rol}</span>
            </p>
          </div>

          {/* ADMIN PANEL */}
          {perfil.rol === 'admin' && (
            <div className="bg-white p-6 rounded-xl shadow">
              {/* 🔥 INVITAR */}
              <div className="mb-6">
                <h4 className="font-bold mb-2">Invitar usuario</h4>

                <div className="flex gap-2">
                  <input
                    className="border p-2 rounded w-full"
                    placeholder="Email"
                    value={nuevoUsuario.email}
                    onChange={(e) =>
                      setNuevoUsuario({
                        ...nuevoUsuario,
                        email: e.target.value,
                      })
                    }
                  />

                  <input
                    className="border p-2 rounded w-full"
                    placeholder="Nombre"
                    value={nuevoUsuario.nombre}
                    onChange={(e) =>
                      setNuevoUsuario({
                        ...nuevoUsuario,
                        nombre: e.target.value,
                      })
                    }
                  />

                  <button
                    onClick={invitarUsuario}
                    className="bg-blue-600 text-white px-4 rounded"
                  >
                    Invitar
                  </button>
                </div>
              </div>

              {/* LISTAR */}
              <button
                onClick={obtenerUsuarios}
                className="bg-green-600 text-white px-4 py-2 rounded mb-4"
              >
                Cargar usuarios
              </button>

              <div className="grid gap-4">
                {usuarios.map((u) => (
                  <div
                    key={u.id}
                    className="border p-4 rounded-lg bg-gray-50"
                  >
                    {editandoId === u.id ? (
                      <>
                        <input
                          className="border p-2 w-full mb-2 rounded"
                          placeholder="Nombre"
                          value={form.nombre}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              nombre: e.target.value,
                            })
                          }
                        />

                        <input
                          className="border p-2 w-full mb-2 rounded"
                          placeholder="Institución"
                          value={form.institucionId}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              institucionId: e.target.value,
                            })
                          }
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() => actualizarUsuario(u.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Guardar
                          </button>

                          <button
                            onClick={() => setEditandoId(null)}
                            className="bg-gray-400 text-white px-3 py-1 rounded"
                          >
                            Cancelar
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="font-bold">{u.nombre}</h4>
                        <p className="text-sm text-gray-600">
                          {u.email}
                        </p>
                        <p className="text-sm">Rol: {u.rol}</p>

                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => {
                              setEditandoId(u.id);
                              setForm({
                                nombre: u.nombre || '',
                                institucionId:
                                  u.institucionId || '',
                              });
                            }}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() =>
                              eliminarUsuario(u.id)
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LOGOUT */}
          <div className="mt-6 text-center">
            <button
              onClick={() =>
                logout({
                  logoutParams: {
                    returnTo: window.location.origin,
                  },
                })
              }
              className="bg-black text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;