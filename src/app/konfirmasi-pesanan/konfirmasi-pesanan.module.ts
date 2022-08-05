import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KonfirmasiPesananPageRoutingModule } from './konfirmasi-pesanan-routing.module';

import { KonfirmasiPesananPage } from './konfirmasi-pesanan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KonfirmasiPesananPageRoutingModule
  ],
  declarations: [KonfirmasiPesananPage]
})
export class KonfirmasiPesananPageModule {}
