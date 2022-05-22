// subtract one date from
// when we convert date to a number it will give us the timeStamp
const future = new Date(2037, 10, 19, 15, 23);
console.log(Number(future));
console.log(+future);
console.log(future.getTime());
// all will give the same result

// function subtract two dates
// calc the time stamp then convert it into day
const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (24 * 60 * 60 * 1000);
calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
