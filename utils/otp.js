function getRandomNumberForOtp(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// const otp = getRandomNumberForOtp(1000, 9999);

export default getRandomNumberForOtp();
