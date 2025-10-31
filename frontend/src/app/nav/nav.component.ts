import { Component } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent {
  [x: string]: any;
  isLogged !: boolean;
  constructor(
    private TokenStorageService: TokenStorageService,
    private router: Router,
    private http: HttpClient
    ) {}

    logout(): void {
      this.TokenStorageService.clear();
      this.router.navigate(['/login']);
    }

    performSearch(searchData: { type: string, query: string }) {
      console.log('Recherche avec le type :', searchData.type);
      console.log('Requête de recherche :', searchData.query);

      const searchUrl = `http://localhost:3000/${searchData.type}/${searchData.query}`;

      // Effectuez votre requête HTTP
      this.http.get(searchUrl).subscribe(
        (response) => {
          console.log('Résultat de la recherche :', response);
          // Faites quelque chose avec la réponse de la recherche
          alert(`La recherche a été effectuée avec succès.`);
        },
        (error) => {
          console.error('Erreur lors de la recherche :', error);
          // Gérez les erreurs de recherche
          alert('erreur');

        }
      );
    }
}
