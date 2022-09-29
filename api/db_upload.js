import { config } from "dotenv";
config();
import mongoose from "mongoose";
import csvParser from "csv-parser";
import { createReadStream } from "fs";
import events from "events";
import moment from "moment/moment.js";
import { Users } from "./schema.js";

console.log();

const csvFileRead = new events.EventEmitter();

const handleError = (err) => {
  console.log(`[Error]: ${err.message}`);
  process.exit(1);
};

const FILE_PATH = process.env.CSV_FILE_PATH;
const DB_URL = process.env.DB_URL;

if (!FILE_PATH) {
  console.log(`[Error]: CSV_FILE_PATH is reqired`);
  process.exit(1);
}
if (!DB_URL) {
  console.log(`[Error]: DB_URL  is reqired`);
  process.exit(1);
}

let userList = [];

createReadStream(FILE_PATH)
  .pipe(
    csvParser({
      separator: ";",
      mapHeaders: ({ header }) => {
        return header.toLowerCase();
      },
      mapValues: ({ header, index, value }) => {
        if (header === "date") {
          return moment(value, "DD/MM/YYYY hh:mm").toDate();
        }
        if (header === "changes") {
          return Number.parseInt(value);
        }
        return value;
      },
    })
  )
  .on("data", (chuck) => {
    userList.push(chuck);
  })
  .on("close", () => {
    console.log(`Read data from csv file done...`);
    console.log({ user: userList.slice(0, 4) });
    csvFileRead.emit("createdb");
  })
  .on("error", handleError);

//upload user in database;
csvFileRead.addListener("createdb", () => {
  console.log("conneting to database...");
    mongoose.connect(DB_URL);
    Users.create(userList.slice(1))
      .then((res) => {
        console.log(`[Success]: added ${res.length} record in database`);
      })
      .catch(handleError)
      .finally(() => {
        mongoose.disconnect((err) => {
          if (err) {
            handleError(err);
          } else {
            console.log(`[Exit]: closed the db connection`);
            process.exit(0);
          }
        });
      });
});
