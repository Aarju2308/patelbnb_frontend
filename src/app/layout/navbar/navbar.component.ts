import { Component, effect, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryComponent } from './category/category.component';
import { AvatarComponent } from './avatar/avatar.component';
import { MenuItem } from 'primeng/api';
import { ToastService } from '../toast.service';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/model/user.model';
import { PropertiesCreateComponent } from '../../landlord/properties-create/properties-create.component';
import { SearchComponent } from '../../tenant/search/search.component';
import dayjs from 'dayjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonModule,
    FontAwesomeModule,
    ToolbarModule,
    MenuModule,
    CategoryComponent,
    AvatarComponent
  ],
  providers:[DialogService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  location = "Anywhere";
  guests = "Add Guests";
  dates = "Any Week";

  toastService = inject(ToastService); 
  authService = inject(AuthService);
  dialogService = inject(DialogService);
  activatedRoute = inject(ActivatedRoute);
  ref : DynamicDialogRef | undefined;

  login = () => this.authService.login();
  logout = () => this.authService.logout();

  currentMenuItems : MenuItem[] | undefined = [];
  connectedUser : User = {email : this.authService.notConnected};

  constructor(){
    effect(()=>{
      if(this.authService.fetchUser().status === "OK"){
        this.connectedUser = this.authService.fetchUser().value!;
        this.currentMenuItems = this.fetchMenu();
      }
    })
  }

  ngOnInit(): void {
    this.authService.fetch(false);
    this.extractInformationForSearch()
  }

  fetchMenu() {
    if (this.authService.isAuthenticated()) {
      return[
        {
          label : "My Properties",
          routerLink : "landlord/properties",
          visible : this.hasToBeLandLord(),
        },
        {
          label : "My Bookings",
          routerLink : "booking",
        },
        {
          label : "My Reservations",
          routerLink : "landlord/reservation",
          visible : this.hasToBeLandLord(),
        },
        {
          label : "logout",
          command : this.logout
        },

      ]
    }else{
      return [
        {
          label : "Sign Up",
          styleClass : "font-bold",
          command: this.login
        },
        {
           label : "Log In",
          styleClass : "font-bold",
          command: this.login
        }
      ];
    }
    
  }

  hasToBeLandLord() : boolean{
    console.log(this.authService.hasAnyAuthority("ROLE_LANDLORD"))
    return this.authService.hasAnyAuthority("ROLE_LANDLORD");
  }

  openNewSearch(){
    this.ref = this.dialogService.open(SearchComponent,
      {
        width: "40%",
        header: "Search",
        closable: true,
        focusOnShow: true,
        modal: true,
        showHeader: true
      });
  }

  openNewListing(){
    this.ref = this.dialogService.open(PropertiesCreateComponent,
      {
        width: "60%",
        header: "Airbnb your home",
        closable: true,
        focusOnShow: true,
        modal: true,
        showHeader: true
      }
    )
  }

  private extractInformationForSearch(): void {
    this.activatedRoute.queryParams.subscribe({
      next: params => {
        if (params["location"]) {
          this.location = params["location"];
          this.guests = params["guests"] + " Guests";
          this.dates = dayjs(params["startDate"]).format("MMM-DD")
            + " to " + dayjs(params["endDate"]).format("MMM-DD");
        } else if (this.location !== "Anywhere") {
          this.location = "Anywhere";
          this.guests = "Add guests";
          this.dates = "Any week";
        }
      }
    })
  }

  // showConfirmToast() {
  //   this.toastService.sendConfirm('Are Yoy sure you want to delete properties ?',this.onConfirm.bind(this),this.onReject.bind(this));
  // }

  // onConfirm() {
  //   this.toastService.send( 
  //     { 
  //         severity: 'success', 
  //         summary: 'Success', 
  //         detail: 'You have joined this live class!', 
  //     }, 
  //   ); 
  // }

  // onReject() {
  //   this.toastService.send( 
  //     { 
  //         severity: 'info', 
  //         summary: 'Rejected', 
  //         detail: 'You have rejected this live class!', 
  //     }, 
  //   ); 
  // }

}
