let express = require("express");
let app = express();
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
let moment = require("moment");

const data = require('./data/flight-order.json');

data.items.onward = data.items.flights.filter(f => !f.isReturn);
data.items.rt = data.items.flights.filter(f => f.isReturn);
data.items.moment = moment;
delete data.items.flights

app.get("/", (req, res) => { 
    app.set('view engine', 'ejs');
    res.render('report-template.ejs', data.items);
})

app.get("/generateReport", (req, res) => {
    ejs.renderFile(path.join(__dirname, './views/', "report-template.ejs"), data.items, (err, data) => {
    if (err) {
          res.send(err);
    } else {
        let options = {
            "height": "11.25in",
            "width": "8.5in",
            "border": 20,
            "header": {
                "height": "30mm"
            },
            "footer": {
                "height": "20mm"
            }
        };
        pdf.create(data, options).toFile("report.pdf", function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send("File created successfully");
            }
        });
    }
});
})
app.listen(3000);