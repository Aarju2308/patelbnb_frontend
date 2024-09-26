import { Injectable } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  INIT_STATE = "INIT";

  private send$ = new BehaviorSubject<Message>({summary: this.INIT_STATE});
  sendSub = this.send$.asObservable();

  constructor(private confirmationService: ConfirmationService) {}

  public send(message: Message): void {
    this.send$.next(message);
  }

  public sendConfirm(message:string,onConfirm: () => void, onReject: () => void): void {
    this.confirmationService.confirm({
      message: message, 
            header: 'PatelBNB', 
            accept: onConfirm, 
            reject: onReject, 
    });
  }

}
