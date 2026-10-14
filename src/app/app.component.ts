import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { ApiService } from './services/api';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, RouterLink, RouterLinkActive],
})
export class AppComponent {
  readonly api = inject(ApiService);
  private router = inject(Router);
  logout() {
    this.api.logout();
    this.router.navigateByUrl('/login');
  }
}
