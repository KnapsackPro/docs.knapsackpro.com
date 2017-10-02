$(document).ready(function() {
  var testRunners = $("#test-runner-rspec, #test-runner-cucumber, #test-runner-minitest, #test-runner-test-unit, #test-runner-spinach, #vcr-webmock-fakeweb");

  testRunners.change(function() {
    id = $(this).attr('id');
    guideId = $("#guide-" + id);

    if($(this).prop('checked') == true) {
      $(guideId).show();
    } else {
      $(guideId).hide();
    }
  });

  $('input[type=radio][name=ci-provider]').change(function() {
    $("#guide-providers div.hidden").hide();
    guideId = $("#guide-provider-" + this.value);
    $(guideId).show();

    // when CI provider was selected then show final step
    $("#guide-final-step").show();
  });
});
