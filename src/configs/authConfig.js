// src/authConfig.js
export const msalConfig = {
    auth: {
      clientId: "c2d4f853-7af1-4d19-9922-e3dfee228797", // Replace with your Azure AD app's client ID
      authority: "https://login.microsoftonline.com/ef086672-9048-432d-8a11-4c95bf2fef52", // Replace with your Azure AD tenant ID
      redirectUri: window.location.origin, 
      postLogoutRedirectUri: "/", // Ensure this is the correct URI after logout
  
    },
    cache: {
      cacheLocation: "localStorage", // Configure cache location
      storeAuthStateInCookie: false, // Recommended for IE11 or older browsers
    },
  };
  
  
