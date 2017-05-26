	function assignTab(tabContainer, contentContainer, selectedCSSidName, timer) {
		var speed = 300;
		var timeout;
			contentContainer.children().css('display', 'none');
        var selected = tabContainer.children('.' + selectedCSSidName)
        if (selected.length == 0 )    {
            selected = tabContainer.children(':first').addClass(selectedCSSidName)
        }
        contentContainer.children('[tabname="'+selected.attr('tabname')+'"]').css('display', '').css('opacity', '1').addClass('active');
		jQuery.each(tabContainer.children(), function(){
			jQuery(this).click(function() {	
				jQuery(this).siblings('.' + selectedCSSidName).removeClass(selectedCSSidName);
				jQuery(this).addClass(selectedCSSidName);
				contentContainer.children('.active').animate({opacity: 0}, speed, 'linear',function() {
					contentContainer.children('.active').css('display', 'none');
					contentContainer.children('[tabname="'+tabContainer.children('.' + selectedCSSidName).attr('tabname')+'"]').css('display', '').animate({opacity: 1}, speed, 'linear',function() {
						jQuery(this).addClass('active');
					})
					jQuery(this).removeClass('active');
				});
				clearTimeout(timeout)
			})
		})
		if ((timer > 0) && (tabContainer.children().length > 1 )) {
			function slideNext() {
				nextTab = tabContainer.children('.' + selectedCSSidName).next()
				while (nextTab.length != 0 && nextTab.attr('tabname') == undefined) { nextTab = tabContainer.children('.' + selectedCSSidName).next().next(); }
				if (nextTab.length == 0) {
					nextTab = tabContainer.children()[0]
				}
				jQuery(nextTab).trigger('click')
				timeout = setTimeout(slideNext, timer)
			}
			timeout = setTimeout(slideNext, timer)
		}
		if (tabContainer.children().length == 1 ) {
			tabContainer.css('display', 'none');
		}
	}