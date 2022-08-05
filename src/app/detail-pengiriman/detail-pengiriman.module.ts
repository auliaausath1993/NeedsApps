import { PilihAlamatPage } from './../pilih-alamat/pilih-alamat.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPengirimanPageRoutingModule } from './detail-pengiriman-routing.module';

import { DetailPengirimanPage } from './detail-pengiriman.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPengirimanPageRoutingModule
  ],
  declarations: [DetailPengirimanPage]
})
export class DetailPengirimanPageModule {}
