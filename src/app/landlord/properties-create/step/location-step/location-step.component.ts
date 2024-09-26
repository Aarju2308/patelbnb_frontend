import { Component, EventEmitter, input, OnInit, Output, output } from '@angular/core';
import { LocationMapComponent } from './location-map/location-map.component';

@Component({
  selector: 'app-location-step',
  standalone: true,
  imports: [LocationMapComponent],
  templateUrl: './location-step.component.html',
  styleUrl: './location-step.component.scss'
})
export class LocationStepComponent implements OnInit {

  location = input.required<string>();

  @Output()
  locationChange = new EventEmitter<string>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    if (this.location()!="") {
      this.stepValidityChange.emit(true);
    }
  }

  onLocationChange(location : string){
    this.locationChange.emit(location);
    this.stepValidityChange.emit(true);
  }


}
