import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { InfoStepControlComponent } from './info-step-control/info-step-control.component';
import { NewListingInfo } from '../../../model/listing.model';

export type Control = "GUESTS" | "BEDROOMS" | "BEDS" | "BATHS"

@Component({
  selector: 'app-info-step',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    FontAwesomeModule,
    InfoStepControlComponent
  ],
  templateUrl: './info-step.component.html',
  styleUrl: './info-step.component.scss'
})
export class InfoStepComponent implements OnInit{

  infos = input.required<NewListingInfo>();

  @Output()
  infoChange = new EventEmitter<NewListingInfo>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

    
  ngOnInit(): void {
    this.stepValidityChange.emit(this.validationRules())
  }


  onInfoChange(newValue : number , valueType : Control){
    switch(valueType){
      case "BATHS":
        this.infos().baths = {value : newValue}
        break;
      case 'BEDROOMS':
        this.infos().bedrooms = {value : newValue}
        break;
      case 'GUESTS':
        this.infos().guests = {value : newValue}
        break;
      case 'BEDS':
        this.infos().beds = {value : newValue}
        break;
    }

    this.infoChange.emit(this.infos());
    this.stepValidityChange.emit(this.validationRules());
  }

  validationRules(): boolean {
    return (this.infos().guests.value >= 1 && this.infos().beds.value >= 1 && this.infos().baths.value >= 1)
  }


}
