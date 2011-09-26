/*
 * JavaScript browser detector v1.0
 * http://www.corephp.com/
 *
 * @copyright	Copyright (C) 2010 'corePHP' LLC, www.corephp.com. All rights reserved.
 * @license GNU/GPL
 * http://www.corephp.com/License-gnu.txt
 */

try{
	var SEP   = '|';
	ua    = window.navigator.userAgent.toLowerCase();
	opera = ua.indexOf( "opera" ) >= 0;
	ie    = ua.indexOf( "msie" ) >= 0 && !opera;
	iemac = ie && ua.indexOf( "mac" ) >= 0;
	moz   = ua.indexOf( "mozilla" ) && !ie && !opera;
	os    = window.navigator.platform;
}catch(e){
	// Probably IE 6
}

function activeXDetect( componentClassID )
{
	componentVersion = document.body.getComponentVersion('{' + componentClassID + '}', 'ComponentID');

	return (componentVersion != null) ? componentVersion : false;
}

function extractVersions( s )
{
	extractedVersions = "";
	for ( var i = 0; i < s.length; i++ ) {
		charAtValue = s.charAt( i );
		if ( (charAtValue >= '0' && charAtValue <= '9')
			|| charAtValue == '.'
			|| charAtValue == '_'
			|| charAtValue == ','
		) {
			extractedVersions += charAtValue;
		}
	}

	return extractedVersions;
}

function stripIllegalChars( value )
{
	t = "";
	value = value.toLowerCase();
	for (i = 0; i < value.length; i++) {
		if (value.charAt( i ) != '\n' && value.charAt( i ) != '/' && value.charAt( i ) != "\\" ) {
			t += value.charAt( i );
		} else if ( value.charAt( i ) == '\n' ) {
			t += "n";
		}
	}

	return t;
}

function stripFullPath( tempFileName, lastDir )
{
	fileName = tempFileName;
	filenameStart = 0;
	filenameStart = fileName.lastIndexOf( lastDir );
	if (filenameStart < 0) filenameStart = 0;
	filenameFinish = fileName.length;
	fileName = fileName.substring( filenameStart + lastDir.length, filenameFinish );

	return fileName;
}

function fingerprint_browser()
{
	t = ua;
	return t;
}

function fingerprint_os()
{
	t = window.navigator.platform;
	return t;
}

function fingerprint_display()
{
	t = "";
	if ( self.screen ) {
		t += screen.colorDepth + SEP + screen.width + SEP + screen.height + SEP + screen.availHeight;
	}

	return t;
}

function fingerprint_software()
{
	t = "";
	isFirst = true;

	if ( window.navigator.plugins.length > 0 ) {
		if ( opera ) {
			temp = "";
			lastDir = "Plugins";;
			for ( i = 0; i < window.navigator.plugins.length; i++ ) {
				plugin = window.navigator.plugins[i];
				if ( isFirst == true ) {
					temp += stripFullPath( plugin.filename, lastDir );
					isFirst = false;
				} else {
					temp += SEP + stripFullPath( plugin.filename, lastDir );
				}
			}
			t = stripIllegalChars(temp);
		} else {
			for ( i = 0; i < window.navigator.plugins.length; i++ ) {
				plugin = window.navigator.plugins[i];
				if ( isFirst == true ) {
					t += plugin.filename;
					isFirst = false;
				} else {
					t += SEP + plugin.filename;
				}
			}
		}
	} else if ( window.navigator.mimeTypes.length > 0 ) {
		for ( i = 0; i < window.navigator.mimeTypes.length; i++ ) {
			mimeType = window.navigator.mimeTypes[i];
			if ( isFirst == true ) {
				t += mimeType.type;
				isFirst = false;
			} else {
				t += SEP + mimeType.type;
			}
		}
	} else if ( ie ) {
		components = new Array( "7790769C-0471-11D2-AF11-00C04FA35D02", "89820200-ECBD-11CF-8B85-00AA005B4340",
			"283807B5-2C60-11D0-A31D-00AA00B92C03", "4F216970-C90C-11D1-B5C7-0000F8051515",
			"44BBA848-CC51-11CF-AAFA-00AA00B6015C", "9381D8F2-0288-11D0-9501-00AA00B911A5",
			"4F216970-C90C-11D1-B5C7-0000F8051515", "5A8D6EE0-3E18-11D0-821E-444553540000",
			"89820200-ECBD-11CF-8B85-00AA005B4383", "08B0E5C0-4FCB-11CF-AAA5-00401C608555",
			"45EA75A0-A269-11D1-B5BF-0000F8051515", "DE5AED00-A4BF-11D1-9948-00C04F98BBC9",
			"22D6F312-B0F6-11D0-94AB-0080C74C7E95", "44BBA842-CC51-11CF-AAFA-00AA00B6015B",
			"3AF36230-A269-11D1-B5BF-0000F8051515", "44BBA840-CC51-11CF-AAFA-00AA00B6015C",
			"CC2A9BA0-3BDD-11D0-821E-444553540000", "08B0E5C0-4FCB-11CF-AAA5-00401C608500",
			"D27CDB6E-AE6D-11CF-96B8-444553540000", "2A202491-F00D-11CF-87CC-0020AFEECF20"
		);
		document.body.addBehavior( "#default#clientCaps" );
		for (i = 0; i < components.length; i++) {
			ver = activeXDetect( components[i] );
			if ( ver ) {
				if ( isFirst == true ) {
					t += ver;
					isFirst = false;
				} else {
					t += SEP + ver;
				}
			} else {
				t += SEP + "null";
			}
		}
	}

	return t;
}

function form_add_data( fd, name, value )
{
	if ( fd && fd.length > 0 ) {
		fd += "&";
	} else {
		fd = "";
	}

	fd += name + '=' + escape(value);

	return fd;
}

function form_add_fingerprint( fd, name, value ) {
	fd = form_add_data( fd, name + "d", value );

	return fd;
}

function pstfgrpnt( md5 )
{
	try{
		a = fingerprint_browser();
	}catch(e){
		a = '';
	}
	try{
		b = fingerprint_display();
	}catch(e){
		b = '';
	}
	try{
		c = fingerprint_software();
	}catch(e){
		c = '';
	}
	try{
		d = fingerprint_os();
	}catch(e){
		d = '';
	}

	if ( md5 ) {
		a = obs( a );
		b = obs( b );
		c = obs( c );
		d = obs( d );
	}

	return new Array( a, b, c, d );
}

function add_fingerprints()
{
	t = "fp_browser=" + fingerprint_browser() + "&fp_display=" + fingerprint_display()
		+ "&fp_software=" + fingerprint_software() + "&fb_os=" + fingerprint_os();

	return t;
}