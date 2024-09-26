import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { CardListing, CreatedListing, EditListing, NewListing } from './model/listing.model';
import { State } from '../core/model/state.model';
import { environment } from '../../environments/environment';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LandlordListingService {
  
  http : HttpClient = inject(HttpClient);
  router = inject(Router)

  constructor() { }

  private create$ : WritableSignal<State<CreatedListing>> = 
    signal(State.Builder<CreatedListing>().forInit())
  createSig = computed(() => this.create$());

  private update$ : WritableSignal<State<EditListing>> = 
    signal(State.Builder<EditListing>().forInit())
  updateSig = computed(() => this.update$()); 

  private getAll$ : WritableSignal<State<Array<CardListing>>> =
    signal(State.Builder<Array<CardListing>>().forInit())
  getAllSig = computed(()=> this.getAll$())

  private getSingle$ : WritableSignal<State<EditListing>> =
    signal(State.Builder<EditListing>().forInit())
  getSingleSig = computed(()=>this.getSingle$())

  private delete$ : WritableSignal<State<string>> =
    signal(State.Builder<string>().forInit())
  deleteSig = computed(()=> this.delete$())

  create(newListing: NewListing) : void{
    const formData = new FormData();
    for (let i = 0; i < newListing.pictures.length; ++i) {
      formData.append("picture-" + i, newListing.pictures[i].file);
    }
    const clone = structuredClone(newListing);
    clone.pictures = [];
    formData.append("dto",JSON.stringify(clone));
    this.http.post<CreatedListing>(`${environment.API_URL}/landlord-listing/create`,
      formData
    ).subscribe({
      next: listing => {this.create$.set(State.Builder<CreatedListing>().forSuccess(listing));this.getAll();},
      error: error => this.create$.set(State.Builder<CreatedListing>().forError(error))
    })
  }

  update(editListing: EditListing) : void{
    const formData = new FormData();
    console.log(editListing.pictures)
    for (let i = 0; i < editListing.pictures.length; ++i) {
      formData.append("picture-" + i, editListing.pictures[i].file);
    }
    const clone = structuredClone(editListing);
    clone.pictures = [];
    formData.append("dto",JSON.stringify(clone));
    this.http.put<EditListing>(`${environment.API_URL}/landlord-listing/update`,
      formData
    ).subscribe({
      next: listing => {
        this.update$.set(State.Builder<EditListing>().forSuccess(listing)); 
        this.getAll();
      },
      error: error => this.update$.set(State.Builder<EditListing>().forError(error))
    })
  }

  resetListingCreation():void{
    this.create$.set(State.Builder<CreatedListing>().forInit());
  }

  resetListingUpdation():void{
    this.update$.set(State.Builder<EditListing>().forInit());
  }

  getAll():void{
    this.http.get<Array<CardListing>>(`${environment.API_URL}/landlord-listing/get-all`)
      .subscribe({
        next : (listings : CardListing[]) =>{
          this.getAll$.set(State.Builder<Array<CardListing>>().forSuccess(listings))
        },
        error : err => {
            this.getAll$.set(State.Builder<Array<CardListing>>().forError(err))
        },
      })
  }

  // getSingle(publicId : string){
  //   console.log('Fetching listing with publicId:', publicId);
  //   this.http.get<EditListing>(`${environment.API_URL}/landlord-listing/get-single`,  {params : {"publicId" : publicId}})
  //     .subscribe({
  //       next:(singleListing : EditListing) => {
  //           console.log("Success : " + singleListing.id)
  //           this.getSingle$.set(State.Builder<EditListing>().forSuccess(singleListing));
  //       },
  //       error : err => {
  //         console.log("Error : ")
  //         this.getSingle$.set(State.Builder<EditListing>().forError(err))
  //       }
  //     })
  // }

  // getSingle(publicId: string): Observable<EditListing> {
  //   return this.http.get<EditListing>(`${environment.API_URL}/landlord-listing/get-single`, { params: { publicId } })
  //     .pipe(
  //       catchError(err => {
  //         this.getSingle$.set(State.Builder<EditListing>().forError(err));
  //         return throwError(err);
  //       })
  //     );
  // }

  getSingle(publicId: string): Observable<EditListing> {
    if (!this.isValidUUID(publicId)) {
      console.error("Invalid UUID format");
      return throwError("Invalid UUID format");
    }
    return this.http.get<EditListing>(`${environment.API_URL}/landlord-listing/get-single`, { params: { publicId } })
      .pipe(
        catchError(err => {
          this.getSingle$.set(State.Builder<EditListing>().forError(err));
          return throwError(err);
        })
      );
  }
  
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
  

  delete(publicId : string):void{
    this.http.delete<string>(`${environment.API_URL}/landlord-listing/delete`, {params : {"publicId" : publicId}})
      .subscribe({
        next : publicId => this.delete$.set(State.Builder<string>().forSuccess(publicId)),
        error :(err) => {
            this.delete$.set(State.Builder<string>().forError(err))
        },
      })
  }

  resetDelete(){
    this.delete$.set(State.Builder<string>().forInit());
  }
  resetEdit(){
    this.getSingle$.set(State.Builder<EditListing>().forInit());
  }
}
