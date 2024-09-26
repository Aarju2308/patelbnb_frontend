import { Component, EventEmitter, input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputTextModule } from 'primeng/inputtext';
import { PriceVO } from '../../../model/listing-vo.model';

@Component({
  selector: 'app-price-step',
  standalone: true,
  imports: [FormsModule,InputTextModule,FontAwesomeModule],
  templateUrl: './price-step.component.html',
  styleUrl: './price-step.component.scss'
})
export class PriceStepComponent implements OnInit {

  price = input.required<PriceVO>();

  @Output()
  priceChange = new EventEmitter<PriceVO>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  @ViewChild("formPrice")
  formPrice : NgForm | undefined;

  ngOnInit(): void {
    setTimeout(() => {
      this.stepValidityChange.emit(this.validateForm());
    });
  }

  onPriceChange(newPrice : number){
    this.price().value = newPrice;
    this.priceChange.emit(this.price());
    this.stepValidityChange.emit(this.validateForm());

  }
  validateForm(): boolean {
   if (this.formPrice) {
    return this.formPrice?.valid!;
   }else{
    return false;
   }
  }

}
