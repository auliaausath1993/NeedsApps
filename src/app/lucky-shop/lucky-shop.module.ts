import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LuckyShopPageRoutingModule } from './lucky-shop-routing.module';

import { LuckyShopPage } from './lucky-shop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LuckyShopPageRoutingModule
  ],
  declarations: [LuckyShopPage]
})
export class LuckyShopPageModule {}
