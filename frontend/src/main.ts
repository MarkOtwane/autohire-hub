import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Import these
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes'; // Your routes
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor'; // Import your interceptor

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideRouter(routes), // Provide router
    provideHttpClient(
      // Provide HttpClient with interceptors
      withInterceptors([AuthInterceptor]) 
    ),
  ],
}).catch((err) => console.error(err));
