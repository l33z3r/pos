function niceAlert(msg) {
    alert(msg + " niceAlert NYI!!!!!");
}

function showLoadingDiv(msg) {
    alert(msg + " showLoadingDiv NYI!!!!");
}

function unlinkTerminal(outletId, terminalName) {
    var postURL = "/accounts/outlets/" + outletId + "/unlink_terminal";
    
    var params = {
          terminal_name : terminalName  
        };
    
    postTo(postURL, params);
}

function postTo(path, params) {
    var form = document.createElement("form");
    
    form.setAttribute("method", "post");
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}