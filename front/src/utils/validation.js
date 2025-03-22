import moment from 'moment';
import 'moment/locale/ru';
 
export const hasRepeatingCharacters = (str) => {
    return /(.)\1{2,}/.test(str);
};
 
export const hasCurrentMonth = (password) => {
    const currentMonth = moment().format('MMMM').toLowerCase();
    return password.toLowerCase().includes(currentMonth);
};
 
export const hasSpecialCharacters = (password) => {
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/g;
    const matches = password.match(specialChars) || [];
    if (matches.length < 2) return false;
 
    for (let i = 0; i < password.length - 1; i++) {
        if (specialChars.test(password[i]) && specialChars.test(password[i + 1])) {
            return false;
        }
    }
    return true;
};
 
export const hasRussianAndEnglish = (password) => {
    const russianLetters = /[а-яА-Я]/;
    const englishLetters = /[a-zA-Z]/;
    return russianLetters.test(password) && englishLetters.test(password);
};
 
export const isValidPhoneNumber = (phone) => { 
    return /^\+\d{1,3}\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/.test(phone);
};
 
export const isValidDateOfBirth = (date) => {
    const momentDate = moment(date);
    if (!momentDate.isValid()) return false;

    const now = moment();
    const age = now.diff(momentDate, 'years');

    return age >= 0 && age <= 111 && momentDate.isSameOrBefore(now);
};
 
export const getAge = (date) => {
    return moment().diff(moment(date), 'years');
};
 
export const formatGender = (gender, dateOfBirth) => {
    const age = getAge(dateOfBirth);
    if (age < 18) {
        return gender === 'male' ? 'мальчик' : 'девочка';
    }
    return gender === 'male' ? 'мужчина' : 'женщина';
};
 
export const isValidUsername = (username) => {
    return /^[a-zA-Zа-яА-Я\s]+$/.test(username);
}; 