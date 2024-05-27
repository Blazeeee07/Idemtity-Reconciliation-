const cron = require("node-cron");

const { sequelize } = require("../models");
const { Op } = require('sequelize')
const moment = require("moment-timezone");

const { File } = require("../models");
const { deleteFile } = require("../utils/aws-s3");
const logger = require("../config/logger");
// const { sendEmail } = require("../services/email.service");
const config = require("../config/config");

// const cronController = require("../controllers/attendance.controller");
const { decrypt } = require("../utils/encrypt");
const serverName =
  config.dashboardLink === "https://app.myleadingcampus.com"
    ? "DEV SEVER"
    : "PROD SEVER";

cron.schedule("0 13 * * *", async () => {
  const result = await sequelize.query(`SELECT 
     table_schema as ebdb, 
     table_name AS "Table", 
     round(((data_length + index_length) / 1024 / 1024), 2) "Size in MB"
FROM information_schema.TABLES 
ORDER BY (data_length + index_length) DESC;`);
  // send email notification
  // await sendEmail(
  //   "sagar@myleadingcampus.com",
  //   `${serverName}: DATABASE SIZE OF TABLES`,
  //   JSON.stringify(result, undefined, 2)
  // );
});

cron.schedule(
  "0 13 * * *",
  // "2 * * * * *",
  async () => {
    console.log('cron job started')
    // send email notification
    // await sendEmail(
    //   "sagar@myleadingcampus.com",
    //   `${serverName}: CRON JOB STARTED: DELETE FILES`,
    //   "Delete file CRON JOB started"
    // );
    try {
      logger.info("***** job started *****");
      // let files = await File.findAll({ raw: true });
      let regular = await File.findAll({
        where: {
          created_at: {
            [Op.lte]: moment().subtract(config.fileSettings.deletecondition.regular, 'days').toDate()
          },
          isPremium: false
        }
      })
      let premium = await File.findAll({
        where: {
          created_at: {
            [Op.lte]: moment().subtract(config.fileSettings.deletecondition.premium, 'days').toDate()
          },
          isPremium: true
        }
      })
      let files = [...regular, ...premium]
      if (files.length > 0) {
        files = files.map((file) => ({
          // Key: `school-name/${file.fileName}`,
          Key: decrypt(file.fileName),
        }));
        // files = files.map((file) => {
        //   logger.info(decrypt(file.fileName));
        // });
        
        await deleteFile(files);
        await File.destroy({
          where: {
            created_at: {
              [Op.lte]: moment().subtract(config.fileSettings.deletecondition.regular, 'days').toDate()
            },
            isPremium: false
          }
        });
        await File.destroy({
          where: {
            created_at: {
              [Op.lte]: moment().subtract(config.fileSettings.deletecondition.premium, 'days').toDate()
            },
            isPremium: true
          }
        });
      }
      logger.info("***** job completed *****");
    } catch (error) {
      logger.info(JSON.stringify(error, undefined, 2));
    }
  }
  // ,
  // {
  //   scheduled: false,
  //   timezone: "Asia/Kolkata",
  // }
);

// cron.schedule(
//   "0 */1 * * *",
//   async () => {
//     logger.info("***** cron job started *****");
//     let sessionId = 1
//     await cronController.bioMetricDataUpdates(sessionId);
//   }
// )
