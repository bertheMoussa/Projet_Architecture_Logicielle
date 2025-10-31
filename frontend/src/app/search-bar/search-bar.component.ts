// search-bar.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Association } from '../associations-list/Association';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { User } from '../users-list/User';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  addFormulaire:Boolean=true;
  addFormulaire1:Boolean=false;
  infos!:string;
  displayedColumns1: string[] = ['lastname','firstname','age'];
  displayedColumns2: string[] = ['id','name'];
  dataSource1:User[]=[] ;
  user!:User[];
  association!:Association[];
  dataSource2:Association[]=[] ;
  searchForm = new FormGroup({
    searchInfos: new FormControl()
  });
  constructor(
    private route:ActivatedRoute,
    private httpService: HttpClient
  ) { }
  ngOnInit(): void {

    this.httpService.get<any>('http://localhost:3000/associations' ).subscribe(res => {
      this.dataSource1 = res;
    });
    this.httpService.get<any>('http://localhost:3000/users' ).subscribe(res => {
      this.dataSource2 = res;
    });
    this.searchForm.get('searchInfos')?.valueChanges.subscribe(res => {
      this.infos = res.toString();
    });
  }

  searchUser():void{
    this.addFormulaire=true;
   for (let i = 1; i <= this.dataSource1.length; i++) {
    if(this.dataSource1[i].firstname===this.infos){
      this.user[i]=this.dataSource1[i];
    }
  }
  }
  searchAssociation():void{
    this.addFormulaire1=true;
    for (let i = 1; i <= this.dataSource2.length; i++) {
      if(this.dataSource2[i].name===this.infos){
        this.association[i]=this.dataSource2[i];
      }
    }
    }

}
