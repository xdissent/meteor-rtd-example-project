var path = require('path');

module.exports = {
  World: function World(ready) {

    var Webdriver = require(path.resolve(require.resolve('rtd'), '../webdrivers/cucumber-webdriver.js'))('chrome', 2000, 2000);

    var world = this;
    Webdriver.getBrowser(function (browser) {
      world.webdriver = Webdriver.driver;
      world.browser = browser;
      ready();
    });
  }
};