(function (app, $, Backbone) {

    var SortView = Backbone.View.extend({
        el : '.sort',
        template : _.templateFromUrl("js/template/sort.html", {}),
        initialize : function(){
            this.render();
        },
        render : function(){
            var that = this,
                template = this.template({lang : app.lang.choose});

            this.$el.html(template);
        },
        events : {
            "click button" : "sort"
        },
        sort : function(e){
            var $this = $(e.currentTarget),
                type = $this.data("type");

            $this.toggleClass("selected");

            app.person.collection.comparator = function(item) {
                return item.get(type);
            };

            if($this.hasClass("selected")){
                app.person.collection.comparator = reverseSortBy(app.person.collection.comparator);
            }

            app.person.collection.sort({sort: true});

            app.person.refreshListView();
            app.trigger('refresh-categories');
        }
    });

    app.on('start', function () {
        app.sort = {
            sortView :  SortView
        };

        new app.sort.sortView();
    });

}(app, jQuery, Backbone));