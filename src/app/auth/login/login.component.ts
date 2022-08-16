import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import { isLoading, stopLoading } from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginForm: FormGroup;
  public loading:Boolean = false;
  private uiSubscription: Subscription | undefined;

  constructor(private fb: FormBuilder,
    private authService: AuthService, 
    private router:Router, 
    private store:Store<AppState>) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      })
   }

  ngOnInit(): void {

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.loading = ui.isLoading
      console.log(this.loading);
    })

  }

  ngOnDestroy(): void {
    this.uiSubscription?.unsubscribe();
  }

  loginUser(){
    if(this.loginForm.invalid) { return ; }
    this.store.dispatch(isLoading());

    

    const {email, password} = this.loginForm.value;
    this.authService.loginUser(email,password)
    .then(credentials => {
      this.store.dispatch(stopLoading())
      this.router.navigate(['/'])
    })
    .catch(error => {
      this.store.dispatch(stopLoading())
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    })
  }

}
