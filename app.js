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

const listSchema = {
    name: String,
    items: [itemsSchema]
}
const List = mongoose.model('List', listSchema);

app.get('/', function(req, res){

    Item.find({}, function(err, foundItems){
        if (foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if (err){
                    console.log(err);
                }else{
                    console.log('Successfully saved to DB');
                }
            });
        res.redirect('/');
        }else{
        res.render('list', {listTitle: 'Today', newListItems: foundItems})
        }
    });
;
})

app.get('/:customListPage', function(req, res){
    const customListPage = req.params.customListPage;
    List.findOne({name: customListPage}, function(err, foundList){
        if (!err){
            if (!foundList){
                //Create a new list
                const list = new List({
                    name: customListPage,
                    items: defaultItems
                });
                list.save();
                res.redirect('/' + customListPage);
                console.log(req.params);
            }else{
                //Show an existing list
                res.render('list', {listTitle: foundList.name, newListItems: foundList.items})
            }
        }
    })

});

app.post('/', function(req, res){
    const newItem = req.body.todoItem;
    const I = new Item({
        toDoItemName: newItem
    });
    I.save();
    res.redirect('/');
});

app.post('/delete', function(req, res){
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, function(err){
        if (err){
            console.log(err);
        }else{
            console.log('Removed successfully');
            res.redirect('/');
        }
    })
})

app.get('/about', function(req, res){
    res.render('about')
})


app.listen(3000, function(){
    console.log('The server listen on port 3000')
})
