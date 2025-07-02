import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';


import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule,} from '@angular/common/http'; 





@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useFactory: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) throw new Error('CoreModule is already loaded.');
  }
}
