import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AturBahasaPageRoutingModule } from './atur-bahasa-routing.module';

import { AturBahasaPage } from './atur-bahasa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AturBahasaPageRoutingModule
  ],
  declarations: [AturBahasaPage]
})
export class AturBahasaPageModule {}
