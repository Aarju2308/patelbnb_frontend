import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { State } from '../../core/model/state.model';
import { BookedDatesDTOFromClient, BookedDatesDTOFromServer, BookedListing, CreateBooking } from '../model/booking.model';
import { environment } from '../../../environments/environment';
import dayjs from 'dayjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private http = inject(HttpClient);

  private createBooking$ : WritableSignal<State<boolean>>
  = signal(State.Builder<boolean>().forInit());
  createBookingSig = computed(()=> this.createBooking$());

  private checkAvailability$ : WritableSignal<State<Array<BookedDatesDTOFromClient>>>
  = signal(State.Builder<Array<BookedDatesDTOFromClient>>().forInit());
  checkAvailabilitySig = computed(()=> this.checkAvailability$());

  private getBookedListing$ : WritableSignal<State<Array<BookedListing>>>
  = signal(State.Builder<Array<BookedListing>>().forInit());
  getBookedListingSig = computed(()=> this.getBookedListing$());

  private getBookedListingForLandlord$ : WritableSignal<State<Array<BookedListing>>>
  = signal(State.Builder<Array<BookedListing>>().forInit());
  getBookedListingForLandlordSig = computed(()=> this.getBookedListingForLandlord$());

  private cancelBooking$ : WritableSignal<State<string>>
  = signal(State.Builder<string>().forInit());
  cancelBookingSig = computed(()=> this.cancelBooking$());

  create(newBooking : CreateBooking ){
    this.http.post<boolean>(`${environment.API_URL}/booking/create`, newBooking)
    .subscribe({
      next: created => this.createBooking$.set(State.Builder<boolean>().forSuccess(created)),
      error: err => this.createBooking$.set(State.Builder<boolean>().forError(err))
    });
  }

  checkAvailability(publicId: string): void {
    const params = new HttpParams().set("listingPublicId", publicId);
    this.http.get<Array<BookedDatesDTOFromServer>>(`${environment.API_URL}/booking/check-availability`, {params})
      .pipe(
        map(this.mapDateToDayJS())
      ).subscribe({
      next: bookedDates =>
        this.checkAvailability$.set(State.Builder<Array<BookedDatesDTOFromClient>>().forSuccess(bookedDates)),
      error: err => this.checkAvailability$.set(State.Builder<Array<BookedDatesDTOFromClient>>().forError(err))
    })
  }


  constructor() {
  }

  private mapDateToDayJS = () => {
    return (bookedDates: Array<BookedDatesDTOFromServer>): Array<BookedDatesDTOFromClient> => {
      return bookedDates.map(reservedDate => this.convertDateToDayJS(reservedDate))
    }
  }

  private convertDateToDayJS<T extends BookedDatesDTOFromServer>(dto: T): BookedDatesDTOFromClient {
    return {
      ...dto,
      startDate: dayjs(dto.startDate),
      endDate: dayjs(dto.endDate),
    };
  }

  resetCreateBooking(){
    this.createBooking$.set(State.Builder<boolean>().forInit());
  }

  getBookedListing():void{
    this.http.get<Array<BookedListing>>(`${environment.API_URL}/booking/get-booked-listing`)
      .subscribe({
        next : (bookedListings : Array<BookedListing>) => {
          this.getBookedListing$.set(State.Builder<Array<BookedListing>>().forSuccess(bookedListings))
        },
        error : err => this.getBookedListing$.set(State.Builder<Array<BookedListing>>().forError(err))
      })
  }

  getBookedListingForLandlord():void{
    this.http.get<Array<BookedListing>>(`${environment.API_URL}/booking/get-booked-listing-for-landlord`)
      .subscribe({
        next : (bookedListings : Array<BookedListing>) => {
          this.getBookedListingForLandlord$.set(State.Builder<Array<BookedListing>>().forSuccess(bookedListings))
        },
        error : err => this.getBookedListingForLandlord$.set(State.Builder<Array<BookedListing>>().forError(err))
      })
  }

  cancelBooking(bookingPublicId : string, listingPublicId:string, byLandlord:boolean){
    const params = new HttpParams().set("bookingPublicId",bookingPublicId)
    .set("listingPublicId",listingPublicId)
    .set("byLandlord",byLandlord);
    this.http.delete<string>(`${environment.API_URL}/booking/cancel-booking`,{params})
      .subscribe({
        next : (canceldPublicId:string)=> this.cancelBooking$.set(State.Builder<string>().forSuccess(canceldPublicId)),
        error: err => this.cancelBooking$.set(State.Builder<string>().forError(err))
      })
  }

  resetCancelBooking(){
    this.cancelBooking$.set(State.Builder<string>().forInit());
  }



}
