import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DogBreedsService } from './dog-breeds.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tagbar-example';
  codeBlock1 = `<ngx-tagbar></ngx-tagbar>`;
  codeBlock2 = `<ngx-tagbar tag-color="#00F" ></ngx-tagbar>`;
  codeBlock3 = `<ngx-tagbar tags="['foo','bar','baz']"></ngx-tagbar>`;
  codeBlock4 = `<ngx-tagbar [tags]="['foo','bar']" [maxTags]="3"></ngx-tagbar>`;
  codeBlock5 = `<ngx-tagbar [source]="['foo','bar','baz']"></ngx-tagbar>`;
  codeBlock6 = `<ngx-tagbar [source]="sourceFn"></ngx-tagbar>
    sourceFn(needle: string): string[] { return ['bob','bib','bub']; }`;
  codeBlock7 = `<ngx-tagbar [source]="sourceObserver"></ngx-tagbar>
    sourceObserver = new Observable( (observer) => {
    setTimeout(() => observer.next(['bob','bod','beb']), 5000);
    });`;
  codeBlock8 = `<ngx-tagbar [source]="sourceObserver"></ngx-tagbar>
    sourceObserver = new Observable( (observer) => {
    setTimeout(() => observer.next(['bob','bod','beb']), 5000);
    });`;

  constructor(public dogBreeds: DogBreedsService) {

  }

  sourceFn(needle: string): string[] {
    return ['bob','bib','bub'];
  }

  sourceObserver = new Observable( (observer) => {
    setTimeout(() => observer.next(['bob','bod','beb']), 5000);
  });

}
