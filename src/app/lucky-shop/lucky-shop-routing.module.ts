import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LuckyShopPage } from './lucky-shop.page';

const routes: Routes = [
  {
    path: '',
    component: LuckyShopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LuckyShopPageRoutingModule {}
