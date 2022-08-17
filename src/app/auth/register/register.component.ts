import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import { isLoading, stopLoading } from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
  public loading:Boolean = false;
  private uiSubscription: Subscription | undefined;

  constructor(private fb: FormBuilder, 
    private authService: AuthService, 
    private store: Store<AppState>,
    private router:Router) {
      this.registerForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      })
   }

   ngOnInit(): void {

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.loading = ui.isLoading
    })

  }

  ngOnDestroy(): void {
    this.uiSubscription?.unsubscribe();
  }


  crearUsuario() {

    if(this.registerForm.invalid) { return ; }
    this.store.dispatch(isLoading());
    const {name, email, password} = this.registerForm.value;
    this.authService.createUser(name,email,password)
    .then(credentials => {
      this.store.dispatch(stopLoading());
      this.router.navigate(['/']);
    })
    .catch(error => {
      this.store.dispatch(stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        })
    })
  }

}
