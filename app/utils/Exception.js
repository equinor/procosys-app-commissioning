export function Exception(message, innerException = null) {
  this.message = message;
  this.innerException = innerException;
}

export function NetworkException(message, statuscode, response = null, user = null) {
  this.message = message;
  this.status = statuscode;
  this.response = response;
  this.user = user;
}
