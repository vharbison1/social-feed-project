
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

//Get ALL Messages From All Users
app.get('/api/posts/all', function(req, res){

    db.query('SELECT * FROM posts')    
        .then((results) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(results));
            })
        .catch((e) => {
            console.error(e);
            });
});

//Get All Messages from Single User
  app.get('/api/posts/user/all/:id', function(req, res)
  {
      let id = req.params.id;
  
      if(id) 
      {
          db.query("SELECT posts.id,posts.date_updated AS post_date_updated,posts.post_title AS post_title, posts.post_body AS post_body,posts.post_image_url AS post_image_url, users.name FROM posts JOIN users ON posts.user_id = users.id WHERE users.id=$1", [id])
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

//Retrieve Single Message based off id
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
app.delete('/api/posts/:id', function (req, res) {
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
        post_title: req.body.post_title,
        post_body: req.body.post_body,
        user_id: req.body.user_id,
        post_image_url: req.body.post_image_url
    };

    let query = "INSERT INTO posts(post_title, post_body, user_id, post_image_url) VALUES (${post_title}, ${post_body}, ${user_id}, ${post_image_url}) RETURNING id";
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

//Edit/Input Specific Post based off Existing Post ID
app.put('/api/posts/', function (req, res) {

    let data = {
        id: req.body.id,
        post_body: req.body.post_body,
        user_id:  req.body.user_id
    };

    let query = "UPDATE posts SET post_body=${post_body} WHERE id=${id}";
    db.result(query,data)
        .then((results) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(results));
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
            db.one(`SELECT * FROM users WHERE email='${email}'`)
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
    app.get('/api/comments/all', function(req, res)
    {
    
        db.query('SELECT * FROM comments')
            .then(function(results)
            {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(results));
            });
    });

  //Get ALL comments from a single user
    app.get('/api/comments/user/:id', function(req, res)
    {
        let id = req.params.id;
    
        if(id) 
        {
            db.query("SELECT comments.id,comments.comment,comments.user_id AS user_id,comments.comment_date AS comment_date, users.name FROM comments JOIN users ON comments.user_id = users.id WHERE users.id=$1", [id])
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

  //A route for getting all the comments that belong to a post and user
  app.get('/api/comments/posts/:id', function(req,res)
  {
      let id = req.params.id;

    if(id)
    {
        db.query("SELECT comments.id,comments.comment,comments.user_id AS user_id,comments.comment_date,users.name FROM comments JOIN posts on comments.post_id = posts.id JOIN users ON comments.user_id = users.id WHERE posts.id=$1", [id])
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

  });

  //Get ALL users
  app.get('/api/users/all', function(req,res)
  {
      db.query("SELECT * FROM users")
      .then(function(results)
      {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(results));
      })
      .catch(function(error)
      {
          res.status(434).send('INTERNAL ERROR');
      });
  })
    
app.listen(3000, function(){
    console.log('Todo List API is now listening on port 3000...');
})