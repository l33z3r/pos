var signInPopupAnchor = null;
var signInPopupID = null;

function signInPopup() {
    signInPopupAnchor = $('#signin_link');
    
    if(signInPopupAnchor.HasBubblePopup()) {
        signInPopupAnchor.RemoveBubblePopup();
    }
    
    signInPopupAnchor.CreateBubblePopup();
    
    var signInPopupHTML = $("#signin_popup_markup").html();
    
    signInPopupAnchor.ShowBubblePopup({
        position: 'bottom',
        align: 'right',
        tail	 : {
            align: 'right'
        },
        innerHtml: signInPopupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false

    }, false);
    
    signInPopupAnchor.FreezeBubblePopup();
    
    signInPopupID = signInPopupAnchor.GetBubblePopupID();
    
    $(window).bind('keypress', function(event) {
        if(event.keyCode == 13) {
            goToAccountsPage();
        }
    });
}

function goToAccountsPage() {
    var accountName = $('#' + signInPopupID).find('#account_name').val();
    
    if(accountName.length == 0) {
        niceAlert("Please Enter An Account Name");
        return;
    }
    
    window.location = "http://" + accountName + "." + APP_DOMAIN + APP_PORT + "/account_log_in";
}