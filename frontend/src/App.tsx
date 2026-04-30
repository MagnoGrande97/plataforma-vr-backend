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

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: '',
    institucionId: '',
  });

  const [nuevoUsuario, setNuevoUsuario] = useState({
    email: '',
    nombre: '',
  });

  // 🔥 PERFIL SEGURO
  const obtenerPerfil = async () => {
    try {
      const token = await getAccessTokenSilently();

      const res = await fetch(
        'https://prometeo-z6hv.onrender.com/usuarios/perfil',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Error perfil');

      const data = await res.json();
      setPerfil(data);
    } catch (e) {
      console.error('ERROR PERFIL', e);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const token = await getAccessTokenSilently();

      const res = await fetch(
        'https://prometeo-z6hv.onrender.com/usuarios/todos',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Error usuarios');

      const data = await res.json();
      setUsuarios(data);
    } catch (e) {
      console.error(e);
    }
  };

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
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      obtenerPerfil();
    }
  }, [isAuthenticated]);

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()}>
          Login
        </button>
      )}

      {isAuthenticated && perfil && (
        <div>
          <h3>{perfil.nombre}</h3>
          <p>{perfil.email}</p>

          {perfil.rol === 'admin' && (
            <>
              <h4>Invitar</h4>

              <input
                placeholder="email"
                value={nuevoUsuario.email}
                onChange={(e) =>
                  setNuevoUsuario({
                    ...nuevoUsuario,
                    email: e.target.value,
                  })
                }
              />

              <input
                placeholder="nombre"
                value={nuevoUsuario.nombre}
                onChange={(e) =>
                  setNuevoUsuario({
                    ...nuevoUsuario,
                    nombre: e.target.value,
                  })
                }
              />

              <button onClick={invitarUsuario}>
                Invitar
              </button>

              <button onClick={obtenerUsuarios}>
                Cargar usuarios
              </button>

              {usuarios.map((u) => (
                <div key={u.id}>
                  {editandoId === u.id ? (
                    <>
                      <input
                        value={form.nombre}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            nombre: e.target.value,
                          })
                        }
                      />

                      <button onClick={() => actualizarUsuario(u.id)}>
                        Guardar
                      </button>
                    </>
                  ) : (
                    <>
                      <p>{u.nombre}</p>
                      <p>{u.email}</p>

                      <button
                        onClick={() => {
                          setEditandoId(u.id);
                          setForm({
                            nombre: u.nombre || '',
                            institucionId:
                              u.institucionId || '',
                          });
                        }}
                      >
                        Editar
                      </button>

                      <button onClick={() => eliminarUsuario(u.id)}>
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              ))}
            </>
          )}

          <button onClick={() => logout()}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;