import { Component, OnInit } from '@angular/core';
import { User } from './User';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})


export class UsersListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'lastname', 'firstname','email', 'age','members'];
  dataSource = [];
  addFormulaire: boolean = false;
  updateFormulaire : boolean = false;
  minutes : boolean = false;
  associationId: number=1;
  supprFormulaire: boolean = false;
  users !: String[]
  errorMessage: string | undefined;
  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
) {}
//paramètres d'entrée pour la création d'une utilisateur
  firstname!:string;
  lastname!:string;
  age!:number;
  password!:string;
  email!:string;
  idUsers!:number[]
ajoutUtilisateur = new FormGroup({
  firstnameControl: new FormControl(),
  lastnameControl: new FormControl(),
  emailControl: new FormControl(),
  ageControl: new FormControl(),
  passwordControl: new FormControl(),
})
ngOnInit(): void {
const request: Observable<any> = this.http.get('http://localhost:3000/users', { observe: 'response' });
lastValueFrom(request).then(response => this.dataSource = response.body);
request.subscribe({ next : (response) => this.dataSource = response.body });
this.ajoutUtilisateur.get('firstnameControl')?.valueChanges.subscribe(res => {
  this.firstname = res.toString();
});
this.ajoutUtilisateur.get('lastnameControl')?.valueChanges.subscribe(res => {
  this.lastname = res.toString();
});
this.ajoutUtilisateur.get('emailControl')?.valueChanges.subscribe(res => {
  this.email = res.toString();
});
this.ajoutUtilisateur.get('ageControl')?.valueChanges.subscribe(res => {
  this.age = res.toString();
});
this.ajoutUtilisateur.get('passwordControl')?.valueChanges.subscribe(res => {
  this.password = res.toString();
});
}
add() : void {
  this.addFormulaire=true;
  this.supprFormulaire=false;
}
MyAssociations(id:string){
  this.router.navigate(['associations/'+id+'/members']);
}

Update(id:string){
  this.addFormulaire=true;
  this.supprFormulaire=false;
  this.ajoutUtilisateur.get('firstnameControl')?.valueChanges.subscribe(res => {
    this.firstname = res.toString();
  });
  this.ajoutUtilisateur.get('lastnameControl')?.valueChanges.subscribe(res => {
    this.lastname = res.toString();
  });
  this.ajoutUtilisateur.get('emailControl')?.valueChanges.subscribe(res => {
    this.email = res.toString();
  });
  this.ajoutUtilisateur.get('ageControl')?.valueChanges.subscribe(res => {
    this.age = res.toString();
  });
  this.ajoutUtilisateur.get('passwordControl')?.valueChanges.subscribe(res => {
    this.password = res.toString();
  });
  let data = {firstname: this.firstname,lastname: this.lastname,email:this.email, age: this.age, password:this.password, idUsers:this.idUsers}
    this.http.put('http://localhost:3000/users/'+(id), data).subscribe(res =>{
      alert("l'utilisateurs de id:"+id+"a été modifié");
      this.ngOnInit();
    });
}
validate(){
  if(this.addFormulaire){
    let data = {firstname: this.firstname,lastname: this.lastname,email:this.email, age: this.age, password:this.password, idUsers:this.idUsers}
    this.http.post('http://localhost:3000/users/', data).subscribe(res =>{
      this.ngOnInit();
    });
  }
}
delete(id:number):void{
  this.addFormulaire=false;
  this.supprFormulaire=true;
  if(this.http.delete('http://localhost:3000/users/'+id)){
    this.http.delete('http://localhost:3000/users/'+id).subscribe(
      response => {
        alert("l'association de Id: "+id+" a été suprimée!")});
     this.router.navigate(['/associations'])
     .catch((error:HttpErrorResponse) => {
       this.errorMessage="error";
     })
     window.location.reload()
   }
}

}
