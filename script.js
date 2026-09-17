document.addEventListener("DOMContentLoaded", function () {

  /*
   * Go Green main page
   *
   * The main page currently only needs
   * smooth navigation.
   *
   * New initiatives can later be added
   * without changing this structure.
   */


  const heroButton =
    document.querySelector(".hero-btn");


  if (heroButton) {

    heroButton.addEventListener(
      "click",
      function () {

        const section =
          document.getElementById(
            "initiatives"
          );


        if (section) {

          section.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }
    );

  }


});
