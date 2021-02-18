const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const date = require(__dirname + '/date.js');



let newItem = '';
toDoList = ['Buy Food', 'Cook Food', 'Eat Food'];
workList = [];

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', function(req, res){
    let day = date.getDate();
    res.render('list', {listTitle: day, newListItems: toDoList})
})

app.post('/', function(req, res){
    let newItem = req.body.todoItem;
    console.log(req.body.list);
    if(req.body.list === 'Work'){
        workList.push(newItem);
        res.redirect('/work')
    }else{
        toDoList.push(newItem);
        res.redirect('/');
    }

})

app.get('/work', function(req, res){
    res.render('list', {listTitle: 'Work List', newListItems: workList})
})

app.get('/about', function(req, res){
    res.render('about')
})


app.listen(3000, function(){
    console.log('The server listen on port 3000')
})
