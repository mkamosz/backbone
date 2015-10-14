/**
 * Created by kamoszm on 2014-11-03.
 */

var app = (function ($, Backbone) {

    'use strict';

    var AppView = Backbone.View.extend({
        el: '#book',
        start: function () {
        }
    });

    return new AppView();

}(jQuery, Backbone));


//Router
(function (app, $, Backbone) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'index',
            'edit/:id' : 'edit',
            'pl' : 'pl',
            'en' : 'en'
        },
        index : function(){
        },
        edit : function(id){
            app.trigger('edit-person', id);
        }
    });

    app.on('start', function () {
        app.router = new AppRouter();

        Backbone.history.start();
    });

}(app, jQuery, Backbone));


var LoginView = Backbone.View.extend({
    el : "#loginForm",
    template : _.templateFromUrl("js/template/login.html", {}),
    initialize : function(){
        this.render();
    },
    render : function(){
        var template = this.template;
        this.$el.append(template());
        if(typeof(Storage) !== "undefined") {
            if(localStorage.getItem("loginBook") == "true"){
                this.$el.parent().addClass("active");
                this.$el.hide();
            } else {
                this.$el.parent().addClass("in");
            }
        } else {
            this.$el.parent().addClass("in");
        }
    },
    events : {
        "submit form" : "check"
    },
    check : function(e){
        var that = this,
            $this = $(e.currentTarget),
            loginField = $this.find("#login").val(),
            passwordField = $this.find("#password").val(),
            $error =  $this.find(".error");

        if(loginField == "demo" && passwordField == "demo"){
            that.$el.parent().removeClass("in").addClass("active");
            setTimeout(function(){that.$el.hide()},500);

            if(typeof(Storage) !== "undefined") {
                localStorage.setItem("loginBook", "true");
            }

        } else {
            $this.addClass("error")
            setTimeout(function(){
                $this.removeClass("error")
            },5000);
        }
        e.preventDefault();
    }
});

app.login = {
    view : new LoginView()
};


