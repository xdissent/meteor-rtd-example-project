(function () {
    "use strict";

    jasmine.getEnv().defaultTimeoutInterval = 20000;

    // GENERIC MIXIN
    var helper = require('rtd').helper,
        webdriver = require('selenium-webdriver'),
        driver;


    var resetApp = function () {
        var deferred = webdriver.promise.defer();
        driver.get('http://localhost:8000/reset').then(function () {
            deferred.fulfill();
        });
        return deferred.promise;
    };

    var openApp = function () {
        var deferred = webdriver.promise.defer();
        driver.get('http://localhost:8000').then(function () {
            deferred.fulfill();
        });
        return deferred.promise;
    };

    var error = function (err) {
        console.log('\n');
        console.error(err);
        console.error('Error in acceptance tests');
    };

    // ****************************************************************************************

    beforeEach(function () {
        var ready = false;
        helper.getDriverPromise().then(function (result) {
            driver = result;
            resetApp().
                then(openApp).
                then(function () {
                    ready = true;
                });
        });
        waitsFor(function () {
            return ready;
        }, "App didn't reset", 10000);
    });

    afterEach(function() {
        var ready = false;
        helper.postBackCoverage().then(function () {
            ready = true;
        });
        waitsFor(function () {
            return ready;
        }, "Coverage didn't postback", 10000);
    });

    describe("Sample app", function () {

        it("says hello", function (done) {
            driver.findElement(webdriver.By.tagName('h1')).getText()
                .then(function (value) {
                    expect(value).toBe('Hello World!');
                    done();
                }, error);
        });

        it("logs when you click the button", function (done) {
            var setup = 'console._log=console.log;console.log=function(m){console._logged=m}',
                reset = 'console.log=console._log;delete console._log;delete console._logged';
            driver.executeScript(setup);
            driver.findElement(webdriver.By.tagName('input')).click();
            driver.executeScript('return console._logged').then(function (msg) {
                return driver.executeScript(reset).then(function () {
                    expect(msg).toBe('You pressed the button');
                    done();
                });
            });
        });

        it("doesn't log when you click the button if no console is defined", function (done) {
            var setup = 'window._console=console;window.console=undefined',
                reset = 'window.console=window._console;delete window._console';
            driver.executeScript(setup);
            driver.findElement(webdriver.By.tagName('input')).click();
            driver.executeScript(reset).then(function () {
                expect(null).toBe(null);
                done();
            });
        });
    });

})();