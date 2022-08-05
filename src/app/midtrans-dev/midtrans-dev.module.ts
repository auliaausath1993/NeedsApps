import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MidtransDevPageRoutingModule } from './midtrans-dev-routing.module';

import { MidtransDevPage } from './midtrans-dev.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MidtransDevPageRoutingModule
  ],
  declarations: [MidtransDevPage]
})
export class MidtransDevPageModule {}
