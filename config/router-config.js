const { routePath } = require("./route-path");
// const schoolRoute = require("../routes/v1/school.route");
// const authRoute = require("../routes/v1/auth.route");
// const studentRoute = require("../routes/v1/student.route");
const documentationRoute = require("../routes/v1/documentation.route");
// const schoolSetupRoute = require("../routes/v1/schoolSetup.route");
// const feeRoute = require("../routes/v1/fee.route");
// const concessionRoute = require("../routes/v1/concession.route");
// const fileRoute = require("../routes/v1/file.route");
// const tagRoute = require("../routes/v1/tag.route");
// const lateFineRoute = require("../routes/v1/lateFine.route");
// const paymentRoute = require("../routes/v1/payment.route");
// const appRoute = require("../routes/v1/app.route");
// const subjectRoute = require("../routes/v1/subject.route");
// const examRoute = require("../routes/v1/exam.route");
// const markRoute = require("../routes/v1/mark.route");
// const attendanceRoute = require("../routes/v1/attendance.route");
// const moduleRoute = require("../routes/v1/module.route");
// const roleRoute = require("../routes/v1/role.route");
// const roleUserModuleAccessRoute = require("../routes/v1/roleUserModuleAccess.route");
// const employeeRoute = require("../routes/v1/employee.route");
// const userRoute = require("../routes/v1/user.route");
// const leaveTeamplateRoute = require("../routes/v1/leaveTemplate.route");
// const salaryStructureRoute = require("../routes/v1/salaryStrucutre.route");
// const departmentRoute = require("../routes/v1/department.route");
// const designationRoute = require("../routes/v1/designation.route");
// const employeeTypeRoute = require("../routes/v1/employeeType.route");

// const dayRoute = require("../routes/v1/day.route");
// const monthRoute = require("../routes/v1/month.route");
// const collegeRoute = require("../routes/v1/college.route")
// const collegeDepartmentRoute = require("../routes/v1/collegeDepartment.route")
// const scheduleRoute = require("../routes/v1/schedule.route")
// const periodRoute = require("../routes/v1/period.route")
// const sessionRoute = require("../routes/v1/session.route")
// const leaveRoute = require("../routes/v1/leave.route")
// const specializationRoute = require("../routes/v1/specialization.route")
// const assignSpecializationRoute = require("../routes/v1/assignSpecialization.route")
// const certificateRoute = require("../routes/v1/certificate.route")
// const employeeAttendanceRoute = require("../routes/v1/empAttendance.route")
// const busRouteRoute = require("../routes/v1/busRoute.route")
// const assignBusRoute = require("../routes/v1/assignBus.route")
// const studentAuthRoute = require("../routes/v1/studentAuth.route")
// const hostelRoute = require("../routes/v1/hostel.route")
// const hostelFeeRoute = require("../routes/v1/hostelFee.route")
// const otherFeeRoute = require("../routes/v1/otherFee.route")
// const houseRoute = require("../routes/v1/house.route")
// const eventRoute = require("../routes/v1/events.route")
// const eventResultRoute = require("../routes/v1/eventResult.route")
// const assignHostelRoute = require("../routes/v1/assignHostel.route")
// const assignHouseRoute = require("../routes/v1/assignHouse.route")
// const assignOtherFeeRoute = require("../routes/v1/assignOtherFee.route")
// const canteenRoute = require("../routes/v1/canteen.route")
// const assignCanteenRoute = require("../routes/v1/assignCanteen.route")
// const assignmentAndNoticeRoute = require("../routes/v1/assignmentAndNotice.route")
// const orderRoute = require("../routes/v1/order.route")
// const unregisteredStudentRoute = require("../routes/v1/unregisteredStudent.route")
// const stopsRoute = require("../routes/v1/stops.route")
// const transportRouteRoute = require("../routes/v1/transportRoute.route")
// const assignOtherFeeToUStudentRoute = require("../routes/v1/assignOtherFeeToUnregisteredStudent.route")
// const pushTokenRoute = require("../routes/v1/pushToken.route")
// const appNotificationRoute = require("../routes/v1/appNotification.route")
// const salaryStructureConfigRoute = require("../routes/v1/salaryStructureConfig.route")
// const salaryStructure = require("../routes/v1/employee/salaryStructure.route")
// const notificationListRoute = require("../routes/v1/notificationList.route")
// const bookRoute = require("../routes/v1/books.route")
// const assignBookRoute = require("../routes/v1/assignBook.route")
// const accountsPartyRoute = require("../routes/v1/accountsParty.route")
// const expenseRoute = require("../routes/v1/expense.route")
// const ledgerRoute = require("../routes/v1/ledger.route")
// const studentBookRoute = require("../routes/v1/studentBook.route")
// const messageCountRoute = require("../routes/v1/messageCount.route")
// const onlineClassRoute = require("../routes/v1/onlineClass.route")
// const schoolAppRoute = require("../routes/v1/schoolApp.route")
// const analyticsRoute = require("../routes/v1/analytics.route")
// const holidayRoute = require("../routes/v1/holiday.route")
// const birthdayRoute = require("../routes/v1/birthdayWish.route")
// const birthdayListRoute = require("../routes/v1/birthdayWishList.route")
// const branchRoute = require("../routes/v1/branch.route")
const contactRoute=require("../routes/v1/contacts.route")

const defaultRoutes = [
  // {
  //   path: "/auth",
  //   route: authRoute,
  // },
  // // {
  //   path: routePath.school,
  //   route: schoolRoute,
  // },
  // {
  //   path: routePath.student,
  //   route: studentRoute,
  // },
  // {
  //   path: routePath.setup,
  //   route: schoolSetupRoute,
  // },
  // {
  //   path: routePath.file,
  //   route: fileRoute,
  // },
  // {
  //   path: routePath.fee,
  //   route: feeRoute,
  // },
  // {
  //   path: routePath.concession,
  //   route: concessionRoute,
  // },
  // {
  //   path: routePath.tag,
  //   route: tagRoute,
  // },
  // {
  //   path: routePath.latefine,
  //   route: lateFineRoute,
  // },
  // {
  //   path: routePath.payment,
  //   route: paymentRoute,
  // },
  // {
  //   path: routePath.app,
  //   route: appRoute,
  // },
  // {
  //   path: routePath.subject,
  //   route: subjectRoute,
  // },
  // {
  //   path: routePath.exam,
  //   route: examRoute,
  // },
  // {
  //   path: routePath.mark,
  //   route: markRoute,
  // },
  // {
  //   path: routePath.attendance,
  //   route: attendanceRoute,
  // },
  // {
  //   path: routePath.module,
  //   route: moduleRoute,
  // },
  // {
  //   path: routePath.role,
  //   route: roleRoute,
  // },
  // {
  //   path: routePath.roleUserModuleAccess,
  //   route: roleUserModuleAccessRoute,
  // },
  // {
  //   path: routePath.employee,
  //   route: employeeRoute,
  // },
  // {
  //   path: routePath.user,
  //   route: userRoute,
  // },
  // {
  //   path: routePath.leave,
  //   route: leaveTeamplateRoute,
  // },
  // {
  //   path: routePath.salary,
  //   route: salaryStructureRoute,
  // },
  // {
  //   path: routePath.department,
  //   route: departmentRoute,
  // },
  // {
  //   path: routePath.designation,
  //   route: designationRoute,
  // },
  // {
  //   path: routePath.employeeType,
  //   route: employeeTypeRoute,
  // },
  // {
  //   path: routePath.month,
  //   route: monthRoute,
  // },
  // {
  //   path: routePath.day,
  //   route: dayRoute,
  // },
  // {
  //   path: routePath.college,
  //   route: collegeRoute,
  // },
  // {
  //   path: routePath.collegeDepartment,
  //   route: collegeDepartmentRoute
  // },
  // {
  //   path: routePath.schedule,
  //   route: scheduleRoute
  // },
  // {
  //   path: routePath.period,
  //   route: periodRoute
  // },
  // {
  //   path: routePath.session,
  //   route: sessionRoute
  // },
  // {
  //   path: routePath.leaveManage,
  //   route: leaveRoute
  // },
  // {
  //   path: routePath.specialization,
  //   route: specializationRoute
  // },
  // {
  //   path: routePath.assingSpecialization,
  //   route: assignSpecializationRoute
  // },
  // {
  //   path: routePath.certificate,
  //   route: certificateRoute
  // },
  // {
  //   path: routePath.employeeAttendance,
  //   route: employeeAttendanceRoute
  // },
  // {
  //   path: routePath.busRoute,
  //   route: busRouteRoute
  // },
  // {
  //   path: routePath.assignBus,
  //   route: assignBusRoute
  // },
  // {
  //   path: routePath.studentAuth,
  //   route: studentAuthRoute
  // },
  // {
  //   path: routePath.hostel,
  //   route: hostelRoute
  // },
  // {
  //   path: routePath.hostelFee,
  //   route: hostelFeeRoute
  // },
  // {
  //   path: routePath.otherFee,
  //   route: otherFeeRoute
  // },
  // {
  //   path: routePath.house,
  //   route: houseRoute
  // },
  // {
  //   path: routePath.event,
  //   route: eventRoute
  // },
  // {
  //   path: routePath.eventResult,
  //   route: eventResultRoute
  // },
  // {
  //   path: routePath.assignHostel,
  //   route: assignHostelRoute
  // },
  // {
  //   path: routePath.assignHouse,
  //   route: assignHouseRoute
  // },
  // {
  //   path: routePath.assignOtherFee,
  //   route: assignOtherFeeRoute
  // },
  // {
  //   path: routePath.canteen,
  //   route: canteenRoute
  // },
  // {
  //   path: routePath.assignCanteen,
  //   route: assignCanteenRoute
  // },
  // {
  //   path: routePath.assignmentAndNotices,
  //   route: assignmentAndNoticeRoute
  // },
  // {
  //   path: routePath.order,
  //   route: orderRoute
  // },
  // {
  //   path: routePath.unregisteredStudent,
  //   route: unregisteredStudentRoute
  // },
  // {
  //   path: routePath.stops,
  //   route: stopsRoute
  // },
  // {
  //   path: routePath.transportRoute,
  //   route: transportRouteRoute
  // },
  // {
  //   path: routePath.assignOtherFeeToUStudent,
  //   route: assignOtherFeeToUStudentRoute
  // },
  // {
  //   path: routePath.pushToken,
  //   route: pushTokenRoute
  // },
  // {
  //   path: routePath.appNotification,
  //   route: appNotificationRoute
  // },
  // {
  //   path: routePath.salaryStructureConfig,
  //   route: salaryStructureConfigRoute
  // },
  // {
  //   path: routePath.notificationList,
  //   route: notificationListRoute
  // },
  // {
  //   path: routePath.books,
  //   route: bookRoute
  // },
  // {
  //   path: routePath.assignBook,
  //   route: assignBookRoute
  // },
  // {
  //   path: routePath.accountsParty,
  //   route: accountsPartyRoute
  // },
  // {
  //   path: routePath.expense,
  //   route: expenseRoute
  // },
  // {
  //   path: routePath.salaryStructure,
  //   route: salaryStructure
  // },
  // {
  //   path: routePath.ledger,
  //   route: ledgerRoute
  // },
  // {
  //   path: routePath.studentBook,
  //   route: studentBookRoute
  // },
  // {
  //   path: routePath.messageCount,
  //   route: messageCountRoute
  // },
  // {
  //   path: routePath.onlineClass,
  //   route: onlineClassRoute
  // },
  // {
  //   path: routePath.schoolApp,
  //   route: schoolAppRoute
  // },
  // {
  //   path: routePath.analytics,
  //   route: analyticsRoute
  // },
  // {
  //   path: routePath.holiday,
  //   route: holidayRoute

  // },
  // {
  //   path: routePath.birthday,
  //   route: birthdayRoute
  // },
  // {
  //   path: routePath.birthdayList,
  //   route: birthdayListRoute
  // },
  // {
  //   path: routePath.branch,
  //   route: branchRoute
  // },
  {
    path: routePath.contact,
    route: contactRoute
  }
];

const developmentRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: documentationRoute,
  },
];

module.exports = { defaultRoutes, developmentRoutes };
