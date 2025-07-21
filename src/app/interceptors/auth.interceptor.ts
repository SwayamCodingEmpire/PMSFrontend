import { HttpInterceptorFn } from '@angular/common/http';
const PUBLIC_URLS = [
  '/public/',
];
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (PUBLIC_URLS.some(url => req.url.includes(url))) {
    return next(req); // Let request go without token
  }
  const token = localStorage.getItem('token'); // or from a service

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
