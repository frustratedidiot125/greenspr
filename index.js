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
10 : 'Hi there! I can teach you how to make an authentic-ish, single-serving, cupcake that could ready to eat in slightly over a minute! Just say continue to begin!',
  1 : 'First, you\'ll need to gather the following ingredients. 1/4  cup all-purpose flour, 2 tablespoon unsweetened cocoa powder, 1/4 teaspoon baking powder, 2 to 3 tablespoons granulated sugar, 1/8 teaspoon salt, 1/4 cup plus 1 tablespoon milk, 2 tablespoon vegetable oil, and either 1 tablespoon hazelnut chocolate spread or mini chocolate chips.',

  2 : 'Next, you\'ll need some basic kitchen hardware. grab a whisk or a fork if no whisk can be found, a medium sized Bowl, a Microwave safe mug, larger is better, a section of paper towel or a large microwave safe plate, and make sure you\'ve got a working microwave.',
  3: 'Whisk together all the dry ingredients in your medium-sized Bowl.',
  4: 'Whisk in the milk and the vegetable oil until all ingredients are combined and your batter has no clumps.',
  5: 'Pour the batter into a microwave-safe mug. You\'ll want to make sure there\'s enough room for the cake to expand without spilling over.',
  6: 'Drop the hazelnut spread in a dollop or simply pour the chocolate chips into the center of the top of the batter.',
  7: 'Place the mug in the center of the microwave with the paper towel or large plate underneath.',
  8: 'Now it\'s time to cook your creation. Set your microwave on high and prepare to cook for about 70 seconds. Depending on the power of your device, you may need to add or shave off a few seconds. This recipe has been calibrated for 950 watt ovens, so, just use your judgement. Hit start and watch out for signs of overcooking.', 
  9: 'Allow the cupcake and mug to cool just a bit, carefully remove the mug from the plate or paper towel. there may be some spillage. And you\'re ready to serve your freshly baked cupcake. Enjoy!' 
   };
  


alexaApp.launch(function(req, res) {

  
 // res.session('persstep', 0); //maybe we want to put that or some variation of this somewhere else like in the intent. We also never  figured out the repeat function but the hell with that.
  var prompt = "Hi there! I can teach you how to make an authentic-ish, single-serving, cupcake that could ready to eat in slightly over a minute! Just say continue to begin! If you've been here before, I'll try to pick up where we left off.  If you want to start from a particular step, just say the word step, followed by the step number. And you can say stop at any time to exit. ";
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

alexaApp.intent('StepIntent', {
    "slots": {"stepno" : "numba" },
    "utterances": ["continue", "next step", "begin", "{stepno}", "step {stepno}", "go to {stepno}", "go to step {stepno}", "read step {stepno}", "begin with step {stepno}", "start at step {stepno}"]
  },
  function(req, res) {
  var slotstep = Number(req.slot('stepno'));
  var persstep = Number(+req.session('step'));
  console.log("persstep= " + persstep + ", slotstep = " + slotstep + ", number.isintegerslotstep= " + Number.isInteger(slotstep) ); //should it be freaking number. Or should I just be integer?
  
if (slotstep && slotstep > 0 && slotstep < 10 && parseFloat(slotstep) == parseInt(slotstep) && !isNaN(slotstep)){
  var step = slotstep; 
    } else if (slotstep == 0){
    var step = 10;
    
    } else if (slotstep > 9 ){
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
 } else if ( persstep == 18 || persstep > 18) {
   var exit = 1;
 } else if (slotstep != "??" && isNaN(slotstep)) {
   var garbage = 1;
   
   //Eep - how do we deal with things that are not defined in the slot? Like an invalid intents? Or invalid rejected slots?
   //need to know of if garbage slot like 'pineapple' and persstep is valid, then refer to persstep. if no slot, then wgat

 } else if (persstep > 0 && persstep < 18 ){
   var step = persstep;
   //for lower down the road //if step = 7 then res.say or end session. or set res.saybsection to...somethjng else  or set turuthiness to a varuable 
 
 
 } else { var didntunderstanderror = 1 }       
  
  if (didntunderstanderror){
    res.session('step', 1)
    //res.say("Oh my, this is embarrassing, but I've lost count of where we were stepwise. You can say continue to start at the beginning, or step followed by the step number you'd like to resume, or say stop to exit.").shouldEndSession(false);
    res.say(steps[10]).shouldEndSession(false);
  } else if (exit) {
      res.session('step', 1)
      res.say("Hey, If you want to review a step, just say step followed by the step number you'd like to hear. You can say continue to start over.").shouldEndSession(false);
    } else if (step == 9) { 
       res.session('step', 1);
       res.say("Okay, last step " + step + ". " + steps[step] +  " Okay! Goodbye!").shouldEndSession(true);
    } else if (step == 10) {
      res.say(steps[step]).shouldEndSession(false);
      res.session('step', 1);
      } else if (morethanseven){
        if (persstep == 10) {
          persstep = 1;
    } else if (persstep == 0 || !(+req.session('step'))){
           persstep = 1; 
                    }
      res.session('step', persstep)
      res.say("Whoa, there are only 9 steps in this recipe. Please say step and choose a step between 1 and 9, or say continue and I'll try to pick up where we left off.").shouldEndSession(false);
    } else if (screwingwithme){
        res.say("There are no negatives when it comes to cupcakes, so I'm really not sure what to do with the negative step number you've given me. Why not try again, but this time, give me the word step followed by a positive step number. Or say continue to let me take you to where all the cupcake-y goodness is!").shouldEndSession(false);
        res.session('step', persstep);
      } else if (needinteger){
        res.say("Decimals? Really? Cake comes in fractional slices, not decimals. Do try again, but this time, please give me the word step followed by a step number using whole numbers, and only whole numbers, or say continue to go on to the next step.").shouldEndSession(false);
        res.session('step', persstep);
    } else if (garbage){
       if (persstep > 0 && persstep < 10) {
        // persstep += 1;
         res.say("I'm sorry, I did not understand what you were trying to say there. Please say the word step and choose a step number between 1 and 9, or say continue and I'll start from where I think we left off.").shouldEndSession(false);
         res.session('step', persstep);
         } else { 
         res.say("I'm sorry, I did not understand what you were trying to say there, Please try again. Say step and choose a step number between 1 and 9, or say begin and I'll start from the beginning.").shouldEndSession(false);
         res.session('step', 1);
         }
      } else {
        res.say("Step " + step + ". " + steps[step] + " When you're ready for the next step, say continue, or say step and tell me the step number you'd like to hear.").shouldEndSession(false);
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
  var slotstep = Number(req.slot('stepno'));
  var persstep = Number(+req.session('step'));
  console.log("persstep= " + persstep + ", slotstep = " + slotstep); 
  
//Intro block 3
 if (persstep > 0 && persstep < 10 ){
   var step = persstep;
   //for lower down the road //if step = 7 then res.say or end session. or set res.saybsection to...somethjng else  or set turuthiness to a varuable 
 } else if ( persstep == 10 || persstep > 10) {
   var exit = 1;
 } else if (persstep == 0) {
   var step = 10;
 }  else { var didntunderstanderror = 1 }       
  
  if (didntunderstanderror){
    res.session('step', 1)
    //res.say("Oh my, this is embarrassing, but I've lost count of where we were stepwise. You can say begin to start at the beginning, or step followed by the step number you'd like to resume, or say stop to exit.").shouldEndSession(false);
   res.say(steps[10]).shouldEndSession(false);
  } else if (exit) {
      res.session('step', 1)
      res.say("Hey, If you want to review a step, just say step followed by the step number you'd like to hear.").shouldEndSession(false);
    } else if (step == 9) { 
       res.session('step', 1);
       res.say("Okay, last step, step " + step + ". " + steps[step] +  " Thanks! Goodbye!").shouldEndSession(true);
    } else if (step == 10) {
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
    
var HELP_MESSAGE = "Say continue to proceed to the next step, or specify a step by saying step followed by a step number between 1 and 9.  Follow the instructions and further prompts or say stop to exit at any time. And remember, baking is fun!";
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
