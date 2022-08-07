import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth:AngularFireAuth, public fireStore: AngularFirestore) { }

  initAuthLister(){
    this.auth.authState.subscribe(firebaseUser => {
      console.log(firebaseUser);
      console.log(firebaseUser?.getIdToken());
      console.log(firebaseUser?.email);
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
