import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailInfoPage } from './detail-info.page';

const routes: Routes = [
  {
    path: '',
    component: DetailInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailInfoPageRoutingModule {}
