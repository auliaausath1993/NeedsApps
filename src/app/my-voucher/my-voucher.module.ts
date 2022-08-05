import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyVoucherPageRoutingModule } from './my-voucher-routing.module';

import { MyVoucherPage } from './my-voucher.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyVoucherPageRoutingModule
  ],
  declarations: [MyVoucherPage]
})
export class MyVoucherPageModule {}
