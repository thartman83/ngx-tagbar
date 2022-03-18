import { Component } from '@angular/core';

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
  codeBlock4 = `<ngx-tagbar tags="['foo','bar'] maxTags=3></ngx-tagbar>`;
}
