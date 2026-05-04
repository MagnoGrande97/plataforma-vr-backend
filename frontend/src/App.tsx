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
  });

  const [nuevoUsuario, setNuevoUsuario] = useState({
    email: '',
    nombre: '',
  });

  // =========================
  // 🔹 PERFIL
  // =========================

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
      console.log('PERFIL 👉', data);

      setPerfil(data);
    } catch (e) {
      console.error(e);
    }
  };

  // =========================
  // 🔹 USUARIOS
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
  // 🔥 INVITAR
  // =========================

  const invitarUsuario = async () => {
    try {
      const token = await getAccessTokenSilently();

      const res = await fetch(
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

      const data = await res.json();

      if (!res.ok) {
        console.error('❌ ERROR BACKEND:', data);
        alert(data.message || 'Error invitando usuario');
        return;
      }

      console.log('✅ INVITADO:', data);

      alert(data.mensaje);

      setNuevoUsuario({ email: '', nombre: '' });
      obtenerUsuarios();

    } catch (e) {
      console.error('🔥 ERROR FRONT:', e);
      alert('Error de red');
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
    <div style={{ padding: 20 }}>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()}>
          Login
        </button>
      )}

      {isAuthenticated && perfil && (
        <>
          {/* 🔥 PERFIL */}
          <h2>Bienvenido {perfil.nombre}</h2>
          <p>Email: {perfil.email}</p>
          <p>Rol: {perfil.rol}</p>

          <hr />

          {/* 🔥 ADMIN PANEL */}
          {perfil.rol === 'admin' && (
            <>
              <h3>Panel Admin</h3>

              {/* INVITAR */}
              <input
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
                placeholder="Nombre"
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

              <br /><br />

              <button onClick={obtenerUsuarios}>
                Cargar usuarios
              </button>

              {/* LISTA */}
              {usuarios.map((u) => (
                <div key={u.id}>
                  {editandoId === u.id ? (
                    <>
                      <input
                        value={form.nombre}
                        onChange={(e) =>
                          setForm({
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
                      <p>Rol: {u.rol}</p>

                      <button
                        onClick={() => {
                          setEditandoId(u.id);
                          setForm({
                            nombre: u.nombre || '',
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

          <button onClick={() => logout()}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default App;