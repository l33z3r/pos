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
}

function goToAccountsPage() {
    var accountName = $('#' + signInPopupID).find('#account_name').val();
    window.location = "http://" + accountName + "." + APP_DOMAIN + APP_PORT;
}