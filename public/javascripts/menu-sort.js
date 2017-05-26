/* menu-sort.js */

jQuery(function($) {
    $('div.grp-group').sortable({
        /*containment: 'parent',
         zindex: 10, */
        items: 'div.grp-collapse',
        handle: 'h3:first',
        update: function() {
            $(this).find('div.grp-collapse').each(function(i) {
                if ($(this).find('input[id$=name]').val()) {
                    $(this).find('input[id$=order]').val(i+1);
                }
            });
        }
    });
    $('div.grp-collapse h3').css('cursor', 'move');
    $('div.grp-collapse').find('input[id$=order]').parent('div').hide();
});