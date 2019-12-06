var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

var posts = [
        {
            id:0,
            username: "Johh",
            content: "Blah",
            img: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-1.2.1&w=1000&q=80",
            dateposted: "12/1/2019"
        },
        {
            id:1,
            username: "Sarah",
            content: "Some more information",
            img: "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/dc23cd051d2249a5903d25faf8eeee4c/BFV36537_CC2017_2IngredintDough4Ways-FB.jpg",
            dateposted: "12/3/2019"
        }     
    ];

    app.get('/api/messages', function(req,res) {

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(posts));    //Can also do res.json({})
    });

    // POST /api/messages
    app.post('/api/messages', function (req, res)
    {
        let username = req.body.username;

        if(username)
        {
            let totalPostLength = posts.length;

            //There may be no post, so initialize to -1 for our starting counter
            let getLastId = -1;

            //If post is more than 0, then we can get the last id of post object and increment the id by 1
            if(totalPostLength != 0)
            {
                getLastId = posts[totalPostLength-1].id;
            }

            getLastId++;

            let data = {
                id: getLastId,
                username: username,
                content: req.body.postcontents,
                img: req.body.imageposted,
                dateposted: req.body.dateposted
            }

            posts.push(data);
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));    //Can also do res.json({})
        }
        else 
        {
            res.status(412).send('Todo item is required to POST.');  
        }
    });

    app.delete('/api/messages/:id', function(req, res){

        //Map Function Will Return An Array with each objects id
        var arrayOfIds = posts.map(function(x) {return x.id; });

        //Now we have just have a simple array, we can grab the position of the element we are looking for
        //Had to parseInt due to param coming back as string.
        //The postarray id param is an int, so now it matches 
        var elementPos = arrayOfIds.indexOf(parseInt(req.params.id));
        
        if(posts[elementPos]) {
            
            //Start from the chosen elementPos
            //Does not Delete the Ending param
            posts.splice(elementPos,1);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify('DELETE SUCCESSFUL'));
        } else {
            res.status(404).send('Item Not Found');
        }
    });


app.listen(3000, function(){
    console.log('Todo List API is now listening on port 3000...');
})