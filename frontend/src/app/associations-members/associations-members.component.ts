import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-associations-members',
  templateUrl: './associations-members.component.html',
  styleUrls: ['./associations-members.component.css']
})
export class AssociationsMembersComponent implements OnInit {
validate() {
throw new Error('Method not implemented.');
}
  displayedColumns: string[] = ['id', 'name', 'firstname', 'age', 'role', 'action'];
  membersData = [];
  associationName!: string;
  associationId!: number;
  memberIds: number[] = [];

  isMemberDeleted: boolean = false;
  isRoleSelected: boolean = false;
  errorMessage: string | undefined;
  isModifyingMember: boolean = false;
  isAddingMember: boolean = false;
  role!:string;
  associationname!:string;
  idUsers!:number[]
  addMemberForm = new FormGroup({
    memberIdControl: new FormControl(),
    roleControl: new FormControl()
  });

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private appRouter: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.associationId = Number(params.get('id'));

    });
    const request: Observable<any> = this.http.get('http://localhost:3000/associations/'+this.associationId+'/members', { observe: 'response' });
    console.log(this.associationId);
lastValueFrom(request).then(response => this.membersData = response.body);
request.subscribe({ next : (response) => this.membersData = response.body });

this.addMemberForm.get('memberIdControl')?.valueChanges.subscribe(res => {
  this.idUsers = res.toString().split(',');
  for(let i=0;i<this.idUsers.length;i++){
    this.idUsers[i]=(Number)(this.idUsers[i])
  }
});
this.addMemberForm.get('roleControl')?.valueChanges.subscribe(res => {
  this.role = res.toString();
});


  }


  validateAdd(){
    this.addMemberForm.get('memberIdControl')?.valueChanges.subscribe(res => {
      this.idUsers = res.toString().split(',');
      for(let i=0;i<this.idUsers.length;i++){
        this.idUsers[i]=(Number)(this.idUsers[i])
      }
      console.log(this.idUsers)
    });
    if(this.isAddingMember){
      let data1 = {idUsers: this.idUsers}
      this.http.post('http://localhost:3000/associations/'+Number(this.associationId)+'/add-members', data1).subscribe(res =>{
        alert(res);
        this.ngOnInit();
      });
    }
  }


  modifyRole(memberIndex: number) {
    this.isModifyingMember = true;
    this.addMemberForm.get('roleControl')?.valueChanges.subscribe(res => {
      this.role = res.toString();
    });
    let data = {name: this.role};
    console.log(memberIndex)
    console.log(this.associationId)
    this.http.put('http://localhost:3000/roles/'+Number(memberIndex)+'/'+Number(this.associationId), data).subscribe(res =>{
      this.ngOnInit();
      });
  }


  addmember() : void {
    this.isAddingMember=true;
    this.isModifyingMember=false;
    this.isMemberDeleted=false;
  }

  mod():void{
    this.isAddingMember=false;
    this.isModifyingMember=true;
    this.isMemberDeleted=false;

  }


  /*deleteMember(memberIndex: number) {

    this.http.delete('http://localhost:3000/roles/' + memberIndex+ '/' + this.associationId)
      .subscribe(res => {});


    const updatedAssociationData = { name: this.associationName, idUsers: this.memberIds };
    this.http.put('http://localhost:3000/associations/' + this.associationId, updatedAssociationData)
      .subscribe(res => {
        console.log(res);
        this.ngOnInit();
      });
  }*/
}
