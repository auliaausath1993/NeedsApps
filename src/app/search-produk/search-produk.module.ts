import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchProdukPageRoutingModule } from './search-produk-routing.module';

import { SearchProdukPage } from './search-produk.page';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchProdukPageRoutingModule,
    LazyLoadImageModule,
  ],
  declarations: [SearchProdukPage]
})
export class SearchProdukPageModule {}
