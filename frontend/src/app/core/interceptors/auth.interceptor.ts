import { HttpInterceptorFn } from '@angular/common/http'; // Import HttpInterceptorFn
import { inject } from '@angular/core'; // Import inject
import { TokenService } from '../services/token.service'; // Adjust path if necessary

// Define your interceptor as a function
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService); // Use inject to get the service instance
  const token = tokenService.getToken();

  if (token) {
    // Clone the request and add the Authorization header
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Pass the cloned request to the next handler
  return next(req);
};
