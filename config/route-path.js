
const routePath = {
  // school: "/school",
  // student: "/student",
  // setup: "/setup",
  // file: "/file",
  // fee: "/fee",
  // concession: "/concession",
  // tag: "/tag",
  // latefine: "/latefine",
  // payment: "/payment",
  // app: "/app",
  // subject: "/subject",
  // exam: "/exam",
  // mark: "/mark",
  // attendance: "/attendance",
  // module: "/module",
  // role: "/role",
  // roleUserModuleAccess: "/role-user-module-access",
  // employee: "/employee",
  // user: "/user",
  // day: "/day",
  // month: "/month",
  // leave: "/leave",
  // salary: "/addSalary",
  // department: "/addDepartment",
  // designation: "/addDesignation",
  // employeeType: "/addEmployeeType",
  // college: "/college",
  // collegeDepartment: "/college-department",
  // schedule: "/schedule",
  // period: "/period",
  // session: "/session",
  // leaveManage: "/leave-manage",
  // specialization: "/specialization",
  // assingSpecialization: "/assing-specialization",
  // certificate: "/certificate",
  // employeeAttendance: "/employee-attendance",
  // busRoute: "/bus-route",
  // assignBus: "/assign-bus",
  // studentAuth: "/student-auth",
  // hostel: "/hostel",
  // hostelFee: "/hostel-fee",
  // otherFee: "/other-fee",
  // house: "/house",
  // event: "/events",
  // eventResult:"/event-result",
  // assignHostel:"/assign-hostel",
  // assignHouse:"/assign-house",
  // assignOtherFee:"/assign-other-fee",
  // canteen:"/canteen",
  // assignCanteen:"/assign-canteen",
  // assignmentAndNotices:"/assignment-notice",
  // order: "/order",
  // unregisteredStudent: "/unregistered-student",
  // stops:"/stops",
  // transportRoute: "/transport-route",
  // assignOtherFeeToUStudent: "/assign-other-fee-UStudent",
  // pushToken:"/push-token",
  // appNotification:"/notification",
  // salaryStructureConfig:"/salary-structure-config",
  // salaryStructure:"/employee-service/salary-structure",
  // notificationList:"/notification-list",
  // books:"/books",
  // assignBook: "/assign-book",
  // accountsParty: "/account-party",
  // expense: "/expense",
  // ledger: "/ledger",
  // studentBook: "/student-book",
  // messageCount: "/message-count",
  // onlineClass: "/online-class",
  // schoolApp: "/school-app",
  // analytics: "/analytics",
  // holiday: "/holiday",
  // birthday:"/birthday",
  // birthdayList:"/birthday-list",
  // branch:"/branch",
  contact:"/contact"
};

const accessesRouteList = {
  get data() {
    const list = [];
    for (const [value] of Object.entries(routePath)) {
      const object = {
        get path() {
          return value.slice(1);
        },
        get view() {
          return false;
        },
        get add() {
          return false;
        },
        get update() {
          return false;
        },
        get delete() {
          return false;
        },
      };
      list.push(object);
    }
    return list;
  },
};

module.exports = { routePath, accessesRouteList };
