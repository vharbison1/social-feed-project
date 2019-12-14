
const config =
{
    host: 'localhost',
    port: 5432,
    database: 'social_media_project',
    user: 'postgres',
    password: 'Pokemon1'
};

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

//Promise and Sanitize input to prevent unexpected queries (and malicious queries) into data-base
const pgp = require('pg-promise')();
const db = pgp(config);

//Start Server
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Cors for AXIOS ON BROWSER
app.use(cors());


//THIS IS RELATED TO API MESSAGES -----------------

//Get ALL Messages
app.get('/api/messages/all', function(req, res){

    db.query('SELECT * FROM posts')    
        .then((results) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(results));
            })
        .catch((e) => {
            console.error(e);
            });
});

//Retrieve Message based off id
app.get('/api/posts/:id', function (req, res) {
    let id = req.params.id;
    db.one("SELECT * FROM posts WHERE id=$1", [id])
        .then((results) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(results));
        })
        .catch((e) => {
            console.error(e);
        });
});


//Delete Message
app.delete('/api/messages/:id', function (req, res) {
    let id = req.params.id;
    let query = `DELETE FROM posts WHERE id=${id}`;
    db.result(query)
        .then((result) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
        })
        .catch((e) => {
            console.error(e);
        });
});

//Insert a new Post
app.post('/api/posts', function (req, res) {
    let data = {
        title: req.body.title,
        body: req.body.body,
        user_id: req.body.user_id,
        image_url: req.body.image_url
    };
    let query = "INSERT INTO posts(title, body, user_id, image_url) VALUES (${title}, ${body}, ${user_id}, ${image_url}) RETURNING id";
    db.one(query, data)
        .then((result) => {
            db.one("SELECT * FROM posts JOIN users ON posts.user_id=users.id WHERE posts.id=$1", [result.id])
                .then((results) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(results));
                })
                .catch((e) => {
                    console.error(e);
                });
        })
        .catch((e) => {
            console.error(e);
        });
});

//Edit Specific Post based off Id
app.put('/api/posts/:id', function (req, res) {
    let id = req.params.id;
    let data = {
        id: id,
        title: req.body.title,
        body: req.body.body,
        image_url: req.body.image_url
    };
    let query = "UPDATE posts SET title=${title}, body=${body}, image_url=${image_url} WHERE id=${id}";
    db.one(query, data)
        .then((result) => {
            db.one(query, data)
                .then((result) => {
                    db.one("SELECT * FROM posts JOIN users ON posts.user_id=users.id WHERE posts.id=$1", [result.id])
                        .then((results) => {
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify(results));
                        })
                        .catch((e) => {
                            console.error(e);
                        });
                })
                .catch((e) => {
                    console.error(e);
                });
        })
        .catch((e) => {
            console.error(e);
        });
});

  //THIS IS RELATED TO REGISTER PAGE -----------------

  //Insert New User Into database
  app.post('/api/register', function (req, res) {
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    if (data.name && data.email && data.password) {
        let query = "INSERT INTO users(name, email, password) VALUES (${name}, ${email}, ${password}) RETURNING id";
        db.one(query, data)
            .then((result) => {
                db.one("SELECT * FROM users WHERE id=$1", [result.id])
                    .then((results) => {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(results));
                    })
                    .catch((e) => {
                        console.error(e);
                    });
            })
            .catch((e) => {
                console.error(e);
            });
    } else {
        res.status(434).send('Name, email and password is required to register')
    }
});

    //THIS IS RELATED TO LOGIN PAGE -----------------

    //Search database for existing user with matching credentials
    app.post('/api/login', function (req, res) {
        let email = req.body.email;
        let password = req.body.password;
        if (email && password) {
            db.one(`SELECT * FROM users WHERE email=${email}`)
                .then((results) => {
                    if (results.password == password) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(results));
                    } else {
                        res.status(434).send('Email/Password combination did not match')
                    }
                })
                .catch((e) => {
                    res.status(434).send('Email does not exist in the database')
                });
        } else {
            res.status(434).send('Both email and password is required to login')
        }
    });
    
    //THIS IS RELATED TO COMMENTS 

    //Get ALL comments from database
    app.get('/api/comments/all', function(req, res))
    {
        db.query('SELECT * FROM comments')
            .then(function(results)
            {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(results));
            });
    }

  //Get ALL comments from a single user
    app.get('/api/comments/:id', function(req, res)
    {
        let id = req.params.id;
    
        if(id) 
        {
            db.query(`SELECT * FROM comments JOIN users on comments.user_id = users.id WHERE users.id=${id}`)
            .then(function(results)
            {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(results)); 
            })
            .catch(function(error)
            {
                res.status(434).send('INTERNAL ERROR CANNOT FIND USER ID');
            });
        }
        else 
        {
            res.status(434).send('INTERNAL ERROR CANNOT FIND USER ID')
        }
  });

  //
    
app.listen(3000, function(){
    console.log('Todo List API is now listening on port 3000...');
})