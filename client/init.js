(function($){
    $(function(){

        $(document).ready(function(){
            $('.button-collapse').sideNav();
            //alert(1);
        });



        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
        });

        $('.collapsible').collapsible();


        $(document).scroll(function () {
            var y = $(this).scrollTop();
            if (y > 800) {
                $('#scrollTest').fadeIn(1000);
            } else {
                $('#scrollTest').fadeOut(1000);
            }

        });




        $(window).scroll( function(){

            //$("#scrollTest").fadeIn(3000);
            /* Check the location of each desired element */
            $('.hideme').each( function(i){

                var bottom_of_object = $(this).offset().top + $(this).outerHeight();
                var bottom_of_window = $(window).scrollTop() + $(window).height();

                /* If the object is completely visible in the window, fade it it */
                if( bottom_of_window > bottom_of_object ){

                    $(this).animate({'opacity':'1'},500);

                }

            });

        });



    }); // end of document ready
})(jQuery); // end of jQuery name space

