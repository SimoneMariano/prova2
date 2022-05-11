$(document).ready(() => {
  $("#footer").html(`&copy; ${new Date().getFullYear()} - Socialify`);
});

/* $(document).ready(() => {
  $("#registration").submit((event) => {
    event.preventDefault();

    const firstName = $("#firstName").val();
    const lastName = $("#lastName").val();
    const email = $("#registrationEmail").val();
    const password = $("#password").val();
    const retypedPassword = $("#retypedPassword").val();

    if (!firstName || !lastName || !email || !password || !retypedPassword) {
      alert("complete every input");
      return;
    }
  });
});
 */
