import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {
  error: string | null = null;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // If Auth0 rejects, the SDK exposes it here
    this.auth.error$.subscribe(err => {
      if (!err) return;

      // show message + reset the app state so login can be attempted again
      this.error = err.message || 'Login was denied.';
      this.auth.logout({
        logoutParams: { returnTo: window.location.origin }
      });
    });

    // If success, send them where you want
    this.auth.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) this.router.navigate(['/']);
    });
  }

  retry(): void {
    // Start a fresh login attempt
    window.location.href = window.location.origin; // ensures no callback state remains
  }
}

