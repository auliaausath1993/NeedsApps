import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MidtransDevPage } from './midtrans-dev.page';

const routes: Routes = [
  {
    path: '',
    component: MidtransDevPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MidtransDevPageRoutingModule {}
