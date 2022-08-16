

export class User{

    static fromFirebase(firebaseUser: any){

        return new User(firebaseUser.uid, firebaseUser.nombre, firebaseUser.email)
    }


    constructor(
        public uid: string,
        public nombre: string,
        public email: string,
    ){

    }
}