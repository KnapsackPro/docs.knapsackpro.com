$(document).ready(function() {
  var emailField = $("#mce-EMAIL");

  emailField.focus(function() {
    $("#x-newsletter-optional-fields").slideDown();
  });
});
