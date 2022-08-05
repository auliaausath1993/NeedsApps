import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KritikSaranPage } from './kritik-saran.page';

const routes: Routes = [
  {
    path: '',
    component: KritikSaranPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KritikSaranPageRoutingModule {}
