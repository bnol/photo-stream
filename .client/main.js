var Vue = global.Vue = require('vue')
var App = Vue.extend(require('./app/app.vue'))
require('bootstrap-sweetalert/lib/sweet-alert.js');
require('bootstrap-sweetalert/lib/sweet-alert.css');

global.swale = function (error) {
    swal("Oops...", error.reason || error.message, "error");    
}

Vue.use(require('vue-moment'));

Meteor.startup(function() {
    new App({ el: '#app' })
})