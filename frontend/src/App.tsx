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

  // 🔥 NUEVO (EDICIÓN)
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: '',
    institucionId: '',
  });

  // 🔹 PERFIL
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

  // 🔹 LISTAR USUARIOS
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

  // 🔹 ELIMINAR
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

  // 🔥 ACTUALIZAR USUARIO
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

  useEffect(() => {
    if (isAuthenticated) {
      obtenerPerfil();
    }
  }, [isAuthenticated]);

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 20 }}>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()}>
          Login
        </button>
      )}

      {isAuthenticated && perfil && (
        <>
          <h3>Bienvenido {perfil.nombre}</h3>
          <p>Email: {perfil.email}</p>
          <p>Rol: {perfil.rol}</p>

          <br />

          {/* 🔥 ADMIN PANEL */}
          {perfil.rol === 'admin' && (
            <>
              <button onClick={obtenerUsuarios}>
                Cargar usuarios
              </button>

              <h4>Usuarios:</h4>

              {usuarios.map((u) => (
                <div
                  key={u.id}
                  style={{
                    border: '1px solid gray',
                    padding: 10,
                    marginBottom: 5,
                  }}
                >
                  {editandoId === u.id ? (
                    <>
                      <input
                        placeholder="Nombre"
                        value={form.nombre}
                        onChange={(e) =>
                          setForm({ ...form, nombre: e.target.value })
                        }
                      />

                      <input
                        placeholder="Institución"
                        value={form.institucionId}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            institucionId: e.target.value,
                          })
                        }
                      />

                      <br />

                      <button onClick={() => actualizarUsuario(u.id)}>
                        Guardar
                      </button>

                      <button onClick={() => setEditandoId(null)}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <p><b>{u.nombre}</b></p>
                      <p>{u.email}</p>
                      <p>Rol: {u.rol}</p>

                      <button
                        onClick={() => {
                          setEditandoId(u.id);
                          setForm({
                            nombre: u.nombre || '',
                            institucionId: u.institucionId || '',
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

          <br />

          <button
            onClick={() =>
              logout({
                logoutParams: { returnTo: window.location.origin },
              })
            }
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default App;