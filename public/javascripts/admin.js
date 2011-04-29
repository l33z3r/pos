function initAdminScreen() {
    //start the clock in the nav bar
    $("div#clock").clock({
        "calendar":"false"
    });
}

$(initAdminScreen());

function addModifierFields(link, content) {
  var new_id = new Date().getTime();
  var regexp = new RegExp("new_modifier", "g")
  $(link).parent().before(content.replace(regexp, new_id));
}

function deleteModifier(link) {
    $(link).prev("input[type=hidden]").val(1);
    $(link).parent().parent(".modifier_fields").hide();
}

function doSetDefaultDisplay(displayId) {
    //send an update to display controller
    $.ajax({
        type: 'POST',
        url: '/admin/displays/' + displayId + '/default'
    });
}