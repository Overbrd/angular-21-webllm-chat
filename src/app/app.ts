import { Component } from '@angular/core';
import { ChatComponent } from './chat.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatComponent, FormsModule],
  template: `<app-chat></app-chat>`
})
export class App {}
