var path = require ('path');
var mysql = require ('mysql');
var express = require ("express");
var app =  express();
//var dataPath = path.join(__dirname, 'data.json');
var clientPath  = path.join(__dirname,'../client');
var bodyParser = require('body-parser')
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'chirpsUser',
    password: 'password',
    database: 'chirper' 
});


app.use(express.static(clientPath));  //step 1
app.use(bodyParser.json());


app.get('/api/chirps',function(req,res){   //rows('all_chirps')
    all_chirps()
    .then(function(chirps){
        res.send(chirps);
    }, function(err){
        res.sendStatus(500)
    });
});

app.get('/api/chirps/:id',function(req,res){
    single_chirp(req.params.id)
    .then(function(tbl_chirper){
        res.send(tbl_chirper);
    }, function(err){
        res.sendStatus(500)
    });
});

app.delete('/api/chirps/:id',function(req,res){
    delete_data(req.params.id)
    .then(function(){
        res.sendStatus(200);
    },function(err){
        res.sendStatus(500)
    });
});

app.post('/api/chirps', function(req,res){

    //var  newChirp = req.body;
    //row('insert_chirp', [newChirp.message, newChirp.user])

    insert_chirp(req.body.message, req.body.userid)
    .then(function(ID){
        res.sendStatus(201).send(ID);
    }, function(err){
        console.log(err);
        res.sendStatus(500);
    });
});

app.put('/api/chirps/:id', function(req, res){
    update_chirp(req.body.message,req.params.id)
    .then(function(){
        res.sendStatus(204);
    }, function(err){
        console.log(err);
        res.sendStatus(500);
    });
});


app.get('/api/users',function(req,res){   //rows('all_chirps')
    getUsers()
    .then(function(users){
        res.send(users);
    }, function(err){
        res.sendStatus(500)
    });
});


app.listen(3000);

function all_chirps(){
    return new Promise (function(resolve, reject){
        pool.getConnection(function(err, connection){
            if (err){
                reject(err);
            }else {
                connection.query('CALL all_chirps();', function(err, resultsets){
                    connection.release();
                    if (err){
                        reject(err)
                    }else{
                        resolve(resultsets[0]);
                    }
                });
            }
        });
    });
}

function single_chirp(P_id){
    return new Promise(function(resolve, reject){
         pool.getConnection(function(err,connection){
             if(err){
                 reject(err);
             }else{
                 connection.query('CALL single_chirp(?);',[P_id],function(err,resultsets){
                     connection.release();
                     if (err){
                         reject(err);
                     }else{
                         resolve(resultsets[0]);
                     }
                 });
             }
         });
    });
   
}

function insert_chirp(P_message, P_user){
    return new Promise(function(resolve,reject){
        pool.getConnection(function(err,connection){
            if (err){
                reject(err);
            }else{
                connection.query('CALL insert_chirp(?,?);', [P_message, P_user], function(err, resultsets){
                    connection.release();
                    if(err){
                        reject(err);
                    }else {
                        resolve();
                    }
                });
            }
        });
    });
    
}

function delete_data(P_id){
    return new Promise(function(resolve,reject){
        pool.getConnection(function(err,connection){
            if(err){
                reject(err);
            }else{
                connection.query('CALL delete_data(?);', [P_id], function(err,resultsets){
                    connection.release();
                    if(err){
                        reject(err);
                    }else{
                        resolve();
                    }
                });
            }
        });
    });
}

function update_chirp(P_message, P_id){
    return new Promise(function(resolve,reject){
        pool.getConnection(function(err,connection){
            if(err){
                reject(err);
            }else{
                connection.query('CALL update_chirp(?,?);',[P_message,P_id],function(err,resultsets){
                    connection.release();
                    if(err){
                        reject(err);
                    }else{
                        resolve();
                    }
                });
            }
        });
    });
}


function getUsers(){
    return new Promise (function(resolve, reject){
        pool.getConnection(function(err, connection){
            if (err){
                reject(err);
            }else {
                connection.query('CALL getUsers();', function(err, resultsets){
                    connection.release();
                    if (err){
                        reject(err)
                    }else{
                        resolve(resultsets[0]);
                    }
                });
            }
        });
    });
}


// function callProcedure(procedureName, args){
//     return new Promise(function(resolve,reject){
//         pool.connection(function(err, connection){
//             if(err){
//                 reject(err);
//             }else{
//                 var placeholders = ''
//                 if (args && args.length > 0){
//                     for (var i = 0; i < args.length;i++){
//                         if (i=== args.length - 1){//if we are on the last argument in the array
//                             placeholders += '?' ;
//                         }else{
//                             placeholders += '?';
//                         }
//                     }

//                 }
//                 var callString = 'CALL' + procedureName + '(' + placeholders + ');';  // CALL getchirp() or 
//                 connection.query (callString, args, function(err, resultsets){
//                     if (err){
//                         reject(err);
//                     }else {
//                         resolve(resultsets);
//                     }
//                 });    
//          }
//         });
//     });
// }

// function rows(procedureName,args){
//     return callProcedure(procedureName, args)
//     .then(function(resultsets){
//         return resultsets[0];
//     });
// }

// function row(procedureName, args) {
//     return callProcedure(procedureName,args)
//     .then(function(resultsets){
//         return resultsets [0][0];
//     });
// }

// function empty(procedureName, args) {
//     return callProcedure(procedureName,args)
//     .then(function(){
//         return resultsets;
//     });
// }