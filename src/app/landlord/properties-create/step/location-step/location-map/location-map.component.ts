import { Component, effect, EventEmitter, inject, input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { CountryService } from '../country.service';
import { ToastService } from '../../../../../layout/toast.service';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Country } from '../country.model';
import L, { circle, latLng, polygon, tileLayer } from 'leaflet';

@Component({
  selector: 'app-location-map',
  standalone: true,
  imports: [
    LeafletModule,
    FormsModule,
    AutoCompleteModule
  ],
  templateUrl: './location-map.component.html',
  styleUrl: './location-map.component.scss'
})
export class LocationMapComponent implements OnInit {

  countryService = inject(CountryService);
  toastService = inject(ToastService);


  private map : L.Map | undefined;
  private provider : OpenStreetMapProvider | undefined;

  location = input.required<string>();
  placeholder = input<string>("Select your home country");

  currentLocation : Country | undefined;

  @Output()
  locationChange = new EventEmitter<string>();

  formatLabel = (country : Country) => country.flag + "   " + country.name.common;


  options = {
    layers: [
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom: 18, attribution: "..."}),
    ],
    zoom: 5,
    center: latLng(46.87996, -121.726909)
  }

  layersControl = {
    baseLayers: {
      "Open Street Map": tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "..."
      }),
    },
    overlays: {
      "Big Circle": circle([46.95, -122], {radius: 5000}),
      "Big square": polygon([[46.8, -121.55], [46.8, -121.55], [46.8, -121.55], [46.8, -121.55]])
    }
  }

  countries : Array<Country> = [];
  filteredCountries : Array<Country> = [];

  constructor(){
    this.listenToLocation();
  }

  ngOnInit(): void {
    if(this.location() != ""){
     this.changeMapLocation(this.location());
    }
  }

  onMapReady(map : L.Map){
    this.map = map
    this.configSearchControl();
  }

  configSearchControl() {
    this.provider = new OpenStreetMapProvider();
  }

  onLocationChange(newEvent : AutoCompleteSelectEvent){
    const newCountry = newEvent.value as Country;
    this.locationChange.emit(newCountry.cca3);
  }

  listenToLocation(){
    effect(()=>{
      const countriesState = this.countryService.countries();
      if(countriesState.status === 'OK' && countriesState.value){
        this.countries = countriesState.value;
        this.filteredCountries = countriesState.value;
        this.changeMapLocation(this.location());
      }else if(countriesState.status === 'ERROR'){
        this.toastService.send({
          severity : "error",
          summary : "Error",
          detail : "Something went wrong while loading countries" 
        })
      }
    })
  }

  private changeMapLocation(term: string) {
    console.log(term)
    const customIcon = L.icon({
      iconUrl: 'assets/images/marker.png',
      iconSize: [38, 38], // size of the icon
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    if (this.location()!="" && this.location().length > 3) {
      const countryName = term.split(',').pop()?.trim();
      this.currentLocation = this.countries.find(country => country.name.common === countryName);
    }else{
      this.currentLocation = this.countries.find(country => country.cca3 === term);
    }
    if (this.currentLocation) {
      this.provider!.search({query: this.currentLocation.name.common})
        .then((results) => {
          if (results && results.length > 0) {
            const firstResult = results[0];
            this.map!.setView(new L.LatLng(firstResult.y, firstResult.x), 5);
            L.marker([firstResult.y, firstResult.x], {icon:customIcon})
              .addTo(this.map!)
              .bindPopup(firstResult.label)
              .openPopup();
          }
        })
    }
  }

  search(newCompleteEvent : AutoCompleteCompleteEvent){
    this.filteredCountries = this.countries.filter(country => country.name.common.toLowerCase().startsWith(newCompleteEvent.query));
  }

}
