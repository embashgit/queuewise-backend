interface JwtPayload {
    id: string;
    email: string;
    role: string;
  }
  
  // Then replace 'any' with 'JwtPayload' in the type declaration:
  
  