import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListProdukPage } from './list-produk.page';

const routes: Routes = [
  {
    path: '',
    component: ListProdukPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListProdukPageRoutingModule {}
