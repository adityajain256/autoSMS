const validateEmail = (email: string): boolean => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if(email.length > 254) {
        return false;
    }
    const localPart = email.split("@")[0];
    if(localPart && (localPart.length > 64 || localPart.length === 0)) {
        return false;
    }
    return emailRegex.test(email);
};

const validatePhoneNumber = (phoneNumber: string): boolean => {
    const phoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
    if(phoneNumber.length > 10 && !phoneNumber.startsWith("+91")) {
        return false;
    }
    return phoneRegex.test(phoneNumber);
};

const validateGSTNumber = (gstNumber: string): boolean => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
};

export { validateEmail, validatePhoneNumber, validateGSTNumber };