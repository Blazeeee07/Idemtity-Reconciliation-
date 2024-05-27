const qs = require("qs");
const { https } = require("follow-redirects");
const moment = require("moment-timezone");
const { twoFactorKey } = require("../config/config");
const logger = require("../config/logger");
const { messageCountService, monthService } = require("../services");
const { decrypt } = require("./encrypt");
const { response } = require("express");

function handleEvents(options) {
  return https.request(options, function (response) {
    const chunks = [];

    response.on("data", function (chunk) {
      chunks.push(chunk);
    });

    response.on("end", function (chunk) {
      const body = Buffer.concat(chunks);
      logger.info(body.toString());
    });

    response.on("error", function (error) {
      logger.info(error);
    });
  });
}

async function sendSMSForBirthday(values) {
  logger.info("Sending Birthday Wish");
  const { firstName: studentName,name,  school, phone, sessionId, schoolId } = values;
  const date = moment().format("YYYY-MM-DD")
  const params = { schoolId: schoolId, sessionId: sessionId, date: date, type: "Birthday SMS", platform: "SMS"}
  const msg = `Dear ${studentName? studentName : name} ,Wishing you a birthday filled with sweet moments and wonderful memories to cherish always! Happy Birthday. Regards ${school?.name}. Powered by MyLeading Campus -School Management ERP managed by (snowball innovations) www.myleadingcampus.com`
  const options = {
    method: "POST",
    hostname: "2factor.in",
    template: "Birthday_greetings",
    path: "/API/R1/",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    maxRedirects: 20,
  };
  let count = 0
  if(msg.length > 100){
    count = 2
  }else{
    count++
  }
  let currentMonth = moment().format("MMMM")
  const monthName = await monthService.get()
  let month = monthName.find(m => m.month === (currentMonth.toUpperCase()))
  console.log(month, currentMonth)
  let monthId = month.id
  let existingCount = await messageCountService.getByParams(params)
  if(existingCount){
    existingCount.count += count
    await messageCountService.updateById(decrypt(existingCount.id), existingCount)
  }else {
    const body = {
      count: count,
      type: 'Birthday SMS',
      platform: 'SMS',
      sessionId: sessionId,
      schoolId: schoolId,
      date: date,
      monthId: decrypt(monthId)
    }
    await messageCountService.create(body)
  }
  const request = handleEvents(options);

  const postData = qs.stringify({
    module: "TRANS_SMS",
    apikey: `${twoFactorKey}`,
    to: `91${phone}`,
    from: "MLCERP",
    msg: msg,
  });

  request.write(postData);
  request.end();
}

function sendSMSForOTP(phone, otp) {
  logger.info("Sending Otp");
  try {
    const options = {
      // method: "GET",
      // hostname: "2factor.in",
      // path: `/API/V1/${twoFactorKey}/SMS/+91${phone}/${otp}/OTPLOGIN`,
      // headers: {},
      method: "POST",
      hostname: "2factor.in",
      template: "SIGNUP_OTP",
      path: "/API/R1/",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      maxRedirects: 20,
    };

    const request = handleEvents(options);

    const postData = qs.stringify({
      module: "TRANS_SMS",
      apikey: `${twoFactorKey}`,
      to: `91${phone}`,
      from: "MLCERP",
      msg: `Dear user, OTP for phone verification is ${otp}, www.myleadingcampus.com managed by Snowball Innovations.`
    })

    request.write(postData)

    request.end();
  } catch (error) {
    logger.error(error);
  }
}

