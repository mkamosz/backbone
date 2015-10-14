(function (app, $, Backbone) {

    app.lang = {};

    var Lang = Backbone.Model.extend({});

    var Languages = Backbone.Collection.extend({
        model: Lang,
        url : 'js/lang/lang.json'
    });

    var LangView = Backbone.View.extend({
        el : '.language',
        template : _.templateFromUrl("js/template/language.html", {}),
        initialize : function(){
            this.getData();
            this.render();
        },
        render : function(){
            var that = this,
                template = this.template;

            this.$el.html(template());
        },
        getData : function(){
            var that = this;
            var collection = new Languages();

            collection.fetch({
                success: function (data) {
                    app.lang.collection = data;
                    app.lang.pl = app.lang.collection.toJSON()[0].pl;
                    app.lang.en = app.lang.collection.toJSON()[0].en;
                    app.lang.choose = app.lang.en;
                    app.trigger('start');

                },
                error: function() {
                    console.log('Failed to fetch!');
                }
            });
        },
        events : {
            "click li a" : "changeLanguage"
        },
        changeLanguage : function(e){
            var $this = $(e.currentTarget),
                type = $this.data("lang");
            if(type == 'pl'){
                app.lang.choose = app.lang.pl;
            } else {
                app.lang.choose = app.lang.en;
            }
            RefreshLanguage();
        }
    });

    var RefreshLanguage = function(){
        new app.person.personAddButton();
        new app.person.personAddButton();
        app.person.refreshListView();
        app.trigger("refresh-categories");
        new app.search.searchInputView();
        new app.sort.sortView();
    }

    app.lang = {
        langView :  new LangView()
    };



    app.on('lang-pl', function () {
        app.lang.choose = app.lang.pl;
        RefreshLanguage();
    });

    app.on('lang-en', function () {
        app.lang.choose = app.lang.en;
        RefreshLanguage();
    });


}(app, jQuery, Backbone));