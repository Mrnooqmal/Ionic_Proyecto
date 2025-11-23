import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Registro global de Ionicons para evitar múltiples addIcons y warnings de carga
import { addIcons } from 'ionicons';
import {
  alertCircle,
  document,
  business,
  peopleOutline,
  home,
  add,
  addCircle,
  personAdd,
  flask,
  settings,
  medical,
  refresh,
  arrowBack,
  person,
  people,
  arrowForward,
  statsChart,
  calendarOutline,
  heartOutline,
  search,
  informationCircle,
  personCircle,
  receipt,
  time,
  checkmarkCircle,
  searchOutline
} from 'ionicons/icons';

addIcons({
  alertCircle,
  document,
  business,
  peopleOutline,
  home,
  add,
  addCircle,
  personAdd,
  flask,
  settings,
  medical,
  refresh,
  arrowBack,
  person,
  people,
  arrowForward,
  statsChart,
  calendarOutline,
  heartOutline,
  search,
  informationCircle,
  personCircle,
  receipt,
  time,
  checkmarkCircle,
  searchOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    provideIonicAngular({
      innerHTMLTemplatesEnabled: true,
      mode: 'md'
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
