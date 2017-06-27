//use youtube api to search for videos of trending topics; the interface is provided by npm-youtube-search package.
const express = require('express')
const router = express.Router()
const search = require('youtube-search');
var youtubeapiConfig=require("../config/youtubeapi")
//get authentication information from youtubeapi.js in config.
var opts = {
    maxResults:youtubeapiConfig.maxResults,
    key:youtubeapiConfig.key,
    type:youtubeapiConfig.type,
};
//receive the get request from the front end, and then call youtube api to get videos.
router.get('/:api',function(req,res,next){

    let params =req.params.api

    search(params, opts, function(err, results) {
        if(err) return console.log(err);

        res.json(results)


    })

})


module.exports=router
