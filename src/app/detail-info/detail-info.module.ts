import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailInfoPageRoutingModule } from './detail-info-routing.module';

import { DetailInfoPage } from './detail-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailInfoPageRoutingModule
  ],
  declarations: [DetailInfoPage]
})
export class DetailInfoPageModule {}
