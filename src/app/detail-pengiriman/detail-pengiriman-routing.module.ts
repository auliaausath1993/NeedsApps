import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailPengirimanPage } from './detail-pengiriman.page';

const routes: Routes = [
  {
    path: '',
    component: DetailPengirimanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailPengirimanPageRoutingModule {}
