import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {

  public userSubscription: Subscription | undefined;
  public currentUser: User | undefined;

  constructor(private auth: AuthService, private router:Router, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select('user')
    .subscribe((user) => {
      if(user.user){
        this.currentUser = user.user;
      }
    })
  }

}
