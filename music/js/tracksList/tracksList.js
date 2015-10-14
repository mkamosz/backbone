(function (app, $, Backbone) {

    var view;

    app.getDates = function(date){
        var d = new Date(parseInt(date)),
            y = d.getFullYear(),
            mo = (d.getMonth()+1 < 10 ? '0' + d.getMonth()+1 : d.getMonth()+1 ),
            day = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate() );

        return (y +"-"+ mo +"-"+ day);
    };
    app.getDateTime = function(date){
        var d = new Date(date),
            y = d.getFullYear(),
            mo = (d.getMonth()+1 < 10 ? '0' + d.getMonth()+1 : d.getMonth()+1 ),
            day = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate() ),
            h = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours() ),
            m = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes() ),
            s = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds() );

        return (y+"/"+mo+"/"+day+"&nbsp;&nbsp;&nbsp;"+h+":"+m+":"+s);
    };

    var Track = Backbone.Model.extend({
        defualts : {
            title : "",
            url : "",
            author : "",
            time : "",
            category : "",
            date : "",
            favorite : ""
        },
        urlRoot : app.url.item
    });

    var TracksList = Backbone.Collection.extend({
        model : Track,
        url : app.url.list,
        getData : function(){
            var dfd = new $.Deferred();

            this.fetch({
                success : function(data){
                    dfd.resolve(data.models);
                },
                error : function(msg){
                    dfd.reject(msg)
                }
            });

            return dfd.promise();
        }
    });

    var TracksView = Backbone.View.extend({
        el : "#section .playlist",
        template : _.templateFromUrl("js/template/tracksList.html", {}),
        initialize : function(options){
            if(typeof view !== "undefined"){
                ClearBind();
            }
            this.render(options);
        },
        render : function(options){
            var template = this.template,
                options = options || {},
                collection = _.map( options.collection, function( model ){ return model.toJSON(); }),
                txt = (typeof options.txt !== "undefined" ? options.txt : {title : "All tracks"});

            for(var key in collection) {
                collection[key].date = app.getDates(collection[key].date)
            };

            this.$el.html(template({list : collection, txt : txt }));

            app.trigger("track-list-ready");
        },
        events : {
            "click .play-list-play" : "loadMusic",
            "click .favorite" : "favorite",
            "click .delete" : "deleteTrack",
            "click .edit" : "editTrack"

        },
        loadMusic : function(e){
            var $this = $(e.currentTarget),
                $icon = $this.find("span"),
                id = $this.data("id"),
                model = app.tracks.collection.get(id);


                if($icon.hasClass("glyphicon-pause")){
                    app.player.playerObj.jPlayer( "pause" );
                } else {
                    if($icon.hasClass("active")){
                        app.player.playerObj.jPlayer( "play" );
                    } else {
                        $(".play-list-play span").removeClass("active glyphicon-pause").addClass("glyphicon-play")
                        $icon.toggleClass("active");

                        app.player.playerObj.jPlayer( "destroy" );
                        app.player.playerObj = $("#jquery_jplayer_1").jPlayer({
                            ready: function () {
                                $(this).jPlayer("setMedia", {
                                    title: $this.attr("data-title"),
                                    mp3: $this.attr("href")
                                }).jPlayer("play");
                                app.history.addHistory(model);
                            },
                            pause : function(){
                                $this.find("span").toggleClass("glyphicon-pause glyphicon-play")
                            },
                            play : function(){
                                $this.find("span").addClass("active").toggleClass("glyphicon-pause glyphicon-play")
                            },
                            stop : function(){
                                $this.find("span").toggleClass("glyphicon-pause glyphicon-play")
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
                            volume : 0.2
                        });
                    }
                }

            e.preventDefault();
        },
        favorite : function(e) {
            var $this = $(e.currentTarget).find("a"),
                id = $this.data("id"),
                model = app.tracks.collection.get(id);



            if(model.attributes.favorite == 1){
                model.save({favorite: '0'},{
                    success : function(){
                        view = new TracksView({collection : app.tracks.collection.models });
                    }
                });
            } else {
                model.save({favorite: '1'},{
                    success : function(){
                        view = new TracksView({collection : app.tracks.collection.models });
                    }
                });
            }

            e.preventDefault();
        },
        deleteTrack : function(e){
            var $this = $(e.currentTarget),
                id = $this.data("id"),
                model = app.tracks.collection.get(id);


            if (confirm('Are you sure you want to delete the track?')) {
                model.destroy({success: function(model, response) {
                    app.tracks.collection.remove(this);

                    ClearBind();
                    view = new TracksView({collection : app.tracks.collection.models });

                    new app.menu.view();

                    $(".recently .delete[data-id='"+id+"']").trigger("click");

                }});
            }
            e.preventDefault();
        },
        editTrack : function(e){
            var $this = $(e.currentTarget),
                id = $this.data("id");

            new app.track.view({id : id});

            $("#section .middle").addClass("active");



            e.preventDefault();
        }
    });

    var ClearBind = function(){
        view.$el.off('click', '.play-list-play');
        view.$el.off('click', '.favorite');
        view.$el.off('click', '.delete');
        view.$el.off('click', '.edit');
    };

    app.on('start', function () {

        app.tracks = {
            model : Track,
            collection : new TracksList(),
            view : TracksView
        };

        app.tracks.collection.getData().then(function(data){
            view = new TracksView({collection : data });
            app.trigger("data-ready");
        });
    });

}(app, jQuery, Backbone));