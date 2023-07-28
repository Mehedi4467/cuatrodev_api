export function createApiKey() {
    const numbers = '0123456789';
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
    let apiKey = '';

     // Generate 10 random letters
     for (let i = 0; i < 10; i++) {
        apiKey += letters[Math.floor(Math.random() * letters.length)];
      }
  
    // Generate 10 random numbers
    for (let i = 0; i < 10; i++) {
      apiKey += numbers[Math.floor(Math.random() * numbers.length)];
    }
  
  
    // Generate 10 random letters
    for (let i = 0; i < 10; i++) {
      apiKey += letters[Math.floor(Math.random() * letters.length)];
    }

     // Generate 5 random numbers
     for (let i = 0; i < 5; i++) {
        apiKey += numbers[Math.floor(Math.random() * numbers.length)];
    }
    
    // Generate 5 random letters
    for (let i = 0; i < 5; i++) {
        apiKey += letters[Math.floor(Math.random() * letters.length)];
      }
  
    return apiKey;
  }

  