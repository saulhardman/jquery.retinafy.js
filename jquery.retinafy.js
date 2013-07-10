// @saulhardman
// http://github.com/saulhardman/jquery.retinafy.js

(function (factory) {

    if (typeof define === 'function' && define.amd) {

        define(["jquery"], factory);

    } else {

        factory(jQuery);

    }

}(function ($) {

    var retinafy = {

        hasLocalStorage: false,

        passed: [],

        failed: [],

        init: function () {

            this.hasLocalStorage = this.localStorageTest();

            if (this.hasLocalStorage === true) {

                this.retrieveTests();

            }

        },

        fileExists: function (filepath, callback) {

            var self = this,
                def = $.Deferred();

            if (this.passed.indexOf(filepath) >= 0) {

                def.resolve(true);

            } else if (this.failed.indexOf(filepath) >= 0) {

                def.resolve(false);

            } else {

                $.ajax({url: filepath, type: "HEAD"}).success(function () {

                    self.pass(filepath);

                    def.resolve(true);

                }).error(function () {

                    self.fail(filepath);

                    def.resolve(false);

                });

            }

            return def;

        },

        pass: function (filepath) {

            this.passed.push(filepath);

        },

        fail: function (filepath) {

            this.failed.push(filepath);

        },

        storeTests: function () {

            localStorage["passed"] = JSON.stringify(this.passed);

            localStorage["failed"] = JSON.stringify(this.failed);

        },

        retrieveTests: function () {

            if (localStorage["passed"]) {

                this.passed = JSON.parse(localStorage["passed"]);

            }

            if (localStorage["failed"]) {

                this.failed = JSON.parse(localStorage["failed"]);

            }

        },

        localStorageTest: function () {

            if (typeof Modernizr !== "undefined" && Modernizr.localstorage === true) {

                return true;

            } else {

                try {

                    return "localStorage" in window && window["localStorage"] !== null;

                } catch (e) {

                    return false;

                }

            }

        }

    };

    retinafy.init();

    $.fn.retinafy = function () {

        var that = this;

        that.each(function () {

            if (window.devicePixelRatio > 1) {

                var $this = $(this),
                    $images = $this.find("img"),
                    imageTotal = $images.length,
                    imageCount = 0;

                $images.each(function () {

                    var $this = $(this),
                        retinaSrc = $this.attr("src").replace(/\.\w+$/, function (match) {
                            return "@2x" + match;
                        });

                    retinafy.fileExists(retinaSrc).then(function (exists) {

                        imageCount++;

                        if (exists === true) {

                            $this.attr("src", retinaSrc);

                            if ($this.attr("width") === undefined) {

                                $this.attr("width", $this.width());

                            }

                            if ($this.attr("height") === undefined) {

                                $this.attr("height", $this.height());

                            }

                        }

                        if (imageCount === imageTotal && retinafy.hasLocalStorage === true) {

                            retinafy.storeTests();

                        }

                    });

                });

            }

        });        

        return that;

    };

}));