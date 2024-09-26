import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { BookingService } from '../service/booking.service';
import { ToastService } from '../../layout/toast.service';
import { BookedListing } from '../model/booking.model';
import { CardListingComponent } from '../../shared/card-listing/card-listing.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-booked-listing',
  standalone: true,
  imports: [CardListingComponent,FaIconComponent],
  templateUrl: './booked-listing.component.html',
  styleUrl: './booked-listing.component.scss'
})
export class BookedListingComponent implements OnInit,OnDestroy {

  bookingService = inject(BookingService);
  toastService = inject(ToastService);
  bookedListings =  new Array<BookedListing>();

  loading = false;

  constructor(){
    this.listenFetchBooking();
  }

  listenFetchBooking() {
   effect(()=>{
    const listingState = this.bookingService.getBookedListingSig();
    if (listingState.status === "OK") {
      this.loading = false;
      this.bookedListings = listingState.value!;
    }else if (listingState.status === "ERROR") {
      this.loading = false;
      this.toastService.send({severity:"error", summary:"Error while loading bookings"});
    }
   })
  }

  listenCancelBooking(){
    effect(()=>{
      const cancelState = this.bookingService.cancelBookingSig();
      if (cancelState.status === "OK") {
        const listingToCancel = this.bookedListings.findIndex(
          (listing:BookedListing)=>listing.bookingPublicId === cancelState.value
        )
        this.bookedListings.splice(listingToCancel,1);
        this.toastService.send({severity:"success",summary:"Booking cancled successgully"})
      }else if (cancelState.status === "ERROR") {
        const listingToCancel = this.bookedListings.findIndex(
          (listing:BookedListing)=>listing.bookingPublicId === cancelState.value
        );
        this.bookedListings[listingToCancel].loading = false; 
        this.toastService.send({severity:"error",summary:"Error while canceling booking"});
      }
    })
  }

  ngOnDestroy(): void {
    this.bookingService.resetCancelBooking();
  }
  ngOnInit(): void {
    this.fetchBookings()
  }

  private fetchBookings():void{
    this.loading = true;
    this.bookingService.getBookedListing()
  }

  onCancelBooking(bookedListing : BookedListing){
    bookedListing.loading = true;
    this.toastService.sendConfirm("Are you sure you want to cancel this booking", () => this.confirmCancel(bookedListing),() => this.cancleDelete(bookedListing))
  }

  confirmCancel(bookedListing : BookedListing){
    this.bookingService.cancelBooking(bookedListing.bookingPublicId, bookedListing.listingPublicId, false);
    this.toastService.send({severity:"success",summary:"Success", detail:"Booking has been cancelled successfully"});  
    bookedListing.loading = false;
  }
   
  cancleDelete(bookedListing : BookedListing){
    this.toastService.send({severity:"info",summary:"Info", detail:"Booking has not been cancelled"});  
    bookedListing.loading = false;
  }


}
