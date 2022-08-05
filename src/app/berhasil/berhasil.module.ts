import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BerhasilPageRoutingModule } from './berhasil-routing.module';

import { BerhasilPage } from './berhasil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BerhasilPageRoutingModule
  ],
  declarations: [BerhasilPage]
})
export class BerhasilPageModule {}
