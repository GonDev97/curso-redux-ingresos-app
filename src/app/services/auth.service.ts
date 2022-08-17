import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { setUser, unSetUser } from '../auth/auth.actions';
import { unSetItems } from '../ingreso-egreso/ingreso-egreso.actions';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private firebaseUserSubscription: Subscription | undefined;
  private  user_: User | undefined;

  constructor(public auth:AngularFireAuth,
    public fireStore: AngularFirestore,
    private store: Store<AppState>) { }


  get user(){
    return {...this.user_}
  }

  initAuthLister(){
    this.auth.authState.subscribe(firebaseUser => {
      //console.log(firebaseUser?.getIdToken());
      if(firebaseUser){
        console.log(firebaseUser);
        this.firebaseUserSubscription = this.fireStore.doc(`${firebaseUser.uid}/usuario`).valueChanges()
        .subscribe((storeFirebaseUser) => {
          this.user_ = User.fromFirebase(storeFirebaseUser)
          this.store.dispatch(setUser({user: this.user_}))
          this.store.dispatch(unSetItems())
      })

        
        // this.store.dispatch(setUser({}))
      } else{
        this.user_ = undefined;
        this.firebaseUserSubscription?.unsubscribe();
        this.store.dispatch(unSetUser())
      }

    })
  }


  createUser(name: string, email: string, password:string){
    return this.auth.createUserWithEmailAndPassword(email,password)
          .then(({user}) => {
            if(user){
              const newUser = new User(user.uid, name, email)
              return this.fireStore.doc(`${user.uid}/usuario`)
              .set({
                ...newUser
              })
            }
            else{
              return null;
            }
          })
  }

  loginUser(email:string, password:string){
    return this.auth.signInWithEmailAndPassword(email,password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map(fbUser => fbUser!=null)
    )
  }

}
