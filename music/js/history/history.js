(function (app, $, Backbone) {

    var view ;

    var HistoryModel = Backbone.Model.extend({
       default : {
           title : "",
           id : "",
           date : ""
       },
       initialize : function(){
           this.on("add",this.onAdd);
       },
       onAdd : function(){
           this.save();
       }
    });

    var HistoryList = Backbone.Collection.extend({
        model : HistoryModel,
        localStorage: new Backbone.LocalStorage("music-history"),
        initialize : function(){
            this.fetch();

            this.comparator = function(item) {
                return item.get("date");
            };

            this.comparator = reverseSortBy(this.comparator);
            this.sort({sort: true});
        }
    });


    var HistoryView = Backbone.View.extend({
        el : '#section .history',
        template : _.templateFromUrl("js/template/history.html", {}),
        initialize: function () {
            this.collection = app.history.collection;
            this.render();
        },
        render : function(){
            var that = this,
                template = this.template,
                collection = this.collection.toJSON();

            for(var key in collection) {
                collection[key].date = app.getDateTime(collection[key].date)
            };

            this.$el.html(template({list : collection}));
        },
        events : {
            "click .delete" : "delete",
            "click .play" : "play"
        },
        delete : function(e){
            var $this = $(e.currentTarget),
                id = $this.data('id'),
                model = app.history.collection.get(id);

                model.destroy({success: function(model, response) {
                    app.history.collection.remove(this);
                }});

                ClearBind();
                view = new app.history.historyView();

            e.preventDefault();
        },
        play : function(e){
            var $this = $(e.currentTarget),
                id = $this.data('id');

            new app.tracks.view({collection : app.tracks.collection.models });

            $("#section .play-list-play[data-id='"+id+"']").trigger("click", [ "delete"] );
            e.preventDefault();
        }

    });

    var AddItemHistory = function(model){
        var userDetails = {
                title : model.attributes.title,
                date : (new Date()).getTime(),
                id : model.attributes.id
            },
            tmpModel;

        if(typeof app.history.collection.get(model.attributes.id) === "undefined"){
            app.history.collection.add(new app.history.model(userDetails));
        } else {
            tmpModel = app.history.collection.get(model.attributes.id);
            tmpModel.set(userDetails);
            tmpModel.save();
        }
        ClearBind();

        app.history.collection.comparator = function(item) {
            return item.get("date");
        };

        app.history.collection.comparator = reverseSortBy(app.history.collection.comparator);
        app.history.collection.sort({sort: true});

        view = new app.history.historyView();


    };

    var ClearBind = function(){
        view.$el.off('click', '.delete');
        view.$el.off('click', '.play');
    };

    app.on('start', function () {
        app.history = {
            model : HistoryModel,
            collection : new HistoryList(),
            historyView : HistoryView,
            addHistory : AddItemHistory,
            clearBind : ClearBind
        };

        view = new app.history.historyView();
    });

}(app, jQuery, Backbone));