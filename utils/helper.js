const Handlebars = require("handlebars");
const moment = require("moment");

Handlebars.registerHelper("inc", function (value, options) {
  return Number.parseInt(value) + 1;
});

Handlebars.registerHelper("isEqual", function (value, value1, options) {
  // console.log(value, value1);
  return value === value1;
});

Handlebars.registerHelper("base64safe", function (value) {
  return Handlebars.SafeString(value);
});

const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

// function numberToWord(n) {
// 	if (n < 0)
// 		return false;
// 	single_digit = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
// 	double_digit = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
// 	below_hundred = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
// 	if (n === 0) return 'Zero'
// 	function translate(n) {
// 		word = ""
// 		if (n < 10) {
// 			word = single_digit[n] + ' '
// 		}
// 		else if (n < 20) {
// 			word = double_digit[n - 10] + ' '
// 		}
// 		else if (n < 100) {
// 			rem = translate(n % 10)
// 			word = below_hundred[(n - n % 10) / 10 - 2] + ' ' + rem
// 		}
// 		else if (n < 1000) {
// 			word = single_digit[Math.trunc(n / 100)] + ' Hundred ' + translate(n % 100)
// 		}
// 		else if (n < 1000000) {
// 			word = translate(parseInt(n / 1000)).trim() + ' Thousand ' + translate(n % 1000)
// 		}
// 		else if (n < 1000000000) {
// 			word = translate(parseInt(n / 1000000)).trim() + ' Million ' + translate(n % 1000000)
// 		}
// 		else {
// 			word = translate(parseInt(n / 1000000000)).trim() + ' Billion ' + translate(n % 1000000000)
// 		}
// 		return word
// 	}
// 	result = translate(n)
// 	return result.trim() + '.'
// }

function numberToWord(n) {
  if (n < 0) {
    return false;
  }

  const single_digit = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const double_digit = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const below_hundred = [
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (n === 0) {
    return "Zero";
  }

  let word = "";
  const billion = Math.floor(n / 1_000_000_000);
  const million = Math.floor((n % 1_000_000_000) / 1_000_000);
  const thousand = Math.floor((n % 1_000_000) / 1000);
  let remainder = n % 1000;

  if (billion > 0) {
    word += `${numberToWord(billion)} Billion `;
  }

  if (million > 0) {
    word += `${numberToWord(million)} Million `;
  }

  if (thousand > 0) {
    word += `${numberToWord(thousand)} Thousand `;
  }

  if (remainder > 0) {
    if (remainder >= 100) {
      word += `${single_digit[Math.floor(remainder / 100)]} Hundred `;
      remainder %= 100;
    }

    if (remainder >= 10 && remainder <= 19) {
      word += double_digit[remainder - 10];
    } else if (remainder >= 20) {
      word += below_hundred[Math.floor(remainder / 10) - 2];
      if (remainder % 10 !== 0) {
        word += ` ${single_digit[remainder % 10]}`;
      }
    } else if (remainder > 0) {
      word += single_digit[remainder];
    }
  }

  return `${word.trim()}.`;
}

const toSnakeCase = (string_ = "") => {
  const stringArray = string_.split(" ");
  const snakeArray = stringArray.reduce((accumulator, value) => {
    return accumulator.concat(value.toLowerCase());
  }, []);
  return snakeArray.join("_");
};

const roleAccessNested = (accessArray, idfield = "id") => {
  let deleted = [];
  const nested = (items) => {
    for (const item of items) {
      for (const [index, element] of accessArray.entries()) {
        if (item[idfield] === element.parentId) {
          item.children = item.children
            ? [...item.children, element]
            : [element];
          item.children = item.children.filter(
            (value, index_, self) =>
              index_ === self.findIndex((t) => t[idfield] === value[idfield])
          );
          deleted.push(index);
        }
      }
      if (item.children) {
        nested(item.children);
      }
    }
  };
  nested(accessArray);
  deleted = deleted.filter(
    (value, index, self) => index === self.indexOf(value)
  );
  // console.log("-----------deleted", deleted);
  accessArray = accessArray.filter((_, index) => {
    return !deleted.includes(index);
  });
  return accessArray;
};

const nestedChild = (accessArray, fieldName = "parentId", idField = "id") => {
  const nested = (items) => {
    for (const item of items) {
      for (const element of accessArray) {
        if (item[idField] === element[fieldName]) {
          item.children = item.children
            ? [...item.children, element]
            : [element];
        }
      }
      if (item.children) {
        nested(item.children);
      }
    }
  };
  const filtered = accessArray.filter((item) => item[fieldName] === "");
  for (const element of filtered) {
    nested(element);
  }
  nested(filtered);
  return filtered;
};

const getCurrentDate = (delemeter = "-", date) => {
  var today = date ? new Date(data) : new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + delemeter + dd + delemeter + yyyy;
  return today;
};

const getApplicableMonths = (startMonth, tagMonth) => {
  tagMonth = tagMonth.toUpperCase();
  startMonth = startMonth - 1;
  const showingmonghts = [];
  const tagMonthIndex = MONTHS.indexOf(tagMonth);
  if ((startMonth > 0) & (tagMonthIndex >= startMonth)) {
    for (let i = 0; i < startMonth; i++) {
      showingmonghts.push(MONTHS[i]);
    }
  }
  if (tagMonthIndex < startMonth) {
    for (let i = tagMonthIndex; i < startMonth; i++) {
      showingmonghts.push(MONTHS[i]);
    }
    return showingmonghts;
  }
  for (let i = tagMonthIndex; i < MONTHS.length; i++) {
    showingmonghts.push(MONTHS[i]);
  }
  return showingmonghts;
};

const sessionMonths = (sessionStartMonth) => {
  let flag = false
  let sessionMonths = []
  for(let i=0;i<MONTHS.length;i++){
    if(sessionStartMonth == i){
      flag = true;
    }
    if(flag){
      sessionMonths.push(MONTHS[i])
    }
  }
  if(sessionStartMonth > 0 && sessionMonths.length>0){
    let remainMonths = MONTHS.slice(0, sessionStartMonth)
    for(let i=0;i<remainMonths.length;i++){
      sessionMonths.push(remainMonths[i]);
    }
  }
  return sessionMonths
}

const getInactiveApplicableMonths = (sessionStartMonth, inactiveStartMonth, leftMonth) => {
  sessionStartMonth = sessionStartMonth - 1;
  inactiveStartMonth = inactiveStartMonth.toUpperCase();
  leftMonth = leftMonth.toUpperCase();
  const monthsDetail = sessionMonths(sessionStartMonth)
  const showingMonths = [];
  let isActiveRange = false;
  for (let i = 0; i < monthsDetail.length; i++) {
    if (monthsDetail[i] === inactiveStartMonth) {
      isActiveRange = true;
    }

    if (monthsDetail[i] === leftMonth) {
      break;
    }

    if (isActiveRange) {
      showingMonths.push(monthsDetail[i]);
    }

  }
  return showingMonths;
};

function calculateDaysDifference(startDateStr, endDateStr) {
  // Parse the dates using moment.js
  const startDate = moment(startDateStr, 'YYYY-MM-DD');
  const endDate = moment(endDateStr, 'YYYY-MM-DD');

  // Check if endDate is after startDate
  if (endDate.isBefore(startDate)) {
    throw new Error('endDate must be after startDate');
  }

  // Start of day to avoid any time discrepancies
  const startOfDayStartDate = startDate.startOf('day');
  const startOfDayEndDate = endDate.startOf('day');

  // Calculate the days difference
  const daysDifference = startOfDayEndDate.diff(startOfDayStartDate, 'days');

  return daysDifference;
}

module.exports = {
  numberToWord,
  toSnakeCase,
  nestedChild,
  roleAccessNested,
  getCurrentDate,
  getApplicableMonths,
  getInactiveApplicableMonths,
  calculateDaysDifference
};
