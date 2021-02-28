const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});
const itemsSchema = {
    toDoItemName: String
}
const Item = mongoose.model('Item', itemsSchema)

const item1 = new Item({
    toDoItemName: 'Finish 2 models section'
})
const item2 = new Item({
    toDoItemName: 'Checkout if it is ok'
})
const item3 = new Item({
    toDoItemName: 'Try another methodds'
})
const defaultItems = [item1, item2, item3];
Item.insertMany(defaultItems, function(err){
    if (err){
        console.log(err);
    }else{
        console.log('Successfully saved to DB');
    }
})

app.get('/', function(req, res){
    Item.find({}, function(err, foundItems){
        res.render('list', {listTitle: 'Today', newListItems: foundItems})
    })
})

app.post('/', function(req, res){
    const newItem = req.body.todoItem;
    console.log(req.body.list);
    if(req.body.list === 'Work'){
        workList.push(newItem);
        res.redirect('/work')
    }else{
        defaultItems.push(newItem);
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
