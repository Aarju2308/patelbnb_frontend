import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { BookingService } from '../../tenant/service/booking.service';
import { ToastService } from '../../layout/toast.service';
import { BookedListing } from '../../tenant/model/booking.model';
import { CardListingComponent } from '../../shared/card-listing/card-listing.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CardListingComponent,FaIconComponent],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit,OnDestroy {

  bookingService = inject(BookingService);
  toastService = inject(ToastService);

  reservations : BookedListing[] = new Array<BookedListing>();

  loading = false;

  constructor(){
    this.listenToFetchReservation();
    this.listenToCancelReservation();
  }

  ngOnDestroy(): void {
    this.bookingService.resetCancelBooking()
  }
  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations() {
    this.loading = true;
    this.bookingService.getBookedListingForLandlord();
  }

  listenToCancelReservation(){
    effect(()=>{
      const cancelState = this.bookingService.cancelBookingSig();
      if (cancelState.status === "OK") {
        const indexToCancel = this.reservations.findIndex(listing => listing.bookingPublicId === cancelState.value!);
        this.reservations.splice(indexToCancel,1);
      }else if (cancelState.status === "ERROR") {
        const indexToCancel = this.reservations.findIndex(listing => listing.bookingPublicId === cancelState.value!);
        this.reservations[indexToCancel].loading = false;
      }
    })
  }

  listenToFetchReservation():void{
    effect(()=>{
      const reservationState = this.bookingService.getBookedListingForLandlordSig();
      if (reservationState.status === "OK") {
        this.loading = false;
        this.reservations = reservationState.value!;
      }else if (reservationState.status === "ERROR") {
        this.loading = false;
        this.toastService.send({severity:"error",detail:"Could not fetch reservations", summary:"Error"})
      }
    })
  }

  onCancelReservation(bookedListing : BookedListing){
    bookedListing.loading = true;
    this.toastService.sendConfirm("Are you sure you want to cancel this reservation", () => this.confirmCancel(bookedListing),() => this.cancleDelete(bookedListing))
  
  }

  confirmCancel(bookedListing : BookedListing){
    this.bookingService.cancelBooking(bookedListing.bookingPublicId, bookedListing.listingPublicId, true);
    this.toastService.send({severity:"success",summary:"Success", detail:"Reservation has been cancelled successfully"});  
    bookedListing.loading = false;
  }
   
  cancleDelete(bookedListing : BookedListing){
    this.toastService.send({severity:"info",summary:"Info", detail:"Reservation has not been cancelled"});  
    bookedListing.loading = false;
  }


}