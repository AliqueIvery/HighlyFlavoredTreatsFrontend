import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}

  login() {
  const target = location.pathname + location.search + location.hash;

  // If you’re currently on the callback page with an error, don’t loop back to it
  const safeTarget = target.startsWith('/auth/callback') ? '/' : target;

  this.auth.loginWithRedirect({
    appState: { target: safeTarget },
    authorizationParams: {
      prompt: 'login', // 🔥 ensures user can retry after being denied
      redirect_uri: `${window.location.origin}/auth/callback`
    }
  });
}


  logout() {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
