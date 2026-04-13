import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async ({ cookies, url, redirect }, next) => {
  const pathname = url.pathname;
  
  // Normalizar la ruta para comparar (quitar barra final si existe)
  const normalizedPath = pathname.endsWith('/') && pathname !== '/' 
    ? pathname.slice(0, -1) 
    : pathname;

  const isAdminPath = normalizedPath.startsWith('/admin');
  const isLoginPage = normalizedPath === '/admin/login';

  // Si estamos en una ruta de admin y NO es el login
  if (isAdminPath && !isLoginPage) {
    const accessToken = cookies.get('access_token');

    // Si no hay token, al login de una
    if (!accessToken || !accessToken.value) {
      console.log(`[Middleware] No access_token found for ${pathname}, redirecting to /admin/login`);
      return redirect('/admin/login');
    }
    
    console.log(`[Middleware] Access granted for ${pathname}`);
  }

  return next();
});
