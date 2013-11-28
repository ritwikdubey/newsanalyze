
var collections = ['newsdata'];
var dataconnection = 'localhost/newsdb';
var db = require('mongojs').connect(dataconnection, collections);

function metadata(link, keywords, relevance, concept){
    this.text = keywords;
    this.relevance = relevance;
    this.link = link;
    this.concept = concept;
}

//var md1 = {"link": "href", "text" : "keyword1", "relevance": ".937"};

var AddToDb = function(md1){
//console.log("In AddToDb: "+ md1.text);
db.newsdata.save(md1,function(err, saveUser){
    if(!err){
	console.log(saveUser.link + "-> saved");
    }

});
}


//AddToDb(md1);
exports.AddToDb = AddToDb;
