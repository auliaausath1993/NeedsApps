import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KritikSaranPageRoutingModule } from './kritik-saran-routing.module';

import { KritikSaranPage } from './kritik-saran.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KritikSaranPageRoutingModule
  ],
  declarations: [KritikSaranPage]
})
export class KritikSaranPageModule {}
