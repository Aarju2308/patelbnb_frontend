import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './layout/footer/footer.component';
import { ToastService } from './layout/toast.service';
import { MessageService } from 'primeng/api';
import {ToastModule} from "primeng/toast";
import { NavbarComponent } from './layout/navbar/navbar.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonModule,
    FaIconComponent,
    NavbarComponent,
    FooterComponent,
    ToastModule,
    ConfirmDialogModule
  ],
  providers : [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'patelbnb-front';
  faIconLibrary = inject(FaIconLibrary);
  isListingView : boolean = true;
  toastService = inject(ToastService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.initFontAwesome();
    this.listenToastService();
  }

  initFontAwesome() {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

  private listenToastService() {
    this.toastService.sendSub.subscribe({
      next: newMessage => {
        if(newMessage && newMessage.summary !== this.toastService.INIT_STATE) {
          this.messageService.add(newMessage);
        }
      }
    })
  }

}
