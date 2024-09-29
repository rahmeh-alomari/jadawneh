$(".item-nav").on("click", function () {
  var item = $(this).find(".custom-dropdown-menu");
  if (item.hasClass("show")) {
    item.removeClass("show");
  } else {
    $(".custom-dropdown-menu").removeClass("show");
    item.addClass("show");
  }
});
$(".new-nav-item").on("click", function () {
  var item = $(this).find(".custom-dropdown-menu2");
  if (item.hasClass("show")) {
    item.removeClass("show");
  } else {
    $(".custom-dropdown-menu2").removeClass("show");
    item.addClass("show");
  }
});
$(".new-nav-item2").on("click", function () {
  var item = $(this).find(".custom-dropdown-menu3");
  if (item.hasClass("show")) {
    item.removeClass("show");
    console.log("show0");
  } else {
    $(".custom-dropdown-menu3").removeClass("show");
    item.addClass("show");
    console.log("show");
  }
});

$("html").click(function (e) {
  if (!$(e.target).hasClass("fa-ellipsis-h")) {
    $(".custom-dropdown-menu2").removeClass("show");
  }
  if (!$(e.target).hasClass("new-nav-item2")) {
    $(".custom-dropdown-menu3").removeClass("show");
  }

  if ($(e.target).parent().hasClass("new-nav-item2")) {
    $(".new-nav-item2").click();
  }
});

$(document).ready(function () {
  var owl = $(".main-category-slider");
  var _arrows = [
    '<i class="fa-solid fa-chevron-left fa-xl" aria-hidden="true"></i>',
    '<i class="fa-solid fa-chevron-right fa-xl" aria-hidden="true"></i>',
  ];
  if ($("body").hasClass("has-rtl")) {
    _arrows = [
      '<i class="fa-solid fa-chevron-right fa-xl" aria-hidden="true"></i>',
      '<i class="fa-solid fa-chevron-left fa-xl" aria-hidden="true"></i>',
    ];
  }
  owl.owlCarousel({
    margin: 15,
    dots: false,
    nav: true,
    loop: false,
    rtl: $("body").hasClass("has-rtl"),
    ltr: $("body").hasClass("has-ltr"),
    navText: _arrows,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 4,
      },
      1200: {
        items: 6,
      },
    },
  });
});
$(document).ready(function () {
  var _arrows = [
    '<i class="fa-solid fa-chevron-right fa-xl" aria-hidden="true"></i>',
    '<i class="fa-solid fa-chevron-left fa-xl" aria-hidden="true"></i>',
  ];
  if ($("body").hasClass("has-rtl")) {
    _arrows = [
      '<i class="fa-solid fa-chevron-right fa-xl" aria-hidden="true"></i>',
      '<i class="fa-solid fa-chevron-left fa-xl" aria-hidden="true"></i>',
    ];
  }

  var owl = $(".podcasters-slider");
  owl.owlCarousel({
    margin: 15,
    dots: false,
    nav: true,
    loop: false,
    rtl: $("body").hasClass("has-rtl"),
    navText: _arrows,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 4,
      },
      1200: {
        items: 6,
      },
    },
  });
});

/* Arrows for slider*/
$(document).ready(function () {
  var _arrows = [
    '<i class="fa-solid fa-chevron-right fa-xl" aria-hidden="true"></i>',
    '<i class="fa-solid fa-chevron-left fa-xl" aria-hidden="true"></i>',
  ];
  if ($("body").hasClass("has-rtl")) {
    _arrows = [
      '<i class="fa-solid fa-chevron-right fa-xl" aria-hidden="true"></i>',
      '<i class="fa-solid fa-chevron-left fa-xl" aria-hidden="true"></i>',
    ];
  }
  var owl = $(".category-slider");
  owl.owlCarousel({
    margin: 15,
    dots: false,
    nav: true,
    loop: false,
    rtl: $("body").hasClass("has-rtl"),
    navText: _arrows,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 4,
      },
      1200: {
        items: 5,
      },
    },
  });
});

$(document).ready(function () {
  var _arrows = [
    '<i class="fa-solid fa-chevron-left fa-xl" aria-hidden="true"></i>',
    '<i class="fa-solid fa-chevron-right fa-xl" aria-hidden="true"></i>',
  ];
  if ($("body").hasClass("has-rtl")) {
    _arrows = [
      '<i class="fa-solid fa-chevron-right fa-xl" aria-hidden="true"></i>',
      '<i class="fa-solid fa-chevron-left fa-xl" aria-hidden="true"></i>',
    ];
  }
  var owl = $(".second-slider");
  owl.owlCarousel({
    margin: 10,
    dots: false,
    nav: true,
    loop: true,
    rtl: $("body").hasClass("has-rtl"),
    navText: _arrows,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
  });
  owl
    .mouseenter(function () {
      owl.trigger("stop.owl.autoplay");
    })
    .mouseleave(function () {
      owl.trigger("play.owl.autoplay", [3000]);
    });
});
jQuery(document).ready(function ($) {
  var homeSlider = $(".custom1").owlCarousel({
    animateOut: "slideOutDown",
    animateIn: "flipInX",
    items: 1,
    margin: 30,
    stagePadding: 30,
    smartSpeed: 450,
    rtl: $("body").hasClass("has-rtl"),
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    
  });
  homeSlider
    .mouseenter(function () {
      homeSlider.trigger("stop.owl.autoplay");
    })
    .mouseleave(function () {
      homeSlider.trigger("play.owl.autoplay", [3000]);
    });
});
