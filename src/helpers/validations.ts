export const isEmailValid = (password_text: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(password_text);
};


export const isPasswordValid = (password_text: string): boolean => {
    /*
        - Be at least 8 characters long
        - Contain at least one lowercase letter (a–z)
        - Contain at least one uppercase letter (A–Z)
        - Contain at least one number (0–9)
        - Contain at least one special character (anything not a letter or number, e.g., !@#$%^&*()_+)
    */
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return passwordRegex.test(password_text);
};

export const isUrlValid = (url: string): boolean => {
  if (!url || typeof url !== "string") return false;

  const websiteRegex =
    /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]{1,63}(?:\.[a-zA-Z0-9-]{2,})+(?:\/[^\s?#]*)?(?:\?[^\s#]*)?(?:#[^\s]*)?$/i;

  return websiteRegex.test(url.trim());
};

