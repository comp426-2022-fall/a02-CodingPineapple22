#!/usr/bin/env node
import minimist from "minimist"
import moment from "moment-timezone";
import fetch from "node-fetch";

var arg = minimist(process.argv.slice(2));
let timezone = null;

if(arg.h){
	console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
	-h   Show this help message and exit.
	-n, -s Latitude: N positive; S negative. 
	-e, -w Longitude: E positive; W negative.
	-z     Time zone: uses tz.guess() from moment-timezone by default.
	-d 0-6 Day to retrieve weather: 0 is today; defaults to 1.
	-j     Echo pretty JSON from open-meteo API and exit.`);
	process.exit(0); 
}

if(arg.z != null){timezone = arg.z;}
else{timezone = moment.tz.guess();}

let latitude, longitude, days = 0; 

if(arg.n != null){ latitude = arg.n;}
else if(arg.s){ latitude = -1 * arg.s;}
else{console.log("Latitude must be in range"); process.exit(0);}

if(arg.e != null){longitude = arg.e;}
else if(arg.w){longitude = -1 * arg.w;} 
else{console.log("Longitude must be in range"); process.exit(0);}

if(arg.d != null){days = arg.d;}
else{days = 1;} 
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + 
	latitude + '&longitude=' + longitude + 
	'&daily=precipitation_hours&timezone=' + timezone); 
const responseToJSON = await response.json();

if(arg.j){console.log(responseToJSON); process.exit(0); }
 

if(responseToJSON.daily.precipitation_hours[days] == 0){ console.log("You will not need your galoshes ");} 
else{ console.log("You might need your galoshes ");}

if(days ==0){console.log("today. ");}
else if(days >1){console.log("in " +days+ " days.");}
else{console.log("tomorrow."); } 

