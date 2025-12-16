import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { ShopNowComponent } from './components/shop-now/shop-now.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { DeliveryAreaComponent } from './components/delivery-area/delivery-area.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatDividerModule } from '@angular/material/divider';
import { environment } from 'src/environments/environment';
import { AuthModule, AuthHttpInterceptor  } from '@auth0/auth0-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductsDashboardComponent } from './components/admin/products-dashboard/products-dashboard.component';
import { ProductAddComponent } from './components/admin/product-add/product-add.component';
import { ProductEditComponent } from './components/admin/product-edit/product-edit.component';
import { OrdersAdminComponent } from './components/admin/orders-admin/orders-admin.component';
import { OrderSuccessDialogComponent } from './components/order-success-dialog/order-success-dialog.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ShopNowComponent,
    DeliveryAreaComponent,
    ContactUsComponent,
    CheckoutComponent,
    NavbarComponent,
    ProductsDashboardComponent,
    ProductAddComponent,
    ProductEditComponent,
    OrdersAdminComponent,
    OrderSuccessDialogComponent,
    AuthCallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatBadgeModule,
    MatSelectModule,
    MatDividerModule,
    AuthModule.forRoot({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        audience: environment.auth0.audience,
        redirect_uri: `${window.location.origin}/auth/callback`
      },
      // 🔥 IMPORTANT: Store tokens in localStorage
      cacheLocation: 'localstorage',
      useRefreshTokens: true,               // Enables silent refresh
      useRefreshTokensFallback: true,        // Fallback for older browsers
      httpInterceptor: {
        allowedList: [
          // 🔒 Admin product actions (require token)
          {
            uri: `${environment.apiBase}/api/products`, // create
            httpMethod: 'POST',
            tokenOptions: {
              authorizationParams: {
                audience: environment.auth0.audience,
                scope: 'openid profile email'
              }
            }
          },
          {
            uri: `${environment.apiBase}/api/products/*`, // update
            httpMethod: 'PUT',
            tokenOptions: {
              authorizationParams: {
                audience: environment.auth0.audience,
                scope: 'openid profile email'
              }
            }
          },
          {
            uri: `${environment.apiBase}/api/products/*`, // delete
            httpMethod: 'DELETE',
            tokenOptions: {
              authorizationParams: {
                audience: environment.auth0.audience,
                scope: 'openid profile email'
              }
            }
          },

          // 🔒 Image uploads
          {
            uri: `${environment.apiBase}/api/uploads/*`,
            // all methods here will include token
            tokenOptions: {
              authorizationParams: {
                audience: environment.auth0.audience,
                scope: 'openid profile email'
              }
            }
          },

          // 🔒 (Example) orders, if you want them protected
          {
            uri: `${environment.apiBase}/api/orders*`,
            tokenOptions: {
              authorizationParams: {
                audience: environment.auth0.audience,
                scope: 'openid profile email'
              }
            }
          }
        ]
      }
    })
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
