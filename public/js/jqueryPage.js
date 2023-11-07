$(document).ready(() => {
      $("#register").click(() => {
            $("#first").show();
            $("#second").hide();
      });

      $("#login").click(() => {
            $("#first").hide();
            $("#second").show();
      });

      // Hide the "second-div" initially
      $("#second").hide();
});
