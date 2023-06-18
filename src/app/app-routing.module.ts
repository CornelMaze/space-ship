import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpaceShipComponent } from './pages/space-ship/space-ship.component';

const routes: Routes = [{ path: '', component: SpaceShipComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
