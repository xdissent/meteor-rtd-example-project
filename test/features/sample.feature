Feature: Home page says hello
  In order to see my welcome message
  As a visitor to the site
  I want to see the words "Hello World!"
 
  Scenario: Go to home page
    Given I am a website visitor
    When I go to the home page
    Then I should see "Hello World!"