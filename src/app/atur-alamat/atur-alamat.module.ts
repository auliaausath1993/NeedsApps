import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AturAlamatPageRoutingModule } from './atur-alamat-routing.module';

import { AturAlamatPage } from './atur-alamat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AturAlamatPageRoutingModule
  ],
  declarations: [AturAlamatPage]
})
export class AturAlamatPageModule {}
