import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
    getAccessTokenSilently,
    isLoading,
  } = useAuth0();

  const llamarBackend = async () => {
    try {
      const token = await getAccessTokenSilently();

      const res = await fetch(
        'https://prometeo-z6hv.onrender.com/usuarios',
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
      alert('Error llamando backend');
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 20 }}>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()}>
          Login
        </button>
      )}

      {isAuthenticated && (
        <>
          <h3>Bienvenido {user?.name}</h3>

          <button onClick={llamarBackend}>
            Llamar Backend
          </button>

          <button onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default App;