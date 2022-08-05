import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyVoucherPage } from './my-voucher.page';

const routes: Routes = [
  {
    path: '',
    component: MyVoucherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyVoucherPageRoutingModule {}
