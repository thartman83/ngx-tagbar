import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DogBreedsService {

  private url = 'https://dog.ceo/api/breeds/list';

  constructor(private httpClient: HttpClient) {}

  values: Observable<string[]> = undefined;

  getDogBreeds() {
    return this.httpClient.get(this.url,{responseType: 'json'}).pipe(
      map( (data) => data['message']));
  }
}
