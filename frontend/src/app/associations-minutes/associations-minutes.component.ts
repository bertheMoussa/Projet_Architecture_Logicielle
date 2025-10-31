import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';


@Component({
  selector: 'app-associations-minutes',
  templateUrl: './associations-minutes.component.html',
  styleUrls: ['./associations-minutes.component.css']
})
export class AssociationsMinutesComponent {

  displayedColumns: string[] = ['content', 'date'];
  minutesList = [];
  assocId!: number;
  assocName!: string;
  error: string | undefined;

  // Flags
  isAddingNew: boolean = false;
  isModifyingExisting: boolean = false;

  // New Minutes
  newContent!: string;
  newDate!: string;

  newMinutesForm = new FormGroup({
    content: new FormControl(),
    date: new FormControl()
  });

  // Modify Minutes
  selectedMinutesId!: number;
  modifiedContent!: string;

  modifyMinutesForm = new FormGroup({
    modifiedContent: new FormControl(),
    date: new FormControl()
  });
  http: any;

  constructor(
    private httpService: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.isModifyingExisting = false;
    this.isAddingNew = false;

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('id');
      this.assocId = Number(id);
    });
    this.httpService.get<any>('http://localhost:3000/associations/' + this.assocId + '/minutes').subscribe(res => {
      this.minutesList = res;
      console.log(this.minutesList);
    });

    this.newMinutesForm.get('content')?.valueChanges.subscribe(res => {
      this.newContent = res.toString();
    });

    this.newMinutesForm.get('date')?.valueChanges.subscribe(res => {
      this.newDate = res.toString();
    });

    this.modifyMinutesForm.get('modifiedContent')?.valueChanges.subscribe(res => {
      this.modifiedContent = res.toString();
    });


  }

  initiateAddition() {
    this.isAddingNew = true;
  }

  saveNewMinutesData() {
    const postData = { content: this.newContent, date: this.newDate, idAssociation: this.assocId };
    this.httpService.post('http://localhost:3000/minutes/', postData).subscribe(
      res => {
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        this.error = "Failed to add new minutes.";
      }
    );
  }

  initiateModification(id: number) {
    this.isModifyingExisting = true;
    this.selectedMinutesId = id;
  }

  updateMinutesData(id:string) {
    this.isAddingNew = true;
  this.newMinutesForm.get('content')?.valueChanges.subscribe(res => {
    this.newContent = res.toString();
  });
  this.newMinutesForm.get('date')?.valueChanges.subscribe(res => {
    this.newDate = res.toString();
  });

  const postData = { content: this.newContent, date: this.newDate, idAssociation: this.assocId };
    this.http.put('http://localhost:3000/minutes/'+(id), postData).subscribe(() =>{
      alert("la minute de id:"+id+"a été modifiée");
      this.ngOnInit();
    });
  }

  deleteMinutesData(id: number) {
    this.httpService.delete(`http://localhost:3000/minutes/${id}`).subscribe(
      (      response: any) => {
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        this.error = "Failed to delete minutes.";
      }
    );
    this.router.navigateByUrl(`/associations/${this.assocId}/minutes`).catch((error: HttpErrorResponse) => {
      this.error = "Failed to navigate to minutes page.";
    });
    alert(`Minutes with ID: ${id} has been deleted.`);
    window.location.reload();
  }
}
