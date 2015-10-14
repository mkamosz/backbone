/**
 * Created by kamoszm on 2014-11-03.
 */

var app = (function ($, Backbone) {

    'use strict';

    var AppView = Backbone.View.extend({
        el: '#music',
        start: function () {
            app.trigger('start');

            $("#section .left").mCustomScrollbar({
                axis:"y"
            });
            $("#section .middle").mCustomScrollbar({
                axis:"y"
            });
        }
    });


    return new AppView();

}(jQuery, Backbone));

//Router
(function (app, $, Backbone) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'index'
        },
        index : function(){
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
            if(localStorage.getItem("loginMusic") == "true"){
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
                localStorage.setItem("loginMusic", "true");
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


//app.url = {
//    item : 'http://kamosz.pl/backbone/api/data/music',
//    list : 'http://kamosz.pl/backbone/api/data/musics'
//};

app.url = {
    item : 'http://backbone/api/data/music',
    list : 'http://backbone/api/data/musics'
};
app.randomTracks = [
    "http://nubeat.org/Audio/HT/09%20Midnight%20Hour.mp3",
    "http://nubeat.org/Audio/HT/08%20Possessed.mp3",
    "http://nubeat.org/Audio/HT/07%20Trust.mp3",
    "http://nubeat.org/Audio/HT/06%20Your%20Everything.mp3",
    "http://nubeat.org/Audio/HT/05%20Can't%20Breathe.mp3",
    "http://nubeat.org/Audio/HT/04%20Feel%20Like%20Livin'.mp3",
    "http://nubeat.org/Audio/MHH/02%20You%20Can%20Face%20Tomorrow.mp3",
    "http://nubeat.org/Audio/HT/02%20Ease%20it%20All.mp3",
    "http://nubeat.org/Audio/MHH/03%20The%20Stranger.mp3",
    "http://nubeat.org/Audio/LDB/01%20In%20the%20Time%20of%20the%20End.mp3",
    "http://nubeat.org/Audio/LDB/02%20Signs%20of%20the%20End.mp3",
    "http://nubeat.org/Audio/LDB/03%20The%20Antichrist%20Shall%20Come.mp3",
    "http://nubeat.org/Audio/MHH/04%20Footprints.mp3",
    "http://nubeat.org/Audio/LDB/05%20All%20the%20World%20Shall%20Wonder.mp3",
    "http://nubeat.org/Audio/LDB/06%20Count%20the%20Number.mp3",
    "http://nubeat.org/Audio/MHH/01%20Beyond%20Compare.mp3",
    "http://nubeat.org/Audio/LDB/08%20Sign%20of%20the%20Son.mp3",
    "http://nubeat.org/Audio/LDB/09%20Marriage%20Supper%20of%20the%20Lamb.mp3",
    "http://nubeat.org/Audio/HT/09%20Midnight%20Hour.mp3",
    "http://nubeat.org/Audio/HT/10%20Called.mp3"
];





