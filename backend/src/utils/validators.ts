class validator{

    public validateEmail = (email: string): boolean => {
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
    
    public validatePhoneNumber = (phoneNumber: string): boolean => {
        const phoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
        if(phoneNumber.length > 10 && !phoneNumber.startsWith("+91")) {
            return false;
        }
        return phoneRegex.test(phoneNumber);
    };
    
    public validateGSTNumber = (gstNumber: string): boolean => {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstRegex.test(gstNumber);
    };

    public validatePassword = (password: string): string => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        return "OK";
    }
    public validateUsername = (username: string): boolean => {
        return username.length > 0 && username.length <= 30;
    }
}

export default new validator();

// export { validateEmail, validatePhoneNumber, validateGSTNumber };