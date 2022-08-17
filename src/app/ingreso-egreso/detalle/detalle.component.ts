import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  public ingresosEgresos: IngresoEgreso[] = [];

  public listSubscription: Subscription | undefined;

  constructor(private store:Store<AppStateWithIngreso>, private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.listSubscription = this.store.select('ingresosEgresos').subscribe(({items}) => {
      this.ingresosEgresos = [...items];
    })
  }

  ngOnDestroy(): void {
    this.listSubscription?.unsubscribe();
  }

  borrar(uid: string | undefined){
    if(uid){
      this.ingresoEgresoService.borrarIngresoEgreso(uid)
        .then( () => Swal.fire('Deleted', 'Item deleted', 'success'))
        .catch( (err) => Swal.fire('Deleted', err.message, 'error'))
    }
  }

}
