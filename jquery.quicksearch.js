(function ($) {
    class Quicksearch {
        constructor(selector, target, options) {

            this.selector = selector;
            this.target = target;
            this.timeout = 110;
            this.cache = '';
            this.rowcache = "";
            this.jq_results = "";
            this.val = '';
            this.$this = this;
            this.options = options;



        }

                init() {
            this.cacheF();// chaque  select convert to string ( strip_html )stocker dans variable rowcach et run go()
            this.results(true);
            this.stripe();
            this.loader(false);
        }
        ;
                trigger() {
            this.loader(true); // charge logo gif
            this.options.onBefore(); // charg function

            window.clearTimeout(this.timeout);
            var $this = this;
            this.timeout = window.setTimeout(function () {
                $this.go();
            }, this.options.delay);

            return this;
        }
        ;
                go() {

            var i = 0,
                    numMatchedRows = 0,
                    noresults = true,
                    query = this.options.prepareQuery(this.val), // val to array avec toLowerCase
                    val_empty = (this.val.replace(' ', '').length === 0);

            for (var i = 0, len = this.rowcache.length; i < len; i++) { // chaque elemant de list qui select
                if (val_empty || this.options.testQuery(query, this.cache[i], this.rowcache[i])) {
                    this.options.show.apply(this.rowcache[i]);
                    noresults = false;
                    numMatchedRows++;
                } else {
                    this.options.hide.apply(this.rowcache[i]);
                }
            }

            if (noresults) {
                this.results(false, numMatchedRows);
            } else {
                this.results(true, numMatchedRows);
                this.stripe();
            }

            this.loader(false);
            this.options.onAfter();

            return this.selector;
        }
        ;
                stripe() {

            if (typeof this.options.stripeRows === "object" && this.options.stripeRows !== null)
            {
                var joined = this.options.stripeRows.join(' ');
                var stripeRows_length = this.options.stripeRows.length;

			this.jq_results.not(':hidden').each(function (i) {
				$(this).removeClass(joined).addClass(this.options.stripeRows[i % stripeRows_length]);
				});

            }

            return this;
        }
        ;
                results(bool, numMatchedRows) {
            if (typeof this.options.noResults === "string" && this.options.noResults !== "") {
                if (bool) {
                    $(this.options.noResults).hide();
                } else {
                    $(this.options.noResults).show();
                }
            }

            if (typeof this.options.totalResults === "string" && this.options.totalResults !== "") {
                $(this.options.totalResults).html(numMatchedRows);
            }
            return this;
        }
        ;
                loader(bool) { // logo loader.gif
            if (typeof this.options.loader === "string" && this.options.loader !== "") {
                (bool) ? $(this.options.loader).show() : $(this.options.loader).hide();
            }
            return this;
        }
        ;
                cacheF() {


            this.jq_results = $(this.target);

            if (typeof this.options.noResults === "string" && this.options.noResults !== "") {
                this.jq_results = this.jq_results.not(this.options.noResults);
            }

            var t = (typeof this.options.selector === "string") ? this.jq_results.find(this.options.selector) : $(this.target).not(this.options.noResults);
            this.cache = t.map(function () {
                return $.trim((this.innerHTML).replace(new RegExp('<[^<]+\>', 'g'), "").toLowerCase());

            });

            this.rowcache = this.jq_results.map(function () {
                return this;
            });

            return this.go();  // val defauld
        }
        ;
    }




    $.fn.quicksearch = function (target, opt) {


        var options = $.extend({
            delay: 100,
            selector: null,
            stripeRows: null,
            loader: null,
            noResults: '',
            totalResults: '#total',
            bind: 'keyup',
            onBefore: function () {
                return;
            },
            onAfter: function () {
                return;
            },
            show: function () {
                this.style.display = "";
            },
            hide: function () {
                this.style.display = "none";
            },
            prepareQuery: function (val) {
                return val.toLowerCase().split(' ');
            },
            testQuery: function (query, txt, _row) {
                for (var i = 0; i < query.length; i++) {
                    if (txt.indexOf(query[i]) === -1) {
                        return false;
                    }
                }
                return true;
            }
        }, opt);


        var quicksearchq = new Quicksearch(this, target, options)
             quicksearchq.init()

        var fin = this.each(function () {
            $(this).on('keyup'  // event keyup
                    , function () {
                        quicksearchq.val = $(this).val();
                        quicksearchq.trigger();
                    });
        });
        return fin
    };

}(jQuery));
