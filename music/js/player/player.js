(function (app, $, Backbone) {

    var view;

    var Player = Backbone.View.extend({
        el : "#section .player",
        template : _.templateFromUrl("js/template/player.html", {}),
        initialize : function(){
            this.render();
        },
        render : function(list){
            var template = this.template,
                $firstItem = $(".play-list-play:first");

            this.$el.html(template());

            if(typeof app.player.playerObj === "undefined"){
                app.player.playerObj = $("#jquery_jplayer_1").jPlayer({
                    ready: function () {
                        $(this).jPlayer("setMedia", {
                            title: $firstItem.attr("data-title"),
                            mp3: $firstItem.attr("href")
                        });
                    },
                    pause : function(){
                        $firstItem.find("span").toggleClass("glyphicon-pause glyphicon-play")
                    },
                    play : function(){
                        $firstItem.find("span").addClass("active").toggleClass("glyphicon-pause glyphicon-play")
                    },
                    stop : function(){
                        $firstItem.find("span").toggleClass("glyphicon-pause glyphicon-play")
                    },
                    swfPath: "../../js/jplayer",
                    supplied: "mp3",
                    wmode: "window",
                    useStateClassSkin: true,
                    autoBlur: false,
                    smoothPlayBar: true,
                    keyEnabled: true,
                    remainingDuration: true,
                    toggleDuration: true,
                    autoPlay : true,
                    preload: "auto",
                    volume : 0.2
                });
            }
        }
    });

    app.on('start', function () {
        app.player = {
            view : Player,
            loaded : false
        };

        app.on('track-list-ready', function () {
            view = new Player();
        });
    });



}(app, jQuery, Backbone));