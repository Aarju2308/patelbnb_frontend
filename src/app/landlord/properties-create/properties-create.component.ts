import { Component, effect, inject } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import { LandlordListingService } from '../landlord-listing.service';
import { ToastService } from '../../layout/toast.service';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { Steps } from './steps.model';
import { CreatedListing, Description, EditListing, NewListing, NewListingInfo } from '../model/listing.model';
import { NewListingPicture } from '../model/picture.model';
import { HttpErrorResponse } from '@angular/common/http';
import { State } from '../../core/model/state.model';
import { CategoryName } from '../../layout/category/category.model';
import { CateroryStepComponent } from './step/category-step/category-step.component';
import { FooterStepComponent } from '../../shared/footer-step/footer-step.component';
import { LocationStepComponent } from './step/location-step/location-step.component';
import { InfoStepComponent } from './step/info-step/info-step.component';
import { PictureStepComponent } from './step/picture-step/picture-step.component';
import { DescriptionStepComponent } from './step/description-step/description-step.component';
import { PriceStepComponent } from './step/price-step/price-step.component';
import { PriceVO } from '../model/listing-vo.model';
import { CountryService } from './step/location-step/country.service';

@Component({
  selector: 'app-properties-create',
  standalone: true,
  imports: [CateroryStepComponent,
    FooterStepComponent,
    LocationStepComponent,
    InfoStepComponent,
    PictureStepComponent,
    DescriptionStepComponent,
    PriceStepComponent],
  templateUrl: './properties-create.component.html',
  styleUrl: './properties-create.component.scss'
})
export class PropertiesCreateComponent {

  CATEGORY = "category";
  LOCATION = "location";
  INFO = "info";
  PHOTOS = "photos";
  DESCRIPTION = "description";
  PRICE = "price";

  dialogDynamicRef = inject(DynamicDialogRef);
  listingService = inject(LandlordListingService);
  toastService = inject(ToastService);
  locationService = inject(CountryService)
  userService = inject(AuthService);
  router = inject(Router);

  steps : Steps[] = [
    {
      id: this.CATEGORY,
      idNext: this.LOCATION,
      idPrevious: null,
      isValid:false
    },
    {
      id: this.LOCATION,
      idNext: this.INFO,
      idPrevious: this.CATEGORY,
      isValid:false
    },
    {
      id: this.INFO,
      idNext: this.PHOTOS,
      idPrevious: this.LOCATION,
      isValid:false
    },
    {
      id: this.PHOTOS,
      idNext: this.DESCRIPTION,
      idPrevious: this.INFO,
      isValid:false
    },
    {
      id: this.DESCRIPTION,
      idNext: this.PRICE,
      idPrevious: this.PHOTOS,
      isValid:false
    },
    {
      id: this.PRICE,
      idNext: null,
      idPrevious: this.DESCRIPTION,
      isValid:false
    }
  ]

  currentStep = this.steps[0];

  newListing : NewListing = {
    bookingCategory: "AMAZING_VIEWS",
    infos: {
      baths: {value : 0},
      beds: {value : 0},
      bedrooms: {value : 0},
      guests: {value : 0}
    },
    location: "",
    pictures: new Array<NewListingPicture>(),
    description : {
      description: {value : ""},
      title : {value : ""}
    },
    price : {value : 0}
  };

  loadingCreation = false;
  isEditMode = false;
  editListing : EditListing | undefined;

  constructor(public config : DynamicDialogConfig){
    if (this.config.data?.listing) {
      this.isEditMode = true;
      this.editListing = { ...this.config.data?.listing};
      this.newListing.bookingCategory = this.editListing!.bookingCategory;
      this.newListing.infos = this.editListing!.infos;
      this.newListing.location = this.editListing!.location;
      this.newListing.pictures = this.editListing!.pictures;
      this.newListing.description = this.editListing!.description;
      this.newListing.price = this.editListing!.price;
    }
    this.listenFetchUser();
    this.listenListingCreation();
    this.listenListingUpdation();
  }

  createListing(){
    this.loadingCreation = true;
    if (this.isEditMode) {
      const countryName = this.editListing?.location.split(',').pop()?.trim();
      this.locationService.getCountryCodeByCountry(countryName!).subscribe({
        next: (country) => {
          if (country) {
            this.editListing!.location = country.cca3; 
          }
        },
        error: (err) => {
          console.error('Error fetching country code:', err);
        }
      });
      console.log(this.editListing);
      this.listingService.update(this.editListing!);
    }else{
      this.listingService.create(this.newListing);
    }
  }

  ngOnDestroy(): void {
    this.listingService.resetListingCreation();
    this.listingService.resetListingUpdation();
  }

  listenFetchUser(){
    effect(()=>{
      if(this.userService.fetchUser().status === "OK" &&
          this.listingService.createSig().status === 'OK'){
            this.router.navigate(["landlord","properties"]);
      }
    })
  }


  listenListingCreation():void{
    effect(()=>{
      let createdListingState = this.listingService.createSig();
      if(createdListingState.status === "OK"){
        this.onCreateOk(createdListingState);
      }else if(createdListingState.status === "ERROR"){
        this.onCreateError();
      }
    })
  }

  listenListingUpdation():void{
    effect(()=>{
      let updateListingState = this.listingService.updateSig();
      if(updateListingState.status === "OK"){
        this.onCreateOk(updateListingState);
      }else if(updateListingState.status === "ERROR"){
        this.onCreateError();
      }
    })
  }

  onCreateError() {
    this.loadingCreation = false;
    this.toastService.send({
      severity: "error",
      summary: "Error",
      detail: "Something went wrong. Please try again."
    });
  }
  
  onCreateOk(createdListingState: State<CreatedListing>) {
    this.loadingCreation = false;
    if (this.isEditMode) {
      this.toastService.send({severity: "success",summary: "Success", detail: "Listing updated successfully"});
      this.isEditMode = false;
    }else{
      this.toastService.send({severity: "success",summary: "Success", detail: "Listing created successfully"});
    }
    this.dialogDynamicRef.close(createdListingState.value!.publicId);
    this.userService.fetch(true);
  }

  nextStep(){
    if (this.currentStep.idNext != null) {
        this.currentStep = this.steps.filter((step:Steps)=> step.id === this.currentStep.idNext)[0];
    }
  }

  previousStep(){
    if (this.currentStep.idPrevious != null) {
      this.currentStep = this.steps.filter((step:Steps)=> step.id === this.currentStep.idPrevious)[0];
    }
  }

  isAllStepsValid():boolean{
    return this.steps.filter(step => step.isValid).length === this.steps.length;
  }

  getFinishBtnLbl():string{
    if (this.isEditMode) {
      return "Update"
    }else{
      return "Finish"
    }
  }
  

  onCategoryChange(newCategory : CategoryName){
    this.newListing.bookingCategory = newCategory;
  }

  onValidityChange(isValid : boolean){
    this.currentStep.isValid = isValid;
  }

  onLocationChange(newLocation : string){
    this.newListing.location = newLocation
  }
  
  onInfoChange(newInfo : NewListingInfo){
    this.newListing.infos = newInfo;
  }

  onPictureChange(pictures : NewListingPicture[]){
    this.newListing.pictures = pictures;
  }

  onDescriptionChange(newDescription : Description){
    this.newListing.description = newDescription;
  }

  onPriceChange(newPrice : PriceVO){
    this.newListing.price = newPrice;
  }
}
