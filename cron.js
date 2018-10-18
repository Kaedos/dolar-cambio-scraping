const cron = require('node-cron');
const cheerio = require('cheerio');
const request = require('request');
const mysql = require('mysql');
const nodemailer = require("nodemailer");


cron.schedule("* * * * *", function() {
    console.log("cron corriendo ");
    console.log('Obteniendo valor del dolar');

    request ("http://www.bch.hn/", (err,re, body) => {
      if (!err && re.statusCode == 200) {
        var $ = cheerio.load(body);
        console.log('Se ha refrescado la pagina :v');
    }
       var category = $('li').filter(function() {
        return $(this).text().indexOf('HNL por USD:' ) > -1;     
    }).text().split(': ')[1];
    
    
    if (!category){
        console.log('no hay valor del dolar');

        nodemailer.createTestAccount((err, account) => {

            let transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "", // generated ethereal user
                    pass:  "" // generated ethereal password
                }
            });
        
            let mailOptions = {
                from: "ALERTA,PELIGRO!!! <infoerror@gmail.com ",
                to: "juanfilpz@gmail.com",
                subject: `ERRORES`,
                text: `EL SERVIDOR SE VA A MAMAR OKNO, NO SE ESTA ACTUALIZANDO EL VALOR DEL DOLAR, PORQUE MODIFICACRON LA PAGINA DEL B.C, PONGASE VIVO A ARREGLARLO`
            };

            let mail = {
                from: "ALERTA,PELIGRO!!!<infoerror@gmail.com",
                to: "kaedoszio@gmail.com",
                subject: `ERRORES`,
                text: `EL SERVIDOR SE VA A MAMAR OKNO, NO SE ESTA ACTUALIZANDO EL VALOR DEL DOLAR, PORQUE MODIFICACRON LA PAGINA DEL B.C, PONGASE VIVO A ARREGLARLO`
            };

            transporter.sendMail(mailOptions,(error, info) => {
                if (error) {
                    return console.log('nose pudo enviar');
                }
                console.log('Mail enviado');
            });
        });

    }else if (category){
    
    var dolar = category;
        
    let f = new Date;
    let dia = f.getDate();
    let mes = f.getMonth() + 1;
    let año = f.getFullYear();
    
    let fecha = ''+dia+''+mes+''+año+'';
    
    console.log(fecha);

var con = mysql.createConnection({
    host: "localhost",
    user: "",
    password: "",
    database: "dolar"
});

con.connect(function(err) {
    if (err) throw err;
    var sql = `UPDATE dolar.val_dolar
    SET
    fecha = `+fecha+`,
    valor = `+dolar+` 
    WHERE id = 1;
    `;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Cambio dolar actualizado");
    });
});

}


});
    
});

