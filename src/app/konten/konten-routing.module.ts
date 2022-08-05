import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KontenPage } from './konten.page';

const routes: Routes = [
  {
    path: '',
    component: KontenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KontenPageRoutingModule {}
