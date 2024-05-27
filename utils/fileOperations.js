const XLSX = require("xlsx");
const fs = require("node:fs");
const pdf = require("pdf-creator-node");
const logger = require("../config/logger");

function deleteFile(filePath) {
  fs.unlink(filePath, function (error) {
    if (error) {
      logger.info(`Error in deleting the file: ${error}.`);
    } else {
      logger.info(`Successfully deleted the file.`);
    }
  });
}

function readCsv(filePath, header) {
  const workbook = XLSX.readFile(filePath);
  const sheetNameList = workbook.SheetNames;
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]], {
    header,
    raw: false,
  });
}

function JsonTOSheet(response, data, hasUpdate = false, excelDetails) {
  const wb = XLSX.utils.book_new(); // create workbook
  let ws;
  if (hasUpdate) {
    ws = XLSX.utils.json_to_sheet(data, { origin: excelDetails.length + 1 }); // convert data to sheet
    XLSX.utils.sheet_add_aoa(ws, excelDetails, [{ origin: "A1" }]);
  } else {
    ws = XLSX.utils.json_to_sheet(data);
  }
  // convert data to sheet
  XLSX.utils.book_append_sheet(wb, ws, "users_sheet"); // add sheet to workbook

  const filename = `${Date.now()}.xlsx`;
  const wbOptions = { bookType: "xlsx", type: "binary" }; // workbook options
  XLSX.writeFile(wb, filename, wbOptions); // write workbook file
  response.writeHead(200, [
    [
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  ]);
  const stream = fs.createReadStream(filename, { emitClose: true });
  stream.on("end", function () {
    logger.info("data read successfully");
    stream.close();
  });
  stream.on("error", function () {
    logger.info("error in reading the data");
  });
  stream.on("data", function () {
    logger.info("receiving the data");
  });
  stream.on("close", function () {
    stream.destroy((error) => {
      if (error) {
        logger.info(`error in destroying the stream ${error}`);
      }
    });
    deleteFile(filename);
  }); // create read stream
  stream.pipe(response); // send to client
}

function formatPropertyNames(rawStudent, object) {
  for (const [key, value] of Object.entries(rawStudent)) {
    const result = key.replace(/([A-Z])/g, " $1");
    const finalPropertyName = result.charAt(0).toUpperCase() + result.slice(1);
    // eslint-disable-next-line no-param-reassign
    object[finalPropertyName] = value;
  }
  return object;
}

function jsonToPdf(
  response,
  data,
  template = "views/template.html",
  outputpath = "./output.pdf"
) {
  const options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
  };
  const html = fs.readFileSync(template, "utf8");
  const document = {
    html,
    data,
    path: outputpath,
    type: "",
  };
  pdf
    .create(document, options)
    .then((res) => {
      response.download(res.filename);
    })
    .catch((error) => {
      console.error(error);
    });
}

function getMarkSheet(response, data, other = [], passMark = 30) {
  const getRank = (array) => {
    let newArray = [...array]
    newArray.sort(function (a, b) { return b - a });
    let ranks = []
    for (let i = 0; i < array.length; i++) {
      ranks.push(newArray.indexOf(array[i]) + 1)
    }
    return ranks;
  }
  let header = ["Role", "Name"]
  let subHeader = ["", ""];
  let body = [];

  /////header an sub header part
  let subjectst = data[0]?.StudentExams[0]?.StudentExamSubjects;
  let cols = []
  let start = 1;
  // console.log(data[0])
  if(!subjectst) return response.send('No subjects to show.').status(400)
  for (let i = 0; i < subjectst.length; i++) {
    let merge = {};
    merge.start = start + 1;
    header.push(subjectst[i].Subject.name)
    if (subjectst[i].StudentExamSubjectTags.length > 1) {
      header.push(...Array(subjectst[i].StudentExamSubjectTags.length).fill(''))
      merge.end = merge.start + subjectst[i].StudentExamSubjectTags.length;
    } else {
      header.push(...Array(subjectst[i].StudentExamSubjectTags.length - 1).fill(''))
      merge.end = merge.start;
    }

    start = merge.end
    if (subjectst[i].StudentExamSubjectTags.length > 0) {
      subjectst[i].StudentExamSubjectTags.forEach(item => {
        subHeader = [...subHeader, item.SubjectTag.name]
      })
      if (subjectst[i].StudentExamSubjectTags.length > 1) {
        subHeader = [...subHeader, "Total"]
      }
    }
    cols.push(merge)
  }
  header.push("Total Marks")
  // header.push("Percentage")
  // header.push("Result")
  header.push("Rank")
  let ranks = []
  ///// body part
  for (let i = 0; i < data.length; i++) {
    let row = [data[i].rollNumber, data[i].firstName]
    let subjectst = data[i]?.StudentExams[0]?.StudentExamSubjects
    let grandTotal = 0;
    if(!subjectst) break;
    for (let j = 0; j < subjectst.length; j++) {

      if (subjectst[j].StudentExamSubjectTags.length > 0) {
        if (subjectst[j].StudentExamSubjectTags.length > 1) {
          subjectst[j].StudentExamSubjectTags.forEach(item => {
            row = [...row, item.marks || 0]
          })
          let total = subjectst[j].StudentExamSubjectTags.reduce(function (acc, obj) { return acc + obj.marks; }, 0);
          row = [...row, total]
          grandTotal += total;
        }
        else {
          row = [...row, subjectst[j].StudentExamSubjectTags[0].grade]
        }

      }

    }
    const subjectCountForPercentage = subjectst.filter(i => !i.Subject.isGraded).length;
    let percentage = subjectCountForPercentage ? grandTotal / subjectCountForPercentage : 0
    row = [...row, grandTotal]
    // row = [...row, `${percentage.toFixed(2)} %`]
    // row = [...row, percentage > passMark ? 'P' : 'F']
    body = [...body, row]
    ranks = [...ranks, percentage]
  }

  ranks = getRank(ranks)
  ranks.forEach((item, i) => {
    body[i].push(item)
  })

  const wb = XLSX.utils.book_new(); // create workbook
  let ws;

  ws = XLSX.utils.json_to_sheet([], { origin: [header].length, skipHeader: true });
  XLSX.utils.sheet_add_aoa(ws, [...other, header, subHeader, ...body], [{ origin: "A1" }]);
  const merge = cols.map(item => {
    return { s: { r: other.length, c: item.start }, e: { r: other.length, c: item.end } }
  })

  ws["!merges"] = merge;
  // convert data to sheet
  XLSX.utils.book_append_sheet(wb, ws, "users_sheet"); // add sheet to workbook

  const filename = `${Date.now()}.xlsx`;
  const wbOptions = { bookType: "xlsx", type: "binary" }; // workbook options
  XLSX.writeFile(wb, filename, wbOptions); // write workbook file
  response.writeHead(200, [
    [
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  ]);
  const stream = fs.createReadStream(filename, { emitClose: true });
  stream.on("end", function () {
    logger.info("data read successfully");
    stream.close();
  });
  stream.on("error", function () {
    logger.info("error in reading the data");
  });
  stream.on("data", function () {
    logger.info("receiving the data");
  });
  stream.on("close", function () {
    stream.destroy((error) => {
      if (error) {
        logger.info(`error in destroying the stream ${error}`);
      }
    });
    deleteFile(filename);
  }); // create read stream
  stream.pipe(response); // send to client
}

const getSpecializationSheet = (response, data, other = []) => {
  let header = [["", "", "SUBJECTWISE ATTENDANCE REPORT"]]
  let columnSeperatorCount = 2
  // header.unshift(...Array(10).fill(' '))
  let subHeader = [];

  let body = [];
  let specializations = []
  specializations.push(...Array(2).fill(' '))
  data.specialization.forEach(item => {
    // specializations.push(...Array(item.Subjects.length ? (item.Subjects.length - 1) : 0).fill(''))
    specializations.push(item.name)
    specializations.push(...Array(item.Subjects.length ? ((item.Subjects.length) * 3) - 1 : 0).fill(''))
  })
  body.push(specializations)
  console.log(body)
  let specializationSubjects = []
  let specializationCount = []
  specializationSubjects.push(...Array(columnSeperatorCount).fill(' '))
  specializationCount.push(...['Roll', 'Student Name'])
  data.specialization.forEach(item => {
    item.Subjects.forEach(subject => {
      specializationSubjects.push(subject.name)
      specializationCount.push(...['TC', 'CA', '%'])
      specializationSubjects.push(...Array(columnSeperatorCount).fill(''))
    })
  })

  const students = []
  data.assignSpecialization.forEach(item => {
    const studentAttendance = [item.rollNumber, item.studentName]
    data.specialization.forEach(specialization => {
      specialization.Subjects.forEach(subject => {
        const attendancecount = item.specializationAttendance[subject.id]
        if (attendancecount) {
          studentAttendance.push(...[attendancecount.total, attendancecount.present, attendancecount.total ? ((attendancecount.present * 100) / attendancecount.total) : 0])
        }
        else {
          studentAttendance.push(...[0, 0, 0])
        }
      })
    })
    students.push(studentAttendance)
  })
  /////header an sub header part
  let cols = [
    // {
    //   start: 0,
    //   end: 1
    // },
    // {
    //   start: 10,
    //   end: 15
    // }
  ]
  let start = 1;

  const wb = XLSX.utils.book_new(); // create workbook
  let ws;

  ws = XLSX.utils.json_to_sheet([], { origin: [header].length, skipHeader: true });
  const merge = cols.map(item => {
    return { s: { r: other.length, c: item.start }, e: { r: other.length, c: item.end } }
  })

  ws["!merges"] = merge;
  XLSX.utils.sheet_add_aoa(ws, [...other, ...header, ...body, ...[specializationSubjects], ...[specializationCount], ...students], [{ origin: "A1" }]);

  // convert data to sheet
  XLSX.utils.book_append_sheet(wb, ws, "users_sheet"); // add sheet to workbook

  const filename = `${Date.now()}.xlsx`;
  const wbOptions = { bookType: "xlsx", type: "binary" }; // workbook options
  XLSX.writeFile(wb, filename, wbOptions); // write workbook file
  response.writeHead(200, [
    [
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  ]);
  const stream = fs.createReadStream(filename, { emitClose: true });
  stream.on("end", function () {
    logger.info("data read successfully");
    stream.close();
  });
  stream.on("error", function () {
    logger.info("error in reading the data");
  });
  stream.on("data", function () {
    logger.info("receiving the data");
  });
  stream.on("close", function () {
    stream.destroy((error) => {
      if (error) {
        logger.info(`error in destroying the stream ${error}`);
      }
    });
    deleteFile(filename);
  }); // create read stream
  stream.pipe(response); // send to client
}


module.exports = {
  readCsv,
  deleteFile,
  JsonTOSheet,
  formatPropertyNames,
  jsonToPdf,
  getMarkSheet,
  getSpecializationSheet
};
