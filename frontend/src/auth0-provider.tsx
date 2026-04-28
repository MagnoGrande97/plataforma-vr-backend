import { Auth0Provider } from '@auth0/auth0-react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Auth0Provider
      domain="dev-xrdraegerperu.us.auth0.com"
      clientId="SvEa0m1uKHxqX6Kz7IIyTADBUKMNmNSQ"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://api.prometeo',
      }}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};