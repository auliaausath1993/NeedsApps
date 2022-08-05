import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingscreenPageRoutingModule } from './waitingscreen-routing.module';

import { WaitingscreenPage } from './waitingscreen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingscreenPageRoutingModule
  ],
  declarations: [WaitingscreenPage]
})
export class WaitingscreenPageModule {}
