import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { RestaurantComponent } from './restaurant/restaurant/restaurant.component';
import { PipesModule } from '../pipes/pipes.module';
import { ReserveInfoComponent } from './reserve/reserve-info/reserve-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MercadoPagoComponent } from './mercado-pago/mercado-pago.component';



@NgModule({
  declarations: [
    HeaderComponent,
    RestaurantComponent,
    ReserveInfoComponent,
    MercadoPagoComponent
  ],
  exports: [
    HeaderComponent,
    RestaurantComponent,
    ReserveInfoComponent,
    MercadoPagoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
