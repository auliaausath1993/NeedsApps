import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestProdukPageRoutingModule } from './request-produk-routing.module';

import { RequestProdukPage } from './request-produk.page';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FileUploadModule,
    RequestProdukPageRoutingModule
  ],
  declarations: [RequestProdukPage]
})
export class RequestProdukPageModule {}
