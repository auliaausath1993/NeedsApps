import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KonfirmasiPesananPage } from './konfirmasi-pesanan.page';

const routes: Routes = [
  {
    path: '',
    component: KonfirmasiPesananPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KonfirmasiPesananPageRoutingModule {}
