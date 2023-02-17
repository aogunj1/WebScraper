var request = require('request');
var cheerio = require('cheerio');
//The artist name
var inputTitle = process.argv[2];
var artist = [];
var title = [];
var artistWeWant = [];
var titleWeWant = [];
var artistANDTitle = [];
//Takes inputs from package.json so each user can input files
let jsonDATA = require('./package.json');
var userInput = jsonDATA.sender_email;
var passInput = jsonDATA.password_email;
var fromInput = jsonDATA.from;
var toInput = jsonDATA.to;

//Mailer
var nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
host: 'smtp.gmail.com',
port: 465,
secure: true,
auth: {
    user: userInput,
    pass: passInput
}
});

//single named artists only. 
if(process.argv.length > 3){
   console.log('Invalid artist name')
}
//no artist was inputted
else if(process.argv.length < 2){
   console.log("no artist name input")
}
else{
request('http://www.popvortex.com/music/charts/top-rap-songs.php', function (error, response, html)  
{
    if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
   
        $('cite.title').each(function(i  ,  element)  {
          var holdTitle = ($(this).text());
           title.push(holdTitle)
        });
        $('em.artist').each(function(i, element)  {
           var holdArtist = ($(this).text());
           artist.push(holdArtist) 
        }); 

        for(var k = 0 ; k < 26; k++)
        {
        if(artist[k] == inputTitle)
        {
         console.log(title[k] + "  " + artist[k])
         artistWeWant.push(artist[k])
         titleWeWant.push(title[k])  
         artistANDTitle[k] = '<strong>' + artist[k] + '</strong>'+ " " + '<em>' + title[k] +'</em>' + '<br></br>' // \n doesnt work here have to use html
        var makeString =  artistANDTitle.toString();  // had to make this a string for it to work
        var finalText = makeString.replaceAll(',', ''); // without replacing commas it saves all the commas for some reason
      }
   } 
if (artistWeWant.length == 0){
   console.log("no matching artist!")
}
else {
let mailOptions = {

   from: fromInput,
   to: toInput,
   subject: 'Your artists is : ' + process.argv[2],
   text: finalText ,
   html: finalText 
   }; 

transporter.sendMail(mailOptions, (error, info) => {
if (error){
   return console.log(error);
}
console.log(' message successfully sent!  '+ info.messageId)

//console.log(nodemailer.getTestMessageUrl(info))
})
	}   
}});
}