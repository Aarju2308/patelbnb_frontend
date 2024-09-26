import { HttpErrorResponse, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { tap } from "rxjs";

export const authExpired : HttpInterceptorFn = (
    req : HttpRequest<unknown>,
    next : HttpHandlerFn
)=>{
    const authService : AuthService = inject(AuthService);
    return next(req).pipe(
        tap({
            error:(err : HttpErrorResponse) => {
                if (err.status == 401 && err.url && err.url.includes("api/auth") && authService.isAuthenticated()) {
                    authService.login();
                }
            }
        })
    )
}