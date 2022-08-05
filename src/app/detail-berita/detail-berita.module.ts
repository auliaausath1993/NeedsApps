import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailBeritaPageRoutingModule } from './detail-berita-routing.module';

import { DetailBeritaPage } from './detail-berita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailBeritaPageRoutingModule
  ],
  declarations: [DetailBeritaPage]
})
export class DetailBeritaPageModule {}
