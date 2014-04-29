module.exports = function () {
  this.World = require("../support/world.js").World;

  this.Given(/^I am a website visitor$/, function(callback) {
    callback();
  });

  this.When(/^I go to the home page$/, function(callback) {
    this.browser.get('http://localhost:8000').then(function () {
      callback();
    }, function (err) {
      callback.fail(err);
    });
  });

  this.Then('I should see "$text"', function(text, callback) {
    this.browser.getPageSource().then(function (source) {
      if (source.indexOf(text) === -1) {
        callback.fail(new Error('Expected to find ' + text + ' in ' + source));
      } else {
        callback();
      }
    }, function (err) {
      callback.fail(err);
    });
  });
};