var express = require("express");
var alexa = require("alexa-app");
var bodyParser = require('body-parser');

var PORT = process.env.PORT || 8080;
var app = express();

// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app("alexa");

alexaApp.express({
  expressApp: app,
  //router: express.Router(),

  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: true,

  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: false
});

// now POST calls to /test in express will be handled by the app.request() function

// from here on you can setup any other express routes or middlewares as normal
app.set("view engine", "ejs");

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================
var steps = {
  8 : 'Hi! I can teach you how to make your own modeling clay out of common kitchen materials! Just say continue to begin! ',
  1 : 'collect the following ingredients. 3 and a half cups of all purpose flour, 1 half cup of salt, 1 tablespoon cream of tartar, 2 and a half tablespoons of oil, and 2 cups of water. You\'ll also need a large mixing bowl, a pot to boil water, a wooden spoon, and a cookie sheet.  You can grab some food coloring and vanilla extract if you would like to dye and scent the clay.',
  2 : 'Pour the water into the pot.  Optionally add a couple drops of food coloring for color, and start to bring the water to a boil.',
  3 : 'whilst waiting for the water to boil, add the flour, salt, and tartar to the mixing bowl, and mix thoroughly with the wooden spoon.',
  4 : 'remove the boiling pot water from heat, and carefully add in the oil and mix them together.',
  5 : 'carefully pour the mixture from the pot into the mixing bowl. Mix thoroughly using the wooden spoon, optionally add a few drops of vanilla extract for aroma, and leave the mixture to cool.',
  6 : 'once the mixture is cool enough to handle, transfer it to the cookie sheet and begin kneading it until the consistency is similar to that of thick putty.',
  7 : 'Your modelling clay should now be ready to use! If you don\'t need it right away, just add a sprinkling of water and place the clay into an airtight container for storage. Okay! You\'re all set! Enjoy!'
  };.
  


alexaApp.launch(function(req, res) {

  
 // res.session('persstep', 0); //maybe we want to put that or some variation of this somewhere else like in the intent. We also never  figured out the repeat function but the hell with that.
  var prompt = "Hi! I can teach you how to make your own modeling clay out of common kitchen materials! Just say continue to begin! if we've done this before, I'll try to resume where we last left off.  you can also say the number of any step from 1 to 7 you'd like to go to, and I'll start from there.";
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

alexaApp.intent('StepIntent', {
    "slots": {"stepno" : "numnum" },
    "utterances": ["continue", "next step", "begin", "{stepno}", "step {stepno}", "go to {stepno}", "go to step {stepno}", "read step {stepno}", "begin with step {stepno}", "start at step {stepno}"]
  },
  function(req, res) {
  var slotstep = req.slot('stepno');
  var persstep = +req.session('step');
  console.log("persstep= " + persstep + ", slotstep = " + slotstep + ", number.isintegerslotstep= " + Number.isInteger(slotstep) ); //should it be freaking number. Or should I just be integer?
  
if (slotstep && slotstep > 0 && slotstep < 8 && parseFloat(slotstep) == parseInt(slotstep) && !isNaN(slotstep)){
  var step = slotstep; 
    } else if (slotstep == 0){
    var step = 8;
    
    } else if (slotstep > 7 ){
   var morethanseven = 1; 
   // //  res.say("Whoa there, there are only 7 steps. Please choose a step between 1 and 7, or say continue and I'll start from where I think you left off.").shouldEndSession(false);
     } else if (slotstep < 0 && !isNaN(slotstep)){
   var screwingwithme = 1;
     ////   res.say("Really? Negative numbers? You must be messing with me.  C'mon, let's try again, but this time, use positive integers between 1 and 7. Or say continue.").shouldEndSession(false);
        // else if  //***********somewhere we have to define the we have to check to see if the req session variable is defined and then if it isn't defined, define res.session stepcounter/stepno variable as 1 or zero or whatever. If it is defined, then move on to the rest of the code processing. Why is it step req+1 again, i wonder? ;
       } else if (slotstep > 0 && parseFloat(slotstep) != parseInt(slotstep) && !isNaN(slotstep)){ 
         var needinteger = 1;
     } else if (!(+req.session('step')) || !persstep || persstep == 0  || persstep == "??"){
   var step = 1;
 } else if ( persstep == 8 || persstep > 8) {
   var exit = 1;
 } else if (slotstep != "??" && isNaN(slotstep)) {
   var garbage = 1;
   
   //Eep - how do we deal with things that are not defined in the slot? Like an invalid intents? Or invalid rejected slots?
   //need to know of if garbage slot like 'pineapple' and persstep is valid, then refer to persstep. if no slot, then wgat

 } else if (persstep > 0 && persstep < 8 ){
   var step = persstep;
   //for lower down the road //if step = 7 then res.say or end session. or set res.saybsection to...somethjng else  or set turuthiness to a varuable 
 
 
 } else { var didntunderstanderror = 1 }       
  
  if (didntunderstanderror){
    res.session('step', 1)
    //res.say("Oh my, this is embarrassing, but I've lost count of where we were stepwise. You can say continue to start at the beginning, or step followed by the step number you'd like to resume, or say stop to exit.").shouldEndSession(false);
    res.say(steps[8]).shouldEndSession(false);
  } else if (exit) {
      res.session('step', 1)
      res.say("Hey, If you want to review a step, just say step followed by the step number you'd like to hear. You can say continue to start over.").shouldEndSession(false);
    } else if (step == 7) { 
       res.session('step', 1);
       res.say("Okay, last step " + step + ". " + steps[step] +  " Goodbye!").shouldEndSession(true);
    } else if (step == 8) {
      res.say(steps[step]).shouldEndSession(false);
      res.session('step', 1);
      } else if (morethanseven){
        if (persstep == 8) {
          persstep = 1;
    } else if (persstep == 0 || !(+req.session('step'))){
           persstep = 1; 
                    }
      res.session('step', persstep)
      res.say("Whoa, there are only 7 steps to this skill. Please choose a step between 1 and 7, or say continue and I'll start from where I think we left off.").shouldEndSession(false);
    } else if (screwingwithme){
        res.say("Negative numbers? That's impressive, but I'm not sure what to do with that. let's try again, but this time, give me a positive step number between 1 and 7. Or say continue to let me take you where I want to go!").shouldEndSession(false);
        res.session('step', persstep);
      } else if (needinteger){
        res.say("Decimals? Really? Let's try again, but this time, please give me a step number using whole numbers, and only whole numbers, or say continue to go on to the next logical step.").shouldEndSession(false);
        res.session('step', persstep);
    } else if (garbage){
       if (persstep > 0 && persstep < 8) {
        // persstep += 1;
         res.say("I'm sorry, I did not understand what you were trying to say there. Please choose a step number between 1 and 7, or say continue and I'll start from where I think we left off.").shouldEndSession(false);
         res.session('step', persstep);
         } else { 
         res.say("I'm sorry, I did not understand what you were trying to say there, Please try again. Choose a step number between 1 and 7, or say begin and I'll start from the beginning.").shouldEndSession(false);
         res.session('step', 1);
         }
      } else {
        res.say("Step " + step + ". " + steps[step] + " When you're ready for the next step, say continue, or tell me the step number you'd like to hear.").shouldEndSession(false);
        step += 1;
        res.session('step', step);
        }
  }
                //}
                );
  
alexaApp.intent('StepContinue', {
    "slots": {},
    "utterances": ["continue", "next step", "begin", "{stepno}", "step {stepno}", "go to {stepno}", "go to step {stepno}", "read step {stepno}", "begin with step {stepno}", "start at step {stepno}"]
  },
  function(req, res) {
  var slotstep = req.slot('stepno');
  var persstep = +req.session('step');
  console.log("persstep= " + persstep + ", slotstep = " + slotstep); 
  
//Intro block 3
 if (persstep > 0 && persstep < 8 ){
   var step = persstep;
   //for lower down the road //if step = 7 then res.say or end session. or set res.saybsection to...somethjng else  or set turuthiness to a varuable 
 } else if ( persstep == 8 || persstep > 8) {
   var exit = 1;
 } else if (persstep == 0) {
   var step = 8;
 }  else { var didntunderstanderror = 1 }       
  
  if (didntunderstanderror){
    res.session('step', 1)
    //res.say("Oh my, this is embarrassing, but I've lost count of where we were stepwise. You can say begin to start at the beginning, or step followed by the step number you'd like to resume, or say stop to exit.").shouldEndSession(false);
   res.say(steps[8]).shouldEndSession(false);
  } else if (exit) {
      res.session('step', 1)
      res.say("Hey, If you want to review a step, just say step followed by the step number you'd like to hear.").shouldEndSession(false);
    } else if (step == 7) { 
       res.session('step', 1);
       res.say("Okay, last step, step " + step + ". " + steps[step] +  " Goodbye and Good luck!").shouldEndSession(true);
    } else if (step == 8) {
      res.say(steps[step]).shouldEndSession(false);
      res.session('step', 1);
    } else {
        res.say("Step " + step + ". " + steps[step] + " When you're ready for the next step, say continue.").shouldEndSession(false);
        step += 1;
        res.session('step', step);
        }
  }
                //}
                );
  
  

alexaApp.intent("AMAZON.HelpIntent", {
  "slots": {} },
  function(request, response) {
    
var HELP_MESSAGE = "Say continue to proceed to the next instructive step, or specify a step by saying step followed by a step number between 1 and 7.  Follow the instructions and further prompts or say stop to exit at any time. And remember, have fun!";
    response.say(HELP_MESSAGE).shouldEndSession(false);
  }
 );


 //   'AMAZON.HelpIntent': function () {
 //       var speechOutput = HELP_MESSAGE;
  //      var reprompt = HELP_REPROMPT;
  //      this.emit(':ask', speechOutput, reprompt);
  //  },
  //  'AMAZON.CancelIntent': function () {
    //    this.emit(':tell', STOP_MESSAGE);
 //   },
  //  'AMAZON.StopIntent': function () {
   //     this.emit(':tell', STOP_MESSAGE);
 //   }
// };


alexaApp.intent("AMAZON.StopIntent", {
  "slots": {} },
//"utterances": [ 
 //              "help", "help me"
  //              ]
//  },
  function(request, response) {
    response.say("Ok, Goodbye!").shouldEndSession(true);
  }
 );

alexaApp.intent("AMAZON.CancelIntent", {
  "slots": {} },
//"utterances": [ 
 //              "help", "help me"
  //              ]
//  },
  function(request, response) {
    response.say("Cancelling. Goodbye!").shouldEndSession(true);
  }
 );

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));
