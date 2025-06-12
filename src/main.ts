import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

// Importa addIcons y los íconos que necesitas
import { addIcons } from 'ionicons';
import { bookSharp, calendarNumberSharp, listSharp } from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Registra los íconos que vas a usar en toda la app
addIcons({
  'book-sharp': bookSharp,
  'calendar-number-sharp': calendarNumberSharp,
  'list-sharp': listSharp,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
