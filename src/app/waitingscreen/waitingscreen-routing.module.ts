import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingscreenPage } from './waitingscreen.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingscreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingscreenPageRoutingModule {}
