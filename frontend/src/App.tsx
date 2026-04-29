import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

function App() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
    getAccessTokenSilently,
    isLoading,
  } = useAuth0();

  // 🔥 ESTADO DEL PERFIL (DB)
  const [perfil, setPerfil] = useState<any>(null);

  // 🔥 OBTENER PERFIL DESDE BACKEND
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

      const data = await res.json();
      console.log('PERFIL 👉', data);

      setPerfil(data);
    } catch (e) {
      console.error(e);
    }
  };

  // 🔥 LLAMAR ENDPOINT ADMIN
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

      const data = await res.json();
      alert(JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(e);
      alert('Error obteniendo usuarios');
    }
  };

  // 🔥 CUANDO SE LOGUEA → TRAER PERFIL
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
          {/* 🔥 DATOS REALES DEL BACKEND */}
          <h3>Bienvenido {perfil.nombre}</h3>
          <p>Email: {perfil.email}</p>
          <p>Rol: {perfil.rol}</p>

          {/* 🔥 SOLO ADMIN VE ESTO */}
          {perfil.rol === 'admin' && (
            <button onClick={obtenerUsuarios}>
              Ver usuarios (admin)
            </button>
          )}

          <br /><br />

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