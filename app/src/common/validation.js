import {cities} from "../utils/cities";
import {
  ERROR_INSUFFICIENT_IMAGES,
  ERROR_LOCATION_DOES_NOT_EXIST,
  ERROR_MAIL,
  ERROR_PASSWORD,
  ERROR_TAGS_LENGTH,
  ERROR_VALIDATION_PASSWORD
} from "./messages";

export function validateEmail(email) {
  const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return String(email).toLowerCase().match(emailRe) !== null;
};

export function validatePassword(password) {
  const passwordRe = /^(?=.*[!@#$&?])(?=.*\d)(?=.*[A-Z])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,20}$/;

  return passwordRe.test(password);
}

export function formValidateEmail(email) {
  return validateEmail(email) || ERROR_MAIL;
}

export function formValidatePassword(password) {
  return validatePassword(password) || ERROR_PASSWORD;
}

export function formValidateConfirmationPassword(password, confirmation) {
  return password === confirmation || ERROR_VALIDATION_PASSWORD;
}

export function formValidateTags(tags) {
  return (Array.isArray(tags) && tags.length > 0 && tags.length <= 10) || ERROR_TAGS_LENGTH;
}

export function formValidateLocation(location) {
  return location in cities || ERROR_LOCATION_DOES_NOT_EXIST;
}

export function formValidateLength(min, max) {
  return function(text) {
    return (text.length >= min && text.length <= max) || `Le text doit comporter entre ${min} et ${max} caractères`;
  }
}

export function formValidateImages(images) {
  return (images.length >= 3 && images.length <= 5) || ERROR_INSUFFICIENT_IMAGES;
}