import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailScanPage } from './detail-scan.page';

const routes: Routes = [
  {
    path: '',
    component: DetailScanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailScanPageRoutingModule {}
