'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// functions

//-------------------  display movements

// receive an array from the current account objects
const displayMovements = function (movements, sort = false) {
  // make the container movement is empty
  containerMovements.innerHTML = '';
  // this property present the Html in the element

  // sorting
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // the html element
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;

    // adding the html element
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// display it for the current account

//----------------  calc the total balance

// receive an array with movements numbers
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
// display it for the signed account

//--------------------- display summary

// receive the current account
const calcDisplaySummery = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    // we want to add just interests that is more than 1
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};
// display it for the current account

//-------------- COMPUTE THE USERNAME

// receive array of account objects
// we loop over each object
// we take the owner property of each one
// we will loop over name and get the first letter nad put it into array and then join the array

const createUserName = function (accounts) {
  // receive array of objects
  // loop over each one
  // create new property on each one with the user name
  // we use forEach not map because we want to change the original array
  accounts.forEach(function (account) {
    account.username = account.owner // we receive a name
      .toLowerCase()
      .split(' ') // put every word in an array as an array element
      .map(name => name[0]) // loop over that array and take
      .join(''); // convert the array into string
  });
};
createUserName(accounts);
// console.log(accounts);

//-----------------------  login
let currentAccount;

//--- update UI
// receive the current account
const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);

  // display balance
  calcDisplayBalance(acc);

  //display summary
  calcDisplaySummery(acc);
};

btnLogin.addEventListener('click', function (e) {
  // e  => pointer event
  // the event will happen if we click on the btn or if we click enter inside one of the inputs

  // prevent reloading when click on the btn
  e.preventDefault();
  //**  define the current account  [object]
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // check the credentials
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display the message
    labelWelcome.textContent = `welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // display the ui
    containerApp.style.opacity = 100;

    // make the 2 input empty
    inputLoginUsername.value = inputLoginPin.value = '';
    // makes it lose the focus
    inputLoginPin.blur();

    // update UI
    updateUI(currentAccount);
  }
});

//--------------- transfer money

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  console.log(amount, receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // update Ui
    updateUI(currentAccount);
  }
});

//------------ add loan

// our bank has a rule, which says that it only grants a loan if there at least one deposit with at least 10% of the requested loan amount. mean the loan must be lees than or equal the biggest deposit * 10

//------------  delete account
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    // add movements
    currentAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
      // return the index of the first element that match the condition
    );
    // .indexOf()

    // delete account
    accounts.splice(index, 1);

    // hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//-------- count all the money in the bank

const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalance);

// with flatmap
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);

//------------- sorting
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

////////////////////////////////////////////////
// array.from()

// the result of querySelectorAll is node-list
// we convert into array
// we used the callback function
labelBalance.addEventListener('click', function () {
  const movementUI = Array.from(
    document.querySelectorAll('.movements_value'),
    function (el) {
      return Number(el.textContent.replace('€', ''));
    }
  );
  console.log(movementUI);

  // other way for converting node-list into an array
  const movementUI2 = [...querySelectorAll('.movements_value')];
  // but now we will do mapping manually
});

/////////////////////////////////////////////////

//*   array practice

// 1. calc all the deposits in the bank
const bankDepositSum = accounts
  .flatMap(function (acc, i, obj) {
    return acc.movements;
  })
  .filter(mov => mov > 0)
  .reduce((acc, cur) => acc + cur, 0);
console.log(bankDepositSum);

// 2. calc how many deposits more 1000

const numDeposits1000 = accounts
  .flatMap(function (acc, i, obj) {
    return acc.movements;
  })
  .filter(mov => mov > 1000).length;

console.log(numDeposits1000);

// other way

const numDeposits1000V2 = accounts
  .flatMap(function (acc, i, obj) {
    return acc.movements;
  })
  .reduce((acc, cur) => (cur >= 1000 ? ++acc : acc), 0);

console.log(numDeposits1000);

// 3. create new object contain the sum of the deposits and the withdrawals

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

// 4. convert any string to titleCase

// this is a nice title => This Is a Nice Title

const convertTitleFace = function (title) {
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  return titleCase;
};

console.log(convertTitleFace('this is a nice title but'));
