import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ShopNowComponent } from './components/shop-now/shop-now.component';
import { DeliveryAreaComponent } from './components/delivery-area/delivery-area.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';

const routes: Routes = [
  {path:'home', component:HomePageComponent},
  { path: 'shop', component: ShopNowComponent },
  { path: 'delivery', component: DeliveryAreaComponent },
  { path: 'contact', component: ContactUsComponent },
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
