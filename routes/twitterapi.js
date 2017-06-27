//use twitter api to search for trending topics; the interface is provided by npm-twitter package.
const express = require('express')
var request = require("request");
var twitterapiConfig=require("../config/twitterapi")
const router = express.Router()
const twitter = require('twitter')
//get authentication information from twitterapi.js in config.
var client = new twitter({
    consumer_key:twitterapiConfig.consumer_key,
    consumer_secret:twitterapiConfig.consumer_secret,
    access_token_key:twitterapiConfig.access_token_key,
    access_token_secret:twitterapiConfig.access_token_secret,
});

//receive the get request from the front end, and then call twitter api to get trending topics.
router.get('/:api',function(req,res,next){
    let params={id:req.params.api}
    client.get('trends/place',params,function(err,tag,response){
            res.json(tag)
        })

})



 module.exports=router


