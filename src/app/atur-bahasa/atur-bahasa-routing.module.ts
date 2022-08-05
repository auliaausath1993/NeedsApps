import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AturBahasaPage } from './atur-bahasa.page';

const routes: Routes = [
  {
    path: '',
    component: AturBahasaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AturBahasaPageRoutingModule {}
