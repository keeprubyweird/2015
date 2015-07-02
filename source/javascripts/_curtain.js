var StateManager = {
  state: "",
  touch: 'ontouchstart' in document.documentElement,

  handleResize: function() {
    var width = jQuery("body").width();

    if (width < 480 && this.state != "tiny") {
      this.state = "tiny";
      var e = jQuery.Event( "respond", { size: this.state } );
      jQuery(document).trigger(e);
    } else if (width > 479 && width < 601 && this.state != "small") {
      this.state = "small";
      var e = jQuery.Event( "respond", { size: this.state } );
      jQuery(document).trigger(e);
    } else if (width > 600 && width < 768 && this.state != "medium") {
      this.state = "medium";
      var e = jQuery.Event( "respond", { size: this.state } );
      jQuery(document).trigger(e);
    } else if (width > 767 && this.state != "large") {
      this.state = "large";
      var e = jQuery.Event( "respond", { size: this.state } );
      jQuery(document).trigger(e);
    }
  },

  init: function() {
    var self = this;
    self.handleResize();
    jQuery(window).bind("resize", function(){ self.handleResize(); });
    if(StateManager.touch) {
      console.log("got touch!");
      jQuery("body").addClass("touch");
    }
  }
};

jQuery(function() {
  StateManager.init();
  jQuery(window).load(function() {
    StateManager.state = '';
    jQuery(window).trigger('resize');
  });
});

(function($) {

  function Curtain($curtain) {
    var self = this,
        $el = $curtain,
        $body = $("body"),
        $wrapper = $(".curtain-wrapper");

    // Tracking curtain movement and status
    self.height = 0;
    self.buffer = 0;

    self.init = function() {
      window.scrollTo(0, 1);

      $(document).bind("respond", function(e) {
        if(e.size == "tiny" || e.size == "small" || e.size == "medium") {
          self.reset();
        }
        else if(e.size == "large") {
          if ($body.is('.force-curtain-fallback')) {
            self.reset();
          }
          else {
            self.setup();
          }
        }
      });

      $('.curtain-arrow').on('click', self.unfurl);
    }

    self.setup = function() {
      $body.css({"min-height": $body.height()});
      
      self.setCurtainFocus(true);
      self.bind();
    }

    self.reset = function() {
      $body.removeAttr("style");
      $wrapper.removeClass("on").removeAttr("style");

      self.unbind();
    }

    self.bind = function() {
      $(window).on("scroll", self.handleScroll);
    }

    self.unbind = function() {
      $(window).off("scroll");
    }

    self.handleScroll = function(e) {
      var scrollFactor = document.documentElement.scrollTop || $(document).scrollTop();

      // If we're scrolled down past the curtain, let the page scroll
      if(scrollFactor > self.getTotalHeight()) {
        self.setCurtainFocus(true);
      }
      // And if we're not, make sure the curtain is all that scrolls
      else {
        self.setCurtainFocus(false);
      }
    }

    self.setCurtainFocus = function(state) {
      self.updateHeight();

      if(state) {
        $wrapper.attr("style", "margin-top: " + self.getTotalHeight() + "px");
        $wrapper.removeClass("on");
      }
      else {
        $wrapper.attr("style", "margin-bottom: " + self.getTotalHeight() + "px");
        $wrapper.addClass("on");
      }
    }

    // Update the height of the curtain, in case it's changed
    self.updateHeight = function() {
      self.height = $curtain.height();
      return self.height;
    }

    // Curtain height plus an arbitrary buffer
    self.getTotalHeight = function() {
      return self.height + self.buffer;
    }

    self.unfurl = function() {
      var scrollFactor = self.height + self.buffer;

      // Unbind for a second
      self.unbind();

      $('html, body').animate({
        scrollTop: scrollFactor
      }, {
        duration: 400,
        complete: function() {
          self.bind();
        }
      });
    }

    self.init();
  }

  $(function() {
    var $curtain = $(".curtain");

    if($curtain.length) {
      Curtain($curtain);
    }
  });

})(jQuery);
