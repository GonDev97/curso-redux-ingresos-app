import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { isLoading, stopLoading } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  public ingresoForm: FormGroup;
  public tipo:string = 'ingreso';
  public loading:Boolean = false;
  private uiSubscription: Subscription | undefined;


  constructor(private fb: FormBuilder,
              private ingresoEgresoService: IngresoEgresoService,
              private store: Store<AppState>
  ) {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', [Validators.required]],
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

  save(): void{

    if(this.ingresoForm.invalid) {return ;}

    this.store.dispatch(isLoading())


    setTimeout(() =>{

      const {descripcion, monto} = this.ingresoForm.value
  
      this.ingresoEgresoService.crearIngresoEgreso({descripcion, monto, tipo: this.tipo})
        .then((ref) => {
          Swal.fire('Registro creado', descripcion, 'success')
          this.ingresoForm.reset();
          this.store.dispatch(stopLoading());
        })
        .catch( (err) => {
          Swal.fire('Error', err.message, 'error');
          this.store.dispatch(stopLoading());

        })

    }, 2500)




  }

}
