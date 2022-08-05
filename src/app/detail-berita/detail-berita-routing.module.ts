import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailBeritaPage } from './detail-berita.page';

const routes: Routes = [
  {
    path: '',
    component: DetailBeritaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailBeritaPageRoutingModule {}
