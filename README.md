
# PatelBNB Frontend

## Description
**PatelBNB Frontend** is the client-side of the **PatelBNB** property rental platform, built with **Angular** and **SCSS**. It interacts with the backend services for property listings, user authentication, and booking management.

## Technologies
- **Angular (latest version)**: A framework for building dynamic web applications.
- **TypeScript**: The main programming language.
- **SCSS (Sassy CSS)**: For styling with flexibility and better structure.
- **RxJS**: For managing asynchronous data streams.
- **Angular Router**: For client-side routing.
- **Angular Forms**: For form building and validation.
- **Bootstrap** (optional): For responsive design.
- **Font Awesome**: For icons.
- **NgRx** (optional): For state management.

---

[Backend API Documentation](https://github.com/Aarju2308/patenbnb_backend) includes detailed information on the backend's API endpoints, authentication flow, and database setup.

---

### Package.json Overview
Key dependencies used in the project (from `package.json`):
- `@angular/core`: Angular core library.
- `@angular/forms`: Angular forms module.
- `rxjs`: Reactive Extensions Library for JavaScript.
- `@auth0/angular-jwt`: Authentication with JSON Web Tokens.
- `@fortawesome/fontawesome-free`: FontAwesome icons.
- `sass`: SCSS preprocessor.

---

## Installation

### Prerequisites
Ensure the following are installed:
- **Node.js** (LTS version recommended)
- **Angular CLI** (latest version)
- **NPM** or **Yarn**

### Clone the Repository
```bash
git clone https://github.com/username/PatelBNB-Frontend.git
cd PatelBNB-Frontend
```

### Install Dependencies
```bash
npm install
```

### Environment Configuration
Create an environment file (`src/environments/environment.ts`) with the following structure:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:1323/api',
  auth0ClientId: 'VjtcXHUuXBG4IJbRaRtsbxXxwfoXbBV0',
  auth0Domain: 'your-domain.auth0.com',
  auth0RedirectUri: 'http://localhost:4200/callback',
};
```

### Running the Application
To serve the Angular application locally:
```bash
ng serve
```
The app will be available at `http://localhost:4200`.

---

## Project Structure
The project follows the Angular CLI structure:

```
src/
 ├── app/
 │   ├── core/
 │   │   ├── auth/                # Authentication module
 │   │   └── model/               # Shared models
 │   ├── home/                    # Home page component
 │   │   ├── home.component.html
 │   │   ├── home.component.scss
 │   ├── landlord/
 │   │   ├── properties-create/   # Property creation components
 │   ├── layout/
 │   │   ├── navbar/              # Navigation bar component
 │   ├── shared/
 │   │   ├── card-listing/        # Reusable listing cards
 │   │   └── pagination/          # Pagination controls
 │   ├── assets/                  # Static assets
 │   └── environments/            # Environment configuration
 ├── styles.scss                  # Global styles
 └── main.ts                      # Angular entry point
```

### Key Folders:
- **auth**: Contains authentication-related services and components.
- **model**: Shared data models across the application.
- **landlord**: Contains components related to landlord functionalities like property listings.
- **layout**: Houses shared components like navbar and layout configurations.
- **shared**: Contains reusable components like listing cards and pagination.
- **assets**: Static files such as images, icons, and fonts.
- **environments**: Environment-specific configurations.

---

## Features
- **Property Listings**: Browse, filter, and search properties.
- **Authentication**: OAuth2 integration for secure login.
- **Booking Management**: View, create, and cancel bookings.
- **Responsive Design**: Optimized for mobile and desktop.

---

## Styling with SCSS
Global and modular SCSS is used throughout the project:
- `styles/variables.scss`: Global variables like colors and fonts.
- `styles/mixins.scss`: Reusable SCSS mixins.
- `styles/global.scss`: Global styles for the app.

Example:
```scss
// variables.scss
$primary-color: #ff5a5f;
$secondary-color: #00a699;

// mixins.scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// global.scss
body {
  font-family: 'Roboto', sans-serif;
  background-color: #f7f7f7;
}
```

---

## Testing
Run unit tests:
```bash
ng test
```

Run end-to-end tests:
```bash
ng e2e
```

---

## Deployment
To build the project for production:
```bash
ng build --prod
```
The build artifacts will be in the `dist/` directory. You can deploy this folder to any hosting service like **Firebase**, **Netlify**, or **AWS S3**.

---

## License
This project is licensed under the MIT License.

---

## Contact
For any issues, contact `patelbnb_support@example.com`.

