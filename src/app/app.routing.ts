import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './components/setup/setup.component';
import {InterceptComponent} from './containers/intercept'

const routes: Routes = [
  {
    path: '',
    component: InterceptComponent,
  },
  {
    path: 'setup',
    component: SetupComponent,
  },
  {
    path: 'setup',
    component: SetupComponent,
  },
  {
    path: '**',
    redirectTo : ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRouting {}
