import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UrutkanPageRoutingModule } from './urutkan-routing.module';

import { UrutkanPage } from './urutkan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UrutkanPageRoutingModule
  ],
  declarations: [UrutkanPage]
})
export class UrutkanPageModule {}
