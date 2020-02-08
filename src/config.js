// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
    logging: false,
 
    intentMap: {
       'AMAZON.StopIntent': 'END',
    },

    endpoint: "localhost/v1",
 
    db: {
         FileDb: {
             pathToFile: '../db/db.json',
         }
     },
 };
 