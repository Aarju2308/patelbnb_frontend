import { CategoryName } from "../../layout/category/category.model";
import { BathsVO, BedroomsVO, BedsVO, DescriptionVO, GuestVO, PriceVO, TitleVO } from "./listing-vo.model";
import { NewListingPicture } from "./picture.model";

export interface NewListingInfo{
    guests : GuestVO,
    bedrooms : BedroomsVO,
    beds : BedsVO,
    baths : BathsVO
}

export interface Description{
    title : TitleVO,
    description : DescriptionVO
}

export interface NewListing{
    bookingCategory : CategoryName,
    location : string,
    infos : NewListingInfo,
    pictures : Array<NewListingPicture>,
    description : Description,
    price : PriceVO 
}

export interface EditListing{
    id : number,
    publicId : string,
    landlordPublicId : string,
    bookingCategory : CategoryName,
    location : string,
    infos : NewListingInfo,
    pictures : Array<NewListingPicture>,
    description : Description,
    price : PriceVO 
}

export interface CreatedListing{
    publicId : string,
}

export interface DisplayPicture{
    file?:string,
    fileContentType?:string,
    isCover?:boolean,
}

export interface CardListing{
    price : PriceVO,
    location : string,
    cover: DisplayPicture,
    bookingCategory : CategoryName,
    publicId : string,
    loading:boolean
}

export interface Listing {
    description : Description,
    pictures : Array<DisplayPicture>,
    infos : NewListingInfo,
    price : PriceVO,
    location : string,
    landlord : LandlordListing,
    category : CategoryName
}

export interface LandlordListing{
    firstName : string,
    imageUrl : string
}
