import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  // Auth pages — only accessible when NOT logged in
  // (logged-in users are redirected to dashboard)
  {
    path: '',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },

  // All authenticated feature pages — only accessible when logged in
  // (logged-out users are redirected back to login)
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/features.module').then(m => m.FeaturesModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
