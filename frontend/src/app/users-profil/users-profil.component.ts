import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-users-profil',
  templateUrl: './users-profil.component.html',
  styleUrls: ['./users-profil.component.css']
})
export class UsersProfilComponent {
  // Informations

  id !: number;
  firstname !: string;
  lastname !: string;
  age !: string;
  password!:string

  // Boolean Part
  modificationsOn : boolean = false;

  profileForm = new FormGroup({
    firstname: new FormControl(),
    lastname: new FormControl(),
    age: new FormControl(),
    password: new FormControl()
  });

  constructor(
    private route:ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('id');
      id="1";
      if (id !== null) {
        this.id = Number(id);

        this.getUserById(id);
      }
    });
    this.profileForm.get('firstname')?.valueChanges.subscribe(res => {
      this.firstname = res.toString();
    })
    this.profileForm.get('lastname')?.valueChanges.subscribe(res => {
      this.lastname = res.toString();
    })
    this.profileForm.get('age')?.valueChanges.subscribe(res => {
      this.age = res.toString();
    })
    this.profileForm.get('password')?.valueChanges.subscribe(res => {
      this.password = res.toString();
    })
  }
//Fonctions de get et de put
  private getRequest(link : string){
    return this.http.get<any>(link);
  }

  private putRequest(link : string, data : {}){
    return this.http.put<any>(link, data);
  }

  getUserById(id: string) {
    this.getRequest("http://localhost:3000/users/" + id).subscribe(res => {
      let firstname = res['firstname'];
      this.firstname = firstname;
      let lastname = res['lastname'];
      this.lastname = lastname;
      let age = res['age'];
      this.age = age;
    });
  }

  applyModifications(){
    let datanewD ={firstname : this.firstname, lastname : this.lastname, age: this.age, password: this.password};
    this.putRequest("http://localhost:3000/users/"+this.id,datanewD).subscribe( res => {
      console.log("rendu")
      console.log(res);
    });
  }

  modify(){
    this.modificationsOn = true;
  }

  submit(){
    this.modificationsOn = false;
    this.applyModifications();
  }

}
