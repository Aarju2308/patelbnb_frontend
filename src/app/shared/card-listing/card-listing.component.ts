import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { CardListing } from '../../landlord/model/listing.model';
import { BookedListing } from '../../tenant/model/booking.model';
import { Router } from '@angular/router';
import { CategoryService } from '../../layout/category/category.service';
import { CountryService } from '../../landlord/properties-create/step/location-step/country.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-listing',
  standalone: true,
  imports: [FontAwesomeModule,CurrencyPipe,DatePipe],
  templateUrl: './card-listing.component.html',
  styleUrl: './card-listing.component.scss'
})
export class CardListingComponent {

  listing = input.required<CardListing | BookedListing>();
  cardMode = input<"landlord" | "booking">();

  @Output()
  deleteListing = new EventEmitter<CardListing>();
  @Output()
  editListing = new EventEmitter<CardListing>();
  @Output()
  cancleBooking = new EventEmitter<BookedListing>();

  bookingListing : BookedListing | undefined;
  cardListing : CardListing | undefined;

  router = inject(Router);
  categoryService = inject(CategoryService);
  countryService = inject(CountryService);

  constructor(){
    this.listenToListing();
    this.listenToCardMode();
  }

  private listenToListing():void{
    effect(()=>{
      const listing = this.listing();
      this.countryService.getCountryByCode(listing.location)
        .subscribe({
          next : country =>{
            if (listing) {
              this.listing().location = country.region + ", " +country.name.common
            }
          }
        })
    })
  }

  private listenToCardMode(){
    effect(()=>{
      const cardMode = this.cardMode();
      if (cardMode && cardMode === "booking") {
        this.bookingListing = this.listing() as BookedListing
      }else{
        this.cardListing = this.listing() as CardListing;
      }
    })
  }

  onDeleteListing(displayCardListingDTO : CardListing){
    this.deleteListing.emit(displayCardListingDTO);
  }

  onEditListing(displayCardListingDTO : CardListing){
    this.editListing.emit(displayCardListingDTO);
  }

  onCancelBooking(bookedListing : BookedListing){
    this.cancleBooking.emit(bookedListing);
  }

  onClickCard(publicId : string){
    this.router.navigate(['listing'],{queryParams : {id : publicId}})
  }

} 
