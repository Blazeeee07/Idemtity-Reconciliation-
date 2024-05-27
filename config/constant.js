const LEAVECONST = {
  STATUS: {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
  },
};
const CERTIFICATETYPE = {
  TC: 'TC',
  IC: "IC",
  CC: "CC",
  BC: "BC"

}

const CERTIFICATENAMES = {
  TC: 'Transfer Certificate',
  IC: "Income Certificate",
  CC: "Character Certificate",
  BC: "Bonafide Certificate"

}

const LOGINTYPES = {
  USER: 'user',
  STUDENT: 'student'
}

const ATTRIBUTES = {
  GETEMPLOYEE: ['id', 'name', 'email', 'phone', 'employeeCode', 'gender', 'profilePic'],
  EMPLOYEERELATAIONS: {
    LIST: {
      DEPARTMENT: ['name'],
      DESIGNATION: ['name']
    },
    BYID: {
      DEPARTMENT: ['id', 'name'],
      DESIGNATION: ['id', 'name'],
      EMPLOYEETYPE: ['id', 'employeeType'],
      SALARYSTRUCTURE: ['id', 'templateName'],
      LEAVETEMPLATE: ['id', 'leaveType'],
    },
  },
  STUDENTHISTORY: ['section', 'rollNumber', 'oldClassId', 'classId'],
  CLASS: ['className'],
  SALARYSTUCTURE: {
    SALARYSTRUCTURE_DETAILS: ["salaryStructureConfigId", "type", "salaryStructureId", "amount", "isPfApplied", "isEsiApplied"],
    SALARYSTRUCTURE_CONFIG: ["typePrettyName", "subTypePrettyName"]
  }
}

const CSV_HEADERS = {
  EMPLOYEE: [
    'EmployeeName', 'email', 'mobile', 'dob', 'Gender', 'Address', 'emergency_contact', 'aadhar', 'pan', 'accountNumber', 'bank', 'leavetemp', 'starttime', 'endtime', 'DOJ', 'Salarytemplate', 'designation', 'department', 'employeetype', 'ESI', 'PF', 'UAN'
  ]
}

module.exports = {
  LEAVECONST,
  CERTIFICATETYPE,
  CERTIFICATENAMES,
  LOGINTYPES,
  ATTRIBUTES,
  CSV_HEADERS
};
