const csvTojson = require("csvtojson");
const jsonTocsv = require("json2csv").parse;
const bcrypt = require("bcrypt"); // for hashing
// referencing the filsystem so as to load files
const fileSystem = require("fs");

// loading the source file and converting to json
csvTojson({ ignoreEmpty: true })
  // csvTojson()
  .fromFile("./Team-Clutch.csv")
  .then((teamClutchNfts) => {
    //mapping through object array to generate CHIP-0007 compactible json
    const CHIP_0007 = teamClutchNfts.map((Nft) => {
      return JSON.stringify({
        format: "CHIP-0007",
        name: Nft.Filename,
        description: Nft.Description,
        minting_tool: "Team Clutch",
        sensitive_content: false,
        series_number: Nft.SerialNumber,
        series_total: 392,
        attributes: [
          {
            trait_type: "Gender",
            value: Nft.Gender,
          },
        ],
        collection: {
          name: "Zuri NFT Tickets for Free Lunch",
          id: Nft.UUID,
          attributes: [
            {
              type: "description",
              value: "Rewards for accomplishments during HNGi9",
            },
          ],
        },
      });
    });

    //looping through object array to generate hash it
    const hashed = teamClutchNfts.map(async (hash) => {
      const hashvalue = await bcrypt.hash(JSON.stringify({ hash }), 10);
      hash.HASH = hashvalue;
      //   console.log(hash);
      return hash;
    });
    Promise.all(hashed).then((values) => {
      //   console.log(values);

      // converting back to csv
      const csv = jsonTocsv(values, {
        fields: [
          "SerialNumber",
          "Filename",
          "Description",
          "Gender",
          "UUID",
          "HASH",
        ],
      });
      // save the new csv
      fileSystem.writeFile("./Team-Clutch.output.csv", csv, (err) => {});
    });

    console.log(CHIP_0007);
  });
