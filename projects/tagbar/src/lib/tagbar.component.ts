import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-tagbar',
  templateUrl: 'tagbar.component.html',
  styleUrls: ['./tagbar.component.scss' ]
})
export class TagbarComponent implements OnInit {

  tags: string[];
  needle: string;
  
  ngOnInit(): void {
    this.tags = [];
  }

  addTag(newTag: string) {
    this.tags.push(newTag);
    this.needle = '';
  }

}
