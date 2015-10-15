var express = require('express');
var port = 3000;
var app = express();
var path = require('path');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/carShop');

var ModelCar = require('./models/car');

var morgan = require('morgan');
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '../client')));

app.locals.moment = require('moment');

app.set('views', __dirname + '/views/pages');
app.set('view engine', 'jade');

app.locals.pretty = true;

app.get('/', function(req, res) {
  ModelCar.fetch(function(err, cars) {

    if (err) {
      return next(err);
    }

    res.render('index', {
      title: '汽车商城 首页',
      cars: cars
    });

  });
});

app.get('/car/:id', function(req, res) {
  var id = req.params.id;

  ModelCar.findById(id, function(err, car) {
    if (err) {
      return next(err);
    }
    res.render('car_detail', {
      title: '汽车商城 详情页',
      car: car
    });
  });
});

app.get('/admin/car/list', function(req, res) {
  ModelCar.fetch(function(err, cars) {
    if (err) {
      return next(err);
    }
    res.render('car_list.jade', {
      title: '汽车商城 列表页',
      cars: cars
    });
  });
});

app.get('/admin/car/new', function(req, res) {
  res.render('car_admin', {
    title: '汽车商城 后台录入页',
    car: {}
  });
});

app.get('/admin/car/update/:id', function(req, res) {
  var id = req.params.id;
  ModelCar.findById(id, function(err, car) {
    if (err) {
      return next(err);
    }
    res.render('car_admin', {
      title: '汽车商城 后台录入页',
      car: car
    });
  });
});


app.listen(port);

require('express-debug')(app, {
  panels: ['locals', 'request', 'session', 'template', 'software_info', 'nav']
});

console.log("汽车商城网站服务已启动,监听端口号:" + port);

var errorhandler = require('errorhandler');
app.use(errorhandler);
