import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailScanPageRoutingModule } from './detail-scan-routing.module';

import { DetailScanPage } from './detail-scan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailScanPageRoutingModule
  ],
  declarations: [DetailScanPage]
})
export class DetailScanPageModule {}
