//include required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port=3000;

//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

//initialise express app
const app = express();
//helps app to read JSON
app.use(express.json());

//start the server
app.listen(port,()=> {
    console.log('Server running on port', port);
});

//route: get all flavours
app.get('/allflavours', async(req,res)=> {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.icecream');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Server error for allflavours'});
    }
});


//route: add flavours
app.post('/addflavour',async(req,res)=> {
    try{
        const {flavour_name,flavour_pic} = req.body;
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('INSERT INTO defaultdb.icecream (id,flavour_name,flavour_pic) VALUES (?,?,?)', [id, flavour_name,flavour_pic]);
        res.status(201).json({message:'Flavour has been added successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Server error for addflavour'});
    }
});

//route: update flavour
app.post('/updateflavour/:id',async(req,res)=> {
    try{
        const {id} = req.params;
        const {flavour_name,flavour_pic} = req.body;

        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('UPDATE defaultdb.icecream SET id=? , flavour_name=?,flavour_pic=? WHERE id=?', [id, flavour_name, flavour_pic]);
        res.status(201).json({message:'Flavour '+id+' updated successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Server error for updateflavour'});
    }
});

//route: delete flavour
app.post('/deleteflavour/:id',async(req,res)=> {
    try{
        const {id} = req.params;
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM defaultdb.icecream WHERE id=?'+id);
        res.status(201).json({message:'Flavour '+id+' deleted successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Server error for deleteflavour'});
    }
});