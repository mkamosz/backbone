(function (app, $, Backbone) {

    var view;

    var AddButtonView = Backbone.View.extend({
        el : "#header .add",
        template : _.templateFromUrl("js/template/addButton.html", {}),
        initialize : function(){
            this.render();
        },
        render : function(){
            var template = this.template;

            this.$el.html(template());
        },
        events : {
            "click button" : "activeForm"
        },
        activeForm : function(){
            $("#section .middle .form form").attr("data-id","").find("h2>span").text("Add track");
            $("#section .middle .form form").find("input,select").val("");
            $("#section .middle").toggleClass("active");
        }
    });

    var TrackFormView = Backbone.View.extend({
        el : "#section .form",
        template : _.templateFromUrl("js/template/trackForm.html", {}),
        initialize : function(options){
            if(typeof view !== "undefined"){
                ClearBind();
            }
            this.render(options);
        },
        render : function(options){
            var template = this.template,
                model;

            if(typeof options !== "undefined"){
                model = app.tracks.collection.get(options.id).toJSON();
            }

            this.$el.html(template({music : model}));


        },
        events : {
            "click .closeForm" : "closeForm",
            "submit .user-form" : "addTrack",
            "click .random" : "random"
        },
        random : function(e){
            var $this = $(e.currentTarget);
            $this.parent().find("input").val(app.randomTracks[Math.round(Math.random()*19)]);
            e.preventDefault();

        },
        addTrack : function(e){
            var $this = $(e.currentTarget),
                musicDetails = $(e.currentTarget).serializeObject(),
                music = new app.tracks.model(musicDetails),
                id = $this.data("id"),
                model,
                $button = $this.find("button"),
                $loader = $this.find(".loader"),
                $error = $this.find(".error"),
                check = true,
                refreshView = function(){
                    new app.tracks.view({collection : app.tracks.collection.models });

                    $("#header .add button").trigger("click");
                    $this.find("input,select").val("");
                    $button.show();
                    $loader.hide();
                };

            $this.find("input[type='text'],select").each(function(){
                if($(this).val() == ""){
                    check = false;
                    $error.fadeIn();
                    setTimeout(function(){$error.fadeOut();},3000);
                }
            });

            if(check){
                $button.hide();
                $loader.show();

                music.set({date : new Date().getTime()});

                if(id != ''){
                    model = app.tracks.collection.get(id);
                    model.set(musicDetails)
                    model.save();

                    refreshView();
                    new app.menu.view();

                } else {
                    music.save(musicDetails, {
                        success : function(obj){

                            music.set({id : obj.id});
                            music.save();
                            app.tracks.collection.add(music);

                            refreshView();
                            new app.menu.view();
                        }
                    });
                }
            }
        },
        closeForm : function(){
            $("#header .add button").trigger("click");
        }
    });

    var ClearBind = function(){
        view.$el.off('click', '.closeForm');
        view.$el.off('submit', '.user-form');
        view.$el.off('click', '.random');
    };

    app.on('start', function () {
        app.track = {
            view : TrackFormView
        };

        view = new TrackFormView();
        new AddButtonView();
    });

}(app, jQuery, Backbone));