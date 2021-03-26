var moment = require('moment');  

module.exports ={

  formatStdout: function formatStdout(stdout, dateTimeFormat, simple){
    
    var lineCount = (stdout.match(/[\r\n]/g)||[]).length;
    var dateTime = stdout.split("-")[0];
    var dateTime = dateTime.substring(0, dateTime.length);

    if (dateTimeFormat !== "") {

        console.log(dateTime)
        console.log(dateTimeFormat);
        console.log(stdout);

        dateTime = moment(dateTime).format(dateTimeFormat).toString();
    }

    if (lineCount == 1) {

        if (simple == "true") {
            var simpleStdout = stdout.replace(/\b\w{66}\b/g, "");

            console.log(simpleStdout);

            return dateTime + ' - ' + simpleStdout.match(/([^-]*),(.*)/);
        } else {

            return dateTime + ' - ' + stdout.match(/([^-]*),(.*)/);
        }
    } else if (lineCount > 1) {

        return lineCount + ' occurences.';
    }
  },

}
