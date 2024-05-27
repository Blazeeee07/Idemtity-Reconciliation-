const roleNames = {
  SUPERADMIN: 1,
  ADMIN: 2,
  TEACHER: 3,
  STUDENT: 4,
};

const allRoles = {
  1: [
    "manageSchool",
    "manageSchoolSetup",
    "manageStudent",
    "manageFiles",
    "feeManagement",
    "concessionManagement",
    "tagManagement",
    "managePayment",
    "manageSubject",
    "manageExam",
    "manageMark",
    "manageAttendance",
    "manageCollege",
    "manageCollegeStudent",
  ],
  2: [
    "manageSchool",
    "manageSchoolSetup",
    "manageStudent",
    "manageFiles",
    "feeManagement",
    "concessionManagement",
    "tagManagement",
    "managePayment",
    "manageSubject",
    "manageExam",
    "manageMark",
    "manageAttendance",
    "manageCollege",
    "manageCollegeStudent",
  ],
  3: [],
  4: [
    "manageSchool",
    "manageSchoolSetup",
    "manageStudent",
    "manageFiles",
    "feeManagement",
    "concessionManagement",
    "tagManagement",
    "managePayment",
    "manageSubject",
    "manageExam",
    "manageMark",
    "manageAttendance",
    "manageCollege",
    "manageCollegeStudent",
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
  roleNames,
};
