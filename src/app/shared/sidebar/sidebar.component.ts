import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

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

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  logout(){
    this.auth.logout()
    .then(() => {this.router.navigate(['/login'])})
  }

}
