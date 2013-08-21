#!/usr/bin/env node

var mongotest = require('./mongo-test');
var MongoClient = require('mongodb').MongoClient
, format = require('util').format;
var AlchemyAPI = require('alchemy-api');
var request = require("request");
var cheerio = require("cheerio");
var jsdom = require('jsdom');
var util = require('util');
var fs = require('fs');

var MongoConnect = function(){
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
    });
};

var SaveKeywords = function(keywords,link, category){
    console.log("in savekeywords");
    var entry = {};
    entry.link = link;
    entry.category = category;
    entry.keyowrds = keywords;
    console.log(JSON.stringify(entry));
    //mongotest.AddToDb(entry);
};

if(require.main == module) {
    console.error('Invoked at command line.');
    var symbols = process.argv;
    if(symbols.length > 2) {
        symbols = symbols.slice(2, symbols.length);
    } else {
        symbols = undefined;
    }
	MongoConnect();

	request({
	  uri: "http://archives.ndtv.com/articles/2013-07.html",
	}, function(error, response, body) {
	  var $ = cheerio.load(body);
	  console.log($("#main-content").find("li").length);
	  $("#main-content").find("li").each(function() {
	    var link = $(this);
	    var text = link.text();
		//var flag = true;
	    //if(flag === true){
	    var href = link.attr("href");
	    //console.log(text + " -> " + href);
	    var isEng = true;
		if (!text.match('/^[a-zA-Z \.\!\?]*$/')) {
		    isEng = false;
		    console.log(isEng + ": is here");
		}	
	   if(isEng){
	   var alchemy = new AlchemyAPI('5bbb93b60d50ac7495f0333770c6963114c676f0');
	   link.find("a").each(function(){
	   var href1=  $(this).attr("href");
	    var category;

	    alchemy.category(href1, {}, function(error, response){
		if(!error){
		category = response.category;
		    }
	    });

	    alchemy.keywords(href1, {}, function(error, response){
		var keywords = response.keywords;
		console.log(keywords);
		SaveKeywords(keywords,href1,category);
	    });

	   });
	  }
	//}
	    
	  });
	});

} else {
    console.error('Invoked via library call');
}



