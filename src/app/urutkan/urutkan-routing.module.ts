import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UrutkanPage } from './urutkan.page';

const routes: Routes = [
  {
    path: '',
    component: UrutkanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UrutkanPageRoutingModule {}
