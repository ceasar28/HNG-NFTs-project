const csvTojson = require("csvtojson");
const jsonTocsv = require("json2csv").parse;
const bcrypt = require("bcrypt"); // for hashing
// referencing the filsystem so as to load files
const fileSystem = require("fs");

csvTojson({ ignoreEmpty: true })
  // csvTojson()
  .fromFile("./Team-Clutch.output.csv")
  .then((teamClutchNfts) => {
    //mapping through object array to check if the nft is valid
    const Valid = teamClutchNfts.map(async (Nft) => {
      const isValid = await bcrypt.compare(JSON.stringify({ Nft }), Nft.HASH);
      console.log(isValid);
      if (isValid) {
        Nft.VALID = "valid";
        return Nft;
      }
      Nft.VALID = "invalid";
      return Nft;
    });
    Promise.all(Valid).then((values) => {
      const csv = jsonTocsv(values, {
        fields: [
          "SerialNumber",
          "Filename",
          "Description",
          "Gender",
          "UUID",
          "HASH",
          "VALID",
        ],
      });
      // save the new csv
      fileSystem.writeFile("./Valdid.output.csv", csv, (err) => {});
    });
  });
