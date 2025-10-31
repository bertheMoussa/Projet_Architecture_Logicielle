import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Association } from './Association';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-associations-list',
  templateUrl: './associations-list.component.html',
  styleUrls: ['./associations-list.component.css']
})
export class AssociationsListComponent {
  displayedColumns: string[] = ['id','name','members'];
  dataSource:Association[]=[] ;
  addFormulaire: boolean = false;
  updateFormulaire : boolean = false;
  minutes : boolean = false;
  supprFormulaire: boolean = false;
  users !: String[]
  errorMessage: string | undefined;
  constructor(
    private http: HttpClient,
    private router: Router,
) {}

//paramètres d'entrée pour la création d'une associations
  name!:string
  idUsers!:number[]

  ajoutAssociation = new FormGroup({
    idControl: new FormControl(),
    nameControl: new FormControl(),
  })
ngOnInit(): void {

const request: Observable<any> = this.http.get('http://localhost:3000/associations', { observe: 'response' });
lastValueFrom(request).then(response => this.dataSource = response.body);
request.subscribe({ next : (response) => this.dataSource = response.body });

this.ajoutAssociation.get('idControl')?.valueChanges.subscribe(res => {
  this.idUsers = res.toString().split(',');
  for(let i=0;i<this.idUsers.length;i++){
    this.idUsers[i]=(Number)(this.idUsers[i])
  }
  console.log(this.idUsers)
});
this.ajoutAssociation.get('nameControl')?.valueChanges.subscribe(res => {
  this.name = res.toString();
});
}

add() : void {
  this.addFormulaire=true;
  this.supprFormulaire=false;
}
Members(id:string){
  this.router.navigate(['associations/'+id+'/members']);
}

Minutes(id:string){
  this.router.navigate(['associations/'+id+'/minutes']);
}
validate(){
  if(this.addFormulaire){
    let data = {name: this.name, idUsers:this.idUsers}
    this.http.post('http://localhost:3000/associations/', data).subscribe(res =>{
      this.ngOnInit();
    });
  }
}
delete(id:number):void{
  this.addFormulaire=false;
  this.supprFormulaire=true;
  if(this.http.delete('http://localhost:3000/associations/'+id)){
    this.http.delete('http://localhost:3000/associations/'+id).subscribe(
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
