import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { setItems } from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  private userSubs: Subscription | undefined
  private ingresosSubs: Subscription | undefined

  constructor(private store:Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
    .pipe(
      filter(auth => auth.user != null && auth.user != undefined)
    )
      .subscribe(({user}) => {
        if(user){
          this.ingresosSubs = this.ingresoEgresoService.initIngresosEgresosListener(user.uid)
            .subscribe(ingresosEgresosFB => {
              this.store.dispatch(setItems({items: ingresosEgresosFB}))
            })
        }
      })
  }

  ngOnDestroy(): void {
    this.ingresosSubs?.unsubscribe();
    this.userSubs?.unsubscribe();
  }

}
