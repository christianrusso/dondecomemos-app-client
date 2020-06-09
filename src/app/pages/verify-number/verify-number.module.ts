import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyNumberPageRoutingModule } from './verify-number-routing.module';

import { VerifyNumberPage } from './verify-number.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    VerifyNumberPageRoutingModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [VerifyNumberPage]
})
export class VerifyNumberPageModule {}
