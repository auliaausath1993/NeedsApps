import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KontenPageRoutingModule } from './konten-routing.module';

import { KontenPage } from './konten.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KontenPageRoutingModule
  ],
  declarations: [KontenPage]
})
export class KontenPageModule {}
