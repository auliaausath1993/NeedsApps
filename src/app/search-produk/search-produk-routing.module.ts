import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchProdukPage } from './search-produk.page';

const routes: Routes = [
  {
    path: '',
    component: SearchProdukPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchProdukPageRoutingModule {}
