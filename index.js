const AWS = require("aws-sdk");

require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

var s3 = new AWS.S3();

var bucketParams = {
  Bucket: "stellar.health.test.stephen.timko",
  Key: "patients.log"
};

s3.getObject(bucketParams, function(err, data) {
  if (err) console.log(err, err.stack);
  else {
    const string = Buffer.from(data.Body).toString("ascii");

    const processedString = string.replace(
      /(\d{2}|\d{1})([\/.-])(\d{2}|\d{1})\2(\d{4})(\s+)?|(\w+\s)\d(th|rd|nd|st)?\s(\d{4})/g,
      (match, p1, p2, p3, p4, p5, p6, p7, p8) => {
        const year = p4 || p8;
        return `X/X/${year}`;
      }
    );

    upload(processedString);
  }
});

const upload = string => {
  var params = {
    Bucket: "stellar.health.test.stephen.timko",
    Body: Buffer.from(string, "utf8"),
    Key: "patients_dob_cleaned.log"
  };

  s3.upload(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    }

    if (data) {
      console.log("Uploaded in:", data.Location);
    }
  });
};