async function sendSMSforReminder(values) {
  const { firstName: studentName, School, phone, feesDueMonths, schoolId, sessionId } = values;
  const date = moment().format("YYYY-MM-DD")
  const params = { schoolId: schoolId, sessionId: sessionId, date: date, type: "Reminder SMS", platform: "SMS"}
  const months = `${feesDueMonths[0]} to ${feesDueMonths[feesDueMonths.length-1]}`
  const schoolName = School.name;
  const msg = `Dear Parent, kindly pay the due fees for your ward ${studentName}, for the month of ${months}.please ignore if already paid. Regards ${schoolName}- powered by MLC ERP`

  const options = {
    method: "POST",
    hostname: "2factor.in",
    path: "/API/R1/",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    maxRedirects: 20,
  };

  let count = 0
  if(msg.length > 100){
    count = 2
  }else{
    count++
  }
  let currentMonth = moment().format("MMMM")
  const monthName = await monthService.get()
  let month = monthName.find(m => m.month === (currentMonth.toUpperCase()))
  console.log(month, currentMonth)
  let monthId = month.id
  let existingCount = await messageCountService.getByParams(params)
  if(existingCount){
    existingCount.count += count
    await messageCountService.updateById(decrypt(existingCount.id), existingCount)
  }else {
    const body = {
      count: count,
      type: 'Reminder SMS',
      platform: 'SMS',
      sessionId: params.sessionId,
      schoolId: params.schoolId,
      date: params.date,
      monthId: decrypt(monthId)
    }
    await messageCountService.create(body)
  }

  const request = handleEvents(options);

  const postData = qs.stringify({
    module: "TRANS_SMS",
    apikey: `${twoFactorKey}`,
    to: `91${phone}`,
    from: "MLCERP",
    msg: msg,
  });

  request.write(postData);

  request.end();
}

async function sendSMSforAbsent(values, schoolId, sessionId, date) {
  const { first_name, school_name, phone } = values;
  const params = {schoolId:schoolId, sessionId:sessionId, date:date, type: "Absent SMS", platform: "SMS"}
  const today = moment().format("YYYY-MM-DD");
  const msg = `Dear parent, This is to inform you that ${first_name} is absent today on ${today}-Regards ${school_name}. MyLeading Campus(www.myleadingcampus.com) managed by Snowball Innovations`
  const options = {
    method: "POST",
    hostname: "2factor.in",
    path: "/API/R1/",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    maxRedirects: 20,
  };
  let count = 0
  if(msg.length > 100){
    count = 2
  }
  let currentMonth = moment().format("MMMM")
  const monthName = await monthService.get()
  let month = monthName.find(m => m.month === (currentMonth.toUpperCase()))
  console.log(month, currentMonth)
  let monthId = month.id
  let existingCount = await messageCountService.getByParams(params)
  if(existingCount){
    existingCount.count += count
    await messageCountService.updateById(decrypt(existingCount.id), existingCount)
  }else {
    const body = {
      count: count,
      type: 'Absent SMS',
      platform: 'SMS',
      sessionId: params.sessionId,
      schoolId: params.schoolId,
      date: params.date,
      monthId: decrypt(monthId)
    }
    await messageCountService.create(body)
  }

  const request = handleEvents(options);

  const postData = qs.stringify({
    module: "TRANS_SMS",
    apikey: `${twoFactorKey}`,
    to: `91${phone}`,
    from: "MLCERP",
    msg: msg,
  });

  request.write(postData);

  request.end();
}

async function sendSMSforAbsentSubjectwise(values, subjectName, schoolId, sessionId, date) {
  const { first_name, school_name, phone } = values;
  const today = moment().format("YYYY-MM-DD");
  const params = {schoolId:schoolId, sessionId:sessionId, date:date, type: "Absent SMS", platform: "SMS"}
  const msg = `Dear ${first_name}, this is to inform you that you were marked as absent in ${subjectName} subject on ${today} . Regards ${school_name} . Powered by MyLeading Campus managed by Snowball Innovations.`
  const options = {
    method: "POST",
    hostname: "2factor.in",
    path: "/API/R1/",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    maxRedirects: 20,
  };
  let count = 0
  if(msg.length > 100){
    count = 2
  }
  let currentMonth = moment().format("MMMM")
  const monthName = await monthService.get()
  let month = monthName.find(m => m.month === (currentMonth.toUpperCase()))
  console.log(month, currentMonth)
  let monthId = month.id
  let existingCount = await messageCountService.getByParams(params)
  if(existingCount){
    existingCount.count += count
    await messageCountService.updateById(decrypt(existingCount.id), existingCount)
  }else {
    const body = {
      count: count,
      type: 'Absent SMS',
      platform: 'SMS',
      sessionId: params.sessionId,
      schoolId: params.schoolId,
      date: params.date,
      monthId: decrypt(monthId)
    }
    await messageCountService.create(body)
  }

  const request = handleEvents(options);

  const postData = qs.stringify({
    module: "TRANS_SMS",
    apikey: `${twoFactorKey}`,
    to: `91${phone}`,
    from: "MLCERP",
    msg: msg,
  });

  request.write(postData);

  request.end();
}

