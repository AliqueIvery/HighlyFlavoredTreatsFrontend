import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ShopNowComponent } from './components/shop-now/shop-now.component';
import { DeliveryAreaComponent } from './components/delivery-area/delivery-area.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductsDashboardComponent } from './components/admin/products-dashboard/products-dashboard.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { ProductAddComponent } from './components/admin/product-add/product-add.component';
import { ProductEditComponent } from './components/admin/product-edit/product-edit.component';

const routes: Routes = [
  {path:'home', component:HomePageComponent},
  { path: 'shop', component: ShopNowComponent },
  { path: 'delivery', component: DeliveryAreaComponent },
  {path: 'admin/products',component: ProductsDashboardComponent,canActivate: [AuthGuard]},
  {path: 'admin/products/add',component: ProductAddComponent,canActivate: [AuthGuard]},
  {path: 'admin/products/:id/edit',component: ProductEditComponent,canActivate: [AuthGuard]},
  { path: 'contact', component: ContactUsComponent },
  { path: 'checkout', component: CheckoutComponent },
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
