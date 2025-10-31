import { Component } from '@angular/core';
import { ApiHelperService } from '../services/api-helper.service';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private api: ApiHelperService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    if(this.tokenStorageService.isLogged()){
      this.router.navigateByUrl("/home");
    }
  }
  // ...

login(): void {
  const username: string = (document.getElementById('username') as HTMLInputElement).value;
  const password: string = (document.getElementById('password') as HTMLInputElement).value;
  this.api.post({ endpoint: '/auth/login', data: { username, password }})
    .subscribe(response => {
      const accessToken = response.access_token;
      if (accessToken) {
        const userId = (Number)(username);
        this.tokenStorageService.save(accessToken, username);
        this.tokenStorageService.setIdUser(userId);

        if (this.tokenStorageService.isLogged()) {
          window.location.reload();
          this.router.navigate(['/home']);
        }
      }
    }, error => {
      alert("Le username ou le password est incorrecte!!");
    });
}

// ...


}