async function sendSMSforAbsentEmployee(values, schoolId, sessionId, date,){
  const { name, school_name, phone } = values;
  const params = {schoolId:schoolId, sessionId:sessionId, date:date, type: "EMP Absent SMS", platform: "SMS"}
  const today = moment().format("YYYY-MM-DD");
  const msg = `Dear ${name}, you are marked absent on ${today} , Regards ${school_name}. Powered by MLC ERP, Snowball Innovations`
  const options = {
    method: "POST",
    hostname: "2factor.in",
    path: "/API/R1/",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    maxRedirects: 20,
  };

  let count = 0
  if(msg.length > 100){
    count = 2
  }else {
    count++
  }
  let currentMonth = moment().format("MMMM")
  const monthName = await monthService.get()
  let month = monthName.find(m => m.month === (currentMonth.toUpperCase()))
  let monthId = month.id
  let existingCount = await messageCountService.getByParams(params)
  if(existingCount){
    existingCount.count += count
    await messageCountService.updateById(decrypt(existingCount.id), existingCount)
  }else {
    const body = {
      count: count,
      type: 'EMP Absent SMS',
      platform: 'SMS',
      sessionId: params.sessionId,
      schoolId: params.schoolId,
      date: params.date,
      monthId: decrypt(monthId)
    }
    await messageCountService.create(body)
  }

  const request = handleEvents(options);

  const postData = qs.stringify({
    module: "TRANS_SMS",
    apikey: `${twoFactorKey}`,
    to: `91${phone}`,
    from: "MLCERP",
    msg: msg
  });

  request.write(postData);

  request.end();
}

async function sendSmsForHandedOver(values) {
  const { name, mobile, schoolId, sessionId } = values;
  const today = moment().format("YYYY-MM-DD");
  const params = {schoolId:schoolId, sessionId:sessionId, date:today, type: "Handover SMS", platform: "SMS"}
  const options = {
    method: "POST",
    hostname: "2factor.in",
    path: "/API/R1/",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    maxRedirects: 20,
  };

  let count = 0
  if(msg.length > 100){
    count = 2
  }else {
    count++
  }
  let currentMonth = moment().format("MMMM")
  const monthName = await monthService.get()
  let month = monthName.find(m => m.month === (currentMonth.toUpperCase()))
  let monthId = month.id
  let existingCount = await messageCountService.getByParams(params)
  if(existingCount){
    existingCount.count += count
    await messageCountService.updateById(decrypt(existingCount.id), existingCount)
  }else {
    const body = {
      count: count,
      type: 'Hand Over SMS',
      platform: 'SMS',
      sessionId: params.sessionId,
      schoolId: params.schoolId,
      date: params.date,
      monthId: decrypt(monthId)
    }
    await messageCountService.create(body)
  }

  const request = handleEvents(options);

  const postData = qs.stringify({
    module: "TRANS_SMS",
    apikey: `${twoFactorKey}`,
    to: `91${mobile}`,
    from: "MLCERP",
    msg: `Dear ${name} we have send your certificate`,
  });

  request.write(postData);

  request.end();
}

module.exports = {
  sendSMSForOTP,
  sendSMSforReminder,
  sendSMSforAbsent,
  sendSMSforAbsentSubjectwise,
  sendSmsForHandedOver,
  sendSMSforAbsentEmployee,
  sendSMSForBirthday
};
