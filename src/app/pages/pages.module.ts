import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';

// Módulos importados
import { SharedModule } from '../shared/shared.module';
import { PAGES_ROUTES } from './pages.routes';


@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    Graficas1Component,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PAGES_ROUTES
  ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    Graficas1Component,
  ]
})
export class PagesModule { }
