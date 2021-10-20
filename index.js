import API from './config.mjs'
import { request, gql } from 'graphql-request'
import PDFDocument from 'pdfkit-table'
import fs from 'fs'

/***
 * DATA PART
 */
const rawData = await request(API.url, API.query);

/**
 * PDF PART 
 */
const PATH_TO_PDF_FILE = './file.pdf'

const doc = new PDFDocument({font: 'Courier', margin: 30, size: 'A4'});

doc.pipe(fs.createWriteStream(PATH_TO_PDF_FILE)); // write to PDF


// add stuff to PDF here 

// Simple data dump 
// doc.fontSize(7);
// doc.text(JSON.stringify(rawData, null, 4), {
//     width: 410,
//     align: 'left'
//   }
// );

// table view 

// model data
const data = [];
rawData.launchesPast.forEach(d => {
    data.push([
        [d.mission_name, d.launch_site.site_name_long].join('/'),
        [d.rocket.rocket_name, `(${d.ships.lenght})`].join(), 
        d.launch_date_local
    ])
});

const table = {
    title: "SpaceX launches",
    subtitle: "some other info ",
    headers: [
        "Mission name", "Rocket", "date"],
    rows: data,
  };
  doc.table(table, { 
    // A4 595.28 x 841.89 (portrait) (about width sizes)
    width: 300,
    columnsSize: [ 200, 100, 100 ],
  }); 


// finalize the PDF and end the stream
doc.end();