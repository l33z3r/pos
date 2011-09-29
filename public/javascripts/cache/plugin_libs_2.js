/*
	jQuery Bubble Popup v.2.3.1
	http://maxvergelli.wordpress.com/jquery-bubble-popup/
	
	Copyright (c) 2010 Max Vergelli
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

(function (a) {
    a.fn.IsBubblePopupOpen = function () {
        var c = null;
        a(this).each(function (d, e) {
            var b = a(e).data("private_jquerybubblepopup_options");
            if (b != null && typeof b == "object" && !a.isArray(b) && !a.isEmptyObject(b) && b.privateVars != null && typeof b.privateVars == "object" && !a.isArray(b.privateVars) && !a.isEmptyObject(b.privateVars) && typeof b.privateVars.is_open != "undefined") {
                c = b.privateVars.is_open ? true : false
            }
            return false
        });
        return c
    };
    a.fn.GetBubblePopupLastDisplayDateTime = function () {
        var b = null;
        a(this).each(function (e, f) {
            var d = a(f).data("private_jquerybubblepopup_options");
            if (d != null && typeof d == "object" && !a.isArray(d) && !a.isEmptyObject(d) && d.privateVars != null && typeof d.privateVars == "object" && !a.isArray(d.privateVars) && !a.isEmptyObject(d.privateVars) && typeof d.privateVars.last_display_datetime != "undefined" && d.privateVars.last_display_datetime != null) {
                b = c(d.privateVars.last_display_datetime)
            }
            return false
        });

        function c(d) {
            return new Date(d * 1000)
        }
        return b
    };
    a.fn.GetBubblePopupLastModifiedDateTime = function () {
        var b = null;
        a(this).each(function (e, f) {
            var d = a(f).data("private_jquerybubblepopup_options");
            if (d != null && typeof d == "object" && !a.isArray(d) && !a.isEmptyObject(d) && d.privateVars != null && typeof d.privateVars == "object" && !a.isArray(d.privateVars) && !a.isEmptyObject(d.privateVars) && typeof d.privateVars.last_modified_datetime != "undefined" && d.privateVars.last_modified_datetime != null) {
                b = c(d.privateVars.last_modified_datetime)
            }
            return false
        });

        function c(d) {
            return new Date(d * 1000)
        }
        return b
    };
    a.fn.GetBubblePopupCreationDateTime = function () {
        var b = null;
        a(this).each(function (e, f) {
            var d = a(f).data("private_jquerybubblepopup_options");
            if (d != null && typeof d == "object" && !a.isArray(d) && !a.isEmptyObject(d) && d.privateVars != null && typeof d.privateVars == "object" && !a.isArray(d.privateVars) && !a.isEmptyObject(d.privateVars) && typeof d.privateVars.creation_datetime != "undefined" && d.privateVars.creation_datetime != null) {
                b = c(d.privateVars.creation_datetime)
            }
            return false
        });

        function c(d) {
            return new Date(d * 1000)
        }
        return b
    };
    a.fn.GetBubblePopupMarkup = function () {
        var b = null;
        a(this).each(function (d, e) {
            var c = a(e).data("private_jquerybubblepopup_options");
            if (c != null && typeof c == "object" && !a.isArray(c) && !a.isEmptyObject(c) && c.privateVars != null && typeof c.privateVars == "object" && !a.isArray(c.privateVars) && !a.isEmptyObject(c.privateVars) && typeof c.privateVars.id != "undefined") {
                b = a("#" + c.privateVars.id).length > 0 ? a("#" + c.privateVars.id).html() : null
            }
            return false
        });
        return b
    };
    a.fn.GetBubblePopupID = function () {
        var b = null;
        a(this).each(function (d, e) {
            var c = a(e).data("private_jquerybubblepopup_options");
            if (c != null && typeof c == "object" && !a.isArray(c) && !a.isEmptyObject(c) && c.privateVars != null && typeof c.privateVars == "object" && !a.isArray(c.privateVars) && !a.isEmptyObject(c.privateVars) && typeof c.privateVars.id != "undefined") {
                b = c.privateVars.id
            }
            return false
        });
        return b
    };
    a.fn.RemoveBubblePopup = function () {
        var b = 0;
        a(this).each(function (d, e) {
            var c = a(e).data("private_jquerybubblepopup_options");
            if (c != null && typeof c == "object" && !a.isArray(c) && !a.isEmptyObject(c) && c.privateVars != null && typeof c.privateVars == "object" && !a.isArray(c.privateVars) && !a.isEmptyObject(c.privateVars) && typeof c.privateVars.id != "undefined") {
                a(e).unbind("managebubblepopup");
                a(e).unbind("setbubblepopupinnerhtml");
                a(e).unbind("setbubblepopupoptions");
                a(e).unbind("positionbubblepopup");
                a(e).unbind("freezebubblepopup");
                a(e).unbind("unfreezebubblepopup");
                a(e).unbind("showbubblepopup");
                a(e).unbind("hidebubblepopup");
                a(e).data("private_jquerybubblepopup_options", {});
                if (a("#" + c.privateVars.id).length > 0) {
                    a("#" + c.privateVars.id).remove()
                }
                b++
            }
        });
        return b
    };
    a.fn.HasBubblePopup = function () {
        var c = false;
        a(this).each(function (d, e) {
            var b = a(e).data("private_jquerybubblepopup_options");
            if (b != null && typeof b == "object" && !a.isArray(b) && !a.isEmptyObject(b) && b.privateVars != null && typeof b.privateVars == "object" && !a.isArray(b.privateVars) && !a.isEmptyObject(b.privateVars) && typeof b.privateVars.id != "undefined") {
                c = true
            }
            return false
        });
        return c
    };
    a.fn.GetBubblePopupOptions = function () {
        var b = {};
        a(this).each(function (c, d) {
            b = a(d).data("private_jquerybubblepopup_options");
            if (b != null && typeof b == "object" && !a.isArray(b) && !a.isEmptyObject(b) && b.privateVars != null && typeof b.privateVars == "object" && !a.isArray(b.privateVars) && !a.isEmptyObject(b.privateVars)) {
                delete b.privateVars
            } else {
                b = null
            }
            return false
        });
        if (a.isEmptyObject(b)) {
            b = null
        }
        return b
    };
    a.fn.SetBubblePopupInnerHtml = function (b, c) {
        a(this).each(function (d, e) {
            if (typeof c != "boolean") {
                c = true
            }
            a(e).trigger("setbubblepopupinnerhtml", [b, c])
        })
    };
    a.fn.SetBubblePopupOptions = function (b) {
        a(this).each(function (c, d) {
            a(d).trigger("setbubblepopupoptions", [b])
        })
    };
    a.fn.ShowBubblePopup = function (b, c) {
        a(this).each(function (d, e) {
            a(e).trigger("showbubblepopup", [b, c, true]);
            return false
        })
    };
    a.fn.ShowAllBubblePopups = function (b, c) {
        a(this).each(function (d, e) {
            a(e).trigger("showbubblepopup", [b, c, true])
        })
    };
    a.fn.HideBubblePopup = function () {
        a(this).each(function (b, c) {
            a(c).trigger("hidebubblepopup", [true]);
            return false
        })
    };
    a.fn.HideAllBubblePopups = function () {
        a(this).each(function (b, c) {
            a(c).trigger("hidebubblepopup", [true])
        })
    };
    a.fn.FreezeBubblePopup = function () {
        a(this).each(function (b, c) {
            a(c).trigger("freezebubblepopup");
            return false
        })
    };
    a.fn.FreezeAllBubblePopups = function () {
        a(this).each(function (b, c) {
            a(c).trigger("freezebubblepopup")
        })
    };
    a.fn.UnfreezeBubblePopup = function () {
        a(this).each(function (b, c) {
            a(c).trigger("unfreezebubblepopup");
            return false
        })
    };
    a.fn.UnfreezeAllBubblePopups = function () {
        a(this).each(function (b, c) {
            a(c).trigger("unfreezebubblepopup")
        })
    };
    a.fn.CreateBubblePopup = function (e) {
        var r = {
            me: this,
            cache: [],
            options_key: "private_jquerybubblepopup_options",
            model_tr: ["top", "middle", "bottom"],
            model_td: ["left", "middle", "right"],
            model_markup: '<div class="{BASE_CLASS} {TEMPLATE_CLASS}"{DIV_STYLE} id="{DIV_ID}"> 									<table{TABLE_STYLE}> 									<tbody> 									<tr> 										<td class="{BASE_CLASS}-top-left"{TOP-LEFT_STYLE}>{TOP-LEFT}</td> 										<td class="{BASE_CLASS}-top-middle"{TOP-MIDDLE_STYLE}>{TOP-MIDDLE}</td> 										<td class="{BASE_CLASS}-top-right"{TOP-RIGHT_STYLE}>{TOP-RIGHT}</td> 									</tr> 									<tr> 										<td class="{BASE_CLASS}-middle-left"{MIDDLE-LEFT_STYLE}>{MIDDLE-LEFT}</td> 										<td class="{BASE_CLASS}-innerHtml"{INNERHTML_STYLE}>{INNERHTML}</td> 										<td class="{BASE_CLASS}-middle-right"{MIDDLE-RIGHT_STYLE}>{MIDDLE-RIGHT}</td> 									</tr> 									<tr> 										<td class="{BASE_CLASS}-bottom-left"{BOTTOM-LEFT_STYLE}>{BOTTOM-LEFT}</td> 										<td class="{BASE_CLASS}-bottom-middle"{BOTTOM-MIDDLE_STYLE}>{BOTTOM-MIDDLE}</td> 										<td class="{BASE_CLASS}-bottom-right"{BOTTOM-RIGHT_STYLE}>{BOTTOM-RIGHT}</td> 									</tr> 									</tbody> 									</table> 									</div>',
            privateVars: {
                id: null,
                creation_datetime: null,
                last_modified_datetime: null,
                last_display_datetime: null,
                is_open: false,
                is_freezed: false,
                is_animating: false,
                is_animation_complete: false,
                is_mouse_over: false,
                is_position_changed: false,
                last_options: {}
            },
            position: "top",
            positionValues: ["left", "top", "right", "bottom"],
            align: "center",
            alignValues: ["left", "center", "right", "top", "middle", "bottom"],
            alignHorizontalValues: ["left", "center", "right"],
            alignVerticalValues: ["top", "middle", "bottom"],
            distance: "20px",
            width: null,
            height: null,
            divStyle: {},
            tableStyle: {},
            innerHtml: null,
            innerHtmlStyle: {},
            tail: {
                align: "center",
                hidden: false
            },
            dropShadow: true,
            alwaysVisible: true,
            selectable: false,
            manageMouseEvents: true,
            mouseOver: "show",
            mouseOverValues: ["show", "hide"],
            mouseOut: "hide",
            mouseOutValues: ["show", "hide"],
            openingSpeed: 1,
            closingSpeed: 1,
            openingDelay: 0,
            closingDelay: 0,
            baseClass: "jquerybubblepopup",
            themeName: "azure",
            themePath: "jquerybubblepopup-theme/",
            themeMargins: {
                total: "13px",
                difference: "10px"
            },
            afterShown: function () {},
            afterHidden: function () {},
            hideElementId: []
        };
        h(e);

        function g(v) {
            var w = {
                privateVars: {},
                width: r.width,
                height: r.height,
                divStyle: r.divStyle,
                tableStyle: r.tableStyle,
                position: r.position,
                align: r.align,
                distance: r.distance,
                openingSpeed: r.openingSpeed,
                closingSpeed: r.closingSpeed,
                openingDelay: r.openingDelay,
                closingDelay: r.closingDelay,
                mouseOver: r.mouseOver,
                mouseOut: r.mouseOut,
                tail: r.tail,
                innerHtml: r.innerHtml,
                innerHtmlStyle: r.innerHtmlStyle,
                baseClass: r.baseClass,
                themeName: r.themeName,
                themePath: r.themePath,
                themeMargins: r.themeMargins,
                dropShadow: r.dropShadow,
                manageMouseEvents: r.manageMouseEvents,
                alwaysVisible: r.alwaysVisible,
                selectable: r.selectable,
                afterShown: r.afterShown,
                afterHidden: r.afterHidden,
                hideElementId: r.hideElementId
            };
            var t = a.extend(false, w, (typeof v == "object" && !a.isArray(v) && !a.isEmptyObject(v) && v != null ? v : {}));
            t.privateVars.id = r.privateVars.id;
            t.privateVars.creation_datetime = r.privateVars.creation_datetime;
            t.privateVars.last_modified_datetime = r.privateVars.last_modified_datetime;
            t.privateVars.last_display_datetime = r.privateVars.last_display_datetime;
            t.privateVars.is_open = r.privateVars.is_open;
            t.privateVars.is_freezed = r.privateVars.is_freezed;
            t.privateVars.is_animating = r.privateVars.is_animating;
            t.privateVars.is_animation_complete = r.privateVars.is_animation_complete;
            t.privateVars.is_mouse_over = r.privateVars.is_mouse_over;
            t.privateVars.is_position_changed = r.privateVars.is_position_changed;
            t.privateVars.last_options = r.privateVars.last_options;
            t.width = (typeof t.width == "string" || typeof t.width == "number") && parseInt(t.width) > 0 ? parseInt(t.width) : r.width;
            t.height = (typeof t.height == "string" || typeof t.height == "number") && parseInt(t.height) > 0 ? parseInt(t.height) : r.height;
            t.divStyle = t.divStyle != null && typeof t.divStyle == "object" && !a.isArray(t.divStyle) && !a.isEmptyObject(t.divStyle) ? t.divStyle : r.divStyle;
            t.tableStyle = t.tableStyle != null && typeof t.tableStyle == "object" && !a.isArray(t.tableStyle) && !a.isEmptyObject(t.tableStyle) ? t.tableStyle : r.tableStyle;
            t.position = typeof t.position == "string" && o(t.position.toLowerCase(), r.positionValues) ? t.position.toLowerCase() : r.position;
            t.align = typeof t.align == "string" && o(t.align.toLowerCase(), r.alignValues) ? t.align.toLowerCase() : r.align;
            t.distance = (typeof t.distance == "string" || typeof t.distance == "number") && parseInt(t.distance) >= 0 ? parseInt(t.distance) : r.distance;
            t.openingSpeed = typeof t.openingSpeed == "number" && parseInt(t.openingSpeed) > 0 ? parseInt(t.openingSpeed) : r.openingSpeed;
            t.closingSpeed = typeof t.closingSpeed == "number" && parseInt(t.closingSpeed) > 0 ? parseInt(t.closingSpeed) : r.closingSpeed;
            t.openingDelay = typeof t.openingDelay == "number" && t.openingDelay >= 0 ? t.openingDelay : r.openingDelay;
            t.closingDelay = typeof t.closingDelay == "number" && t.closingDelay >= 0 ? t.closingDelay : r.closingDelay;
            t.mouseOver = typeof t.mouseOver == "string" && o(t.mouseOver.toLowerCase(), r.mouseOverValues) ? t.mouseOver.toLowerCase() : r.mouseOver;
            t.mouseOut = typeof t.mouseOut == "string" && o(t.mouseOut.toLowerCase(), r.mouseOutValues) ? t.mouseOut.toLowerCase() : r.mouseOut;
            t.tail = t.tail != null && typeof t.tail == "object" && !a.isArray(t.tail) && !a.isEmptyObject(t.tail) ? t.tail : r.tail;
            t.tail.align = typeof t.tail.align != "undefined" ? t.tail.align : r.tail.align;
            t.tail.hidden = typeof t.tail.hidden != "undefined" ? t.tail.hidden : r.tail.hidden;
            t.innerHtml = typeof t.innerHtml == "string" && t.innerHtml.length > 0 ? t.innerHtml : r.innerHtml;
            t.innerHtmlStyle = t.innerHtmlStyle != null && typeof t.innerHtmlStyle == "object" && !a.isArray(t.innerHtmlStyle) && !a.isEmptyObject(t.innerHtmlStyle) ? t.innerHtmlStyle : r.innerHtmlStyle;
            t.baseClass = j(typeof t.baseClass == "string" && t.baseClass.length > 0 ? t.baseClass : r.baseClass);
            t.themeName = typeof t.themeName == "string" && t.themeName.length > 0 ? a.trim(t.themeName) : r.themeName;
            t.themePath = typeof t.themePath == "string" && t.themePath.length > 0 ? a.trim(t.themePath) : r.themePath;
            t.themeMargins = t.themeMargins != null && typeof t.themeMargins == "object" && !a.isArray(t.themeMargins) && !a.isEmptyObject(t.themeMargins) && (typeof parseInt(t.themeMargins.total) == "number" && typeof parseInt(t.themeMargins.difference) == "number") ? t.themeMargins : r.themeMargins;
            t.dropShadow = typeof t.dropShadow == "boolean" && t.dropShadow == true ? true : false;
            t.manageMouseEvents = typeof t.manageMouseEvents == "boolean" && t.manageMouseEvents == true ? true : false;
            t.alwaysVisible = typeof t.alwaysVisible == "boolean" && t.alwaysVisible == true ? true : false;
            t.selectable = typeof t.selectable == "boolean" && t.selectable == true ? true : false;
            t.afterShown = typeof t.afterShown == "function" ? t.afterShown : r.afterShown;
            t.afterHidden = typeof t.afterHidden == "function" ? t.afterHidden : r.afterHidden;
            t.hideElementId = a.isArray(t.hideElementId) ? t.hideElementId : r.hideElementId;
            if (t.position == "left" || t.position == "right") {
                t.align = o(t.align, r.alignVerticalValues) ? t.align : "middle"
            } else {
                t.align = o(t.align, r.alignHorizontalValues) ? t.align : "center"
            }
            for (var u in t.tail) {
                switch (u) {
                case "align":
                    t.tail.align = typeof t.tail.align == "string" && o(t.tail.align.toLowerCase(), r.alignValues) ? t.tail.align.toLowerCase() : r.tail.align;
                    if (t.position == "left" || t.position == "right") {
                        t.tail.align = o(t.tail.align, r.alignVerticalValues) ? t.tail.align : "middle"
                    } else {
                        t.tail.align = o(t.tail.align, r.alignHorizontalValues) ? t.tail.align : "center"
                    }
                    break;
                case "hidden":
                    t.tail.hidden = t.tail.hidden == true ? true : false;
                    break
                }
            }
            return t
        }
        function l(t) {
            if (t == 0) {
                return 0
            }
            if (t > 0) {
                return -(Math.abs(t))
            } else {
                return Math.abs(t)
            }
        }
        function o(v, w) {
            var t = false;
            for (var u in w) {
                if (w[u] == v) {
                    t = true;
                    break
                }
            }
            return t
        }
        function k(t) {
            if (document.createElement) {
                for (var v = t.length - 1; v >= 0; v--) {
                    var u = document.createElement("img");
                    u.src = t[v];
                    if (a.inArray(t[v], r.cache) > -1) {
                        r.cache.push(t[v])
                    }
                }
            }
        }
        function b(t) {
            if (t.hideElementId && t.hideElementId.length > 0) {
                for (var u = 0; u < t.hideElementId.length; u++) {
                    var v = (t.hideElementId[u].charAt(0) != "#" ? "#" + t.hideElementId[u] : t.hideElementId[u]);
                    a(v).css({
                        visibility: "hidden"
                    })
                }
            }
        }
        function s(u) {
            if (u.hideElementId && u.hideElementId.length > 0) {
                for (var v = 0; v < u.hideElementId.length; v++) {
                    var x = (u.hideElementId[v].charAt(0) != "#" ? "#" + u.hideElementId[v] : u.hideElementId[v]);
                    a(x).css({
                        visibility: "visible"
                    });
                    var w = a(x).length;
                    for (var t = 0; t < w.length; t++) {
                        a(w[t]).css({
                            visibility: "visible"
                        })
                    }
                }
            }
        }
        function m(u) {
            var w = u.themePath;
            var t = u.themeName;
            var v = (w.substring(w.length - 1) == "/" || w.substring(w.length - 1) == "\\") ? w.substring(0, w.length - 1) + "/" + t + "/" : w + "/" + t + "/";
            //alert(v + (u.dropShadow == true ? (a.browser.msie ? "ie/" : "") : "ie/"));
            return v + (u.dropShadow == true ? (a.browser.msie ? "ie/" : "") : "ie/")
        }
        function j(t) {
            var u = t.substring(0, 1) == "." ? t.substring(1, t.length) : t;
            return u
        }
        function q(u) {
            if (a("#" + u.privateVars.id).length > 0) {
                var t = "bottom-middle";
                switch (u.position) {
                case "left":
                    t = "middle-right";
                    break;
                case "top":
                    t = "bottom-middle";
                    break;
                case "right":
                    t = "middle-left";
                    break;
                case "bottom":
                    t = "top-middle";
                    break
                }
                if (o(u.tail.align, r.alignHorizontalValues)) {
                    a("#" + u.privateVars.id).find("td." + u.baseClass + "-" + t).css("text-align", u.tail.align)
                } else {
                    a("#" + u.privateVars.id).find("td." + u.baseClass + "-" + t).css("vertical-align", u.tail.align)
                }
            }
        }
        function p(v) {
            var H = r.model_markup;
            var F = m(v);
            var x = "";
            var G = "";
            var u = "";
            if (!v.tail.hidden) {
                switch (v.position) {
                case "left":
                    G = "right";
                    u = "{MIDDLE-RIGHT}";
                    break;
                case "top":
                    G = "bottom";
                    u = "{BOTTOM-MIDDLE}";
                    break;
                case "right":
                    G = "left";
                    u = "{MIDDLE-LEFT}";
                    break;
                case "bottom":
                    G = "top";
                    u = "{TOP-MIDDLE}";
                    break
                }
                x = '<img src="' + F + "tail-" + G + "." + (v.dropShadow == true ? (a.browser.msie ? "gif" : "png") : "gif") + '" alt="" class="' + v.baseClass + '-tail" />'
            }
            var t = r.model_tr;
            var z = r.model_td;
            var K, E, A, J;
            var B = "";
            var y = "";
            var D = new Array();
            for (E in t) {
                A = "";
                J = "";
                for (K in z) {
                    A = t[E] + "-" + z[K];
                    A = A.toUpperCase();
                    J = "{" + A + "_STYLE}";
                    A = "{" + A + "}";
                    if (A == u) {
                        H = H.replace(A, x);
                        B = ""
                    } else {
                        H = H.replace(A, "");
                        B = ""
                    }
                    if (t[E] + "-" + z[K] != "middle-middle") {
                        y = F + t[E] + "-" + z[K] + "." + (v.dropShadow == true ? (a.browser.msie ? "gif" : "png") : "gif");
                        D.push(y);
                        H = H.replace(J, ' style="' + B + "background-image:url(" + y + ');"')
                    }
                }
            }
            if (D.length > 0) {
                k(D)
            }
            var w = "";
            if (v.tableStyle != null && typeof v.tableStyle == "object" && !a.isArray(v.tableStyle) && !a.isEmptyObject(v.tableStyle)) {
                for (var C in v.tableStyle) {
                    w += C + ":" + v.tableStyle[C] + ";"
                }
            }
            w += (v.width != null || v.height != null) ? (v.width != null ? "width:" + v.width + "px;" : "") + (v.height != null ? "height:" + v.height + "px;" : "") : "";
            H = w.length > 0 ? H.replace("{TABLE_STYLE}", ' style="' + w + '"') : H.replace("{TABLE_STYLE}", "");
            var I = "";
            if (v.divStyle != null && typeof v.divStyle == "object" && !a.isArray(v.divStyle) && !a.isEmptyObject(v.divStyle)) {
                for (var C in v.divStyle) {
                    I += C + ":" + v.divStyle[C] + ";"
                }
            }
            H = I.length > 0 ? H.replace("{DIV_STYLE}", ' style="' + I + '"') : H.replace("{DIV_STYLE}", "");
            H = H.replace("{TEMPLATE_CLASS}", v.baseClass + "-" + v.themeName);
            H = v.privateVars.id != null ? H.replace("{DIV_ID}", v.privateVars.id) : H.replace("{DIV_ID}", "");
            while (H.indexOf("{BASE_CLASS}") > -1) {
                H = H.replace("{BASE_CLASS}", v.baseClass)
            }
            H = v.innerHtml != null ? H.replace("{INNERHTML}", v.innerHtml) : H.replace("{INNERHTML}", "");
            J = "";
            for (var C in v.innerHtmlStyle) {
                J += C + ":" + v.innerHtmlStyle[C] + ";"
            }
            H = J.length > 0 ? H.replace("{INNERHTML_STYLE}", ' style="' + J + '"') : H.replace("{INNERHTML_STYLE}", "");
            return H
        }
        function f() {
            return Math.round(new Date().getTime() / 1000)
        }
        function c(E, N, x) {
            var O = x.position;
            var K = x.align;
            var z = x.distance;
            var F = x.themeMargins;
            var I = new Array();
            var u = N.offset();
            var t = parseInt(u.top);
            var y = parseInt(u.left);
            var P = parseInt(N.outerWidth(false));
            var L = parseInt(N.outerHeight(false));
            var v = parseInt(E.outerWidth(false));
            var M = parseInt(E.outerHeight(false));
            F.difference = Math.abs(parseInt(F.difference));
            F.total = Math.abs(parseInt(F.total));
            var w = l(F.difference);
            var J = l(F.difference);
            var A = l(F.total);
            var H = m(x);
            switch (K) {
            case "left":
                I.top = O == "top" ? t - M - z + l(w) : t + L + z + w;
                I.left = y + A;
                break;
            case "center":
                var D = Math.abs(v - P) / 2;
                I.top = O == "top" ? t - M - z + l(w) : t + L + z + w;
                I.left = v >= P ? y - D : y + D;
                break;
            case "right":
                var D = Math.abs(v - P);
                I.top = O == "top" ? t - M - z + l(w) : t + L + z + w;
                I.left = v >= P ? y - D + l(A) : y + D + l(A);
                break;
            case "top":
                I.top = t + A;
                I.left = O == "left" ? y - v - z + l(J) : y + P + z + J;
                break;
            case "middle":
                var D = Math.abs(M - L) / 2;
                I.top = M >= L ? t - D : t + D;
                I.left = O == "left" ? y - v - z + l(J) : y + P + z + J;
                break;
            case "bottom":
                var D = Math.abs(M - L);
                I.top = M >= L ? t - D + l(A) : t + D + l(A);
                I.left = O == "left" ? y - v - z + l(J) : y + P + z + J;
                break
            }
            I.position = O;
            if (a("#" + x.privateVars.id).length > 0 && a("#" + x.privateVars.id).find("img." + x.baseClass + "-tail").length > 0) {
                a("#" + x.privateVars.id).find("img." + x.baseClass + "-tail").remove();
                var G = "bottom";
                var C = "bottom-middle";
                switch (O) {
                case "left":
                    G = "right";
                    C = "middle-right";
                    break;
                case "top":
                    G = "bottom";
                    C = "bottom-middle";
                    break;
                case "right":
                    G = "left";
                    C = "middle-left";
                    break;
                case "bottom":
                    G = "top";
                    C = "top-middle";
                    break
                }
                a("#" + x.privateVars.id).find("td." + x.baseClass + "-" + C).empty();
                a("#" + x.privateVars.id).find("td." + x.baseClass + "-" + C).html('<img src="' + H + "tail-" + G + "." + (x.dropShadow == true ? (a.browser.msie ? "gif" : "png") : "gif") + '" alt="" class="' + x.baseClass + '-tail" />');
                q(x)
            }
            if (x.alwaysVisible == true) {
                if (I.top < a(window).scrollTop() || I.top + M > a(window).scrollTop() + a(window).height()) {
                    if (a("#" + x.privateVars.id).length > 0 && a("#" + x.privateVars.id).find("img." + x.baseClass + "-tail").length > 0) {
                        a("#" + x.privateVars.id).find("img." + x.baseClass + "-tail").remove()
                    }
                    var B = "";
                    if (I.top < a(window).scrollTop()) {
                        I.position = "bottom";
                        I.top = t + L + z + w;
                        if (a("#" + x.privateVars.id).length > 0 && !x.tail.hidden) {
                            a("#" + x.privateVars.id).find("td." + x.baseClass + "-top-middle").empty();
                            a("#" + x.privateVars.id).find("td." + x.baseClass + "-top-middle").html('<img src="' + H + "tail-top." + (x.dropShadow == true ? (a.browser.msie ? "gif" : "png") : "gif") + '" alt="" class="' + x.baseClass + '-tail" />');
                            B = "top-middle"
                        }
                    } else {
                        if (I.top + M > a(window).scrollTop() + a(window).height()) {
                            I.position = "top";
                            I.top = t - M - z + l(w);
                            if (a("#" + x.privateVars.id).length > 0 && !x.tail.hidden) {
                                a("#" + x.privateVars.id).find("td." + x.baseClass + "-bottom-middle").empty();
                                a("#" + x.privateVars.id).find("td." + x.baseClass + "-bottom-middle").html('<img src="' + H + "tail-bottom." + (x.dropShadow == true ? (a.browser.msie ? "gif" : "png") : "gif") + '" alt="" class="' + x.baseClass + '-tail" />');
                                B = "bottom-middle"
                            }
                        }
                    }
                    if (I.left < 0) {
                        I.left = 0;
                        if (B.length > 0) {
                            a("#" + x.privateVars.id).find("td." + x.baseClass + "-" + B).css("text-align", "center")
                        }
                    } else {
                        if (I.left + v > a(window).width()) {
                            I.left = a(window).width() - v;
                            if (B.length > 0) {
                                a("#" + x.privateVars.id).find("td." + x.baseClass + "-" + B).css("text-align", "center")
                            }
                        }
                    }
                } else {
                    if (I.left < 0 || I.left + v > a(window).width()) {
                        if (a("#" + x.privateVars.id).length > 0 && a("#" + x.privateVars.id).find("img." + x.baseClass + "-tail").length > 0) {
                            a("#" + x.privateVars.id).find("img." + x.baseClass + "-tail").remove()
                        }
                        var B = "";
                        if (I.left < 0) {
                            I.position = "right";
                            I.left = y + P + z + J;
                            if (a("#" + x.privateVars.id).length > 0 && !x.tail.hidden) {
                                a("#" + x.privateVars.id).find("td." + x.baseClass + "-middle-left").empty();
                                a("#" + x.privateVars.id).find("td." + x.baseClass + "-middle-left").html('<img src="' + H + "tail-left." + (x.dropShadow == true ? (a.browser.msie ? "gif" : "png") : "gif") + '" alt="" class="' + x.baseClass + '-tail" />');
                                B = "middle-left"
                            }
                        } else {
                            if (I.left + v > a(window).width()) {
                                I.position = "left";
                                I.left = y - v - z + l(J);
                                if (a("#" + x.privateVars.id).length > 0 && !x.tail.hidden) {
                                    a("#" + x.privateVars.id).find("td." + x.baseClass + "-middle-right").empty();
                                    a("#" + x.privateVars.id).find("td." + x.baseClass + "-middle-right").html('<img src="' + H + "tail-right." + (x.dropShadow == true ? (a.browser.msie ? "gif" : "png") : "gif") + '" alt="" class="' + x.baseClass + '-tail" />');
                                    B = "middle-right"
                                }
                            }
                        }
                        if (I.top < a(window).scrollTop()) {
                            I.top = a(window).scrollTop();
                            if (B.length > 0) {
                                a("#" + x.privateVars.id).find("td." + x.baseClass + "-" + B).css("vertical-align", "middle")
                            }
                        } else {
                            if (I.top + M > a(window).scrollTop() + a(window).height()) {
                                I.top = (a(window).scrollTop() + a(window).height()) - M;
                                if (B.length > 0) {
                                    a("#" + x.privateVars.id).find("td." + x.baseClass + "-" + B).css("vertical-align", "middle")
                                }
                            }
                        }
                    }
                }
            }
            return I
        }
        function d(u, t) {
            a(u).data(r.options_key, t)
        }
        function n(t) {
            return a(t).data(r.options_key)
        }
        function i(t) {
            var u = t != null && typeof t == "object" && !a.isArray(t) && !a.isEmptyObject(t) ? true : false;
            return u
        }
        function h(t) {
            a(window).resize(function () {
                a(r.me).each(function (u, v) {
                    a(v).trigger("positionbubblepopup")
                })
            });
            a(document).mousemove(function (u) {
                a(r.me).each(function (v, w) {
                    a(w).trigger("managebubblepopup", [u.pageX, u.pageY])
                })
            });
            a(r.me).each(function (v, w) {
                var u = g(t);
                u.privateVars.creation_datetime = f();
                u.privateVars.id = u.baseClass + "-" + u.privateVars.creation_datetime + "-" + v;
                d(w, u);
                a(w).bind("managebubblepopup", function (y, C, B) {
                    var N = n(this);
                    if (i(N) && i(N.privateVars) && typeof C != "undefined" && typeof B != "undefined") {
                        if (N.manageMouseEvents) {
                            var E = a(this);
                            var z = E.offset();
                            var L = parseInt(z.top);
                            var H = parseInt(z.left);
                            var F = parseInt(E.outerWidth(false));
                            var K = parseInt(E.outerHeight(false));
                            var J = false;
                            if (H <= C && C <= F + H && L <= B && B <= K + L) {
                                J = true
                            } else {
                                J = false
                            }
                            if (J && !N.privateVars.is_mouse_over) {
                                N.privateVars.is_mouse_over = true;
                                d(this, N);
                                if (N.mouseOver == "show") {
                                    a(this).trigger("showbubblepopup")
                                } else {
                                    if (N.selectable && a("#" + N.privateVars.id).length > 0) {
                                        var x = a("#" + N.privateVars.id);
                                        var A = x.offset();
                                        var D = parseInt(A.top);
                                        var I = parseInt(A.left);
                                        var G = parseInt(x.outerWidth(false));
                                        var M = parseInt(x.outerHeight(false));
                                        if (I <= C && C <= G + I && D <= B && B <= M + D) {} else {
                                            a(this).trigger("hidebubblepopup")
                                        }
                                    } else {
                                        a(this).trigger("hidebubblepopup")
                                    }
                                }
                            } else {
                                if (!J && N.privateVars.is_mouse_over) {
                                    N.privateVars.is_mouse_over = false;
                                    d(this, N);
                                    if (N.mouseOut == "show") {
                                        a(this).trigger("showbubblepopup")
                                    } else {
                                        if (N.selectable && a("#" + N.privateVars.id).length > 0) {
                                            var x = a("#" + N.privateVars.id);
                                            var A = x.offset();
                                            var D = parseInt(A.top);
                                            var I = parseInt(A.left);
                                            var G = parseInt(x.outerWidth(false));
                                            var M = parseInt(x.outerHeight(false));
                                            if (I <= C && C <= G + I && D <= B && B <= M + D) {} else {
                                                a(this).trigger("hidebubblepopup")
                                            }
                                        } else {
                                            a(this).trigger("hidebubblepopup")
                                        }
                                    }
                                } else {
                                    if (!J && !N.privateVars.is_mouse_over) {
                                        if (N.selectable && a("#" + N.privateVars.id).length > 0 && !N.privateVars.is_animating) {
                                            var x = a("#" + N.privateVars.id);
                                            var A = x.offset();
                                            var D = parseInt(A.top);
                                            var I = parseInt(A.left);
                                            var G = parseInt(x.outerWidth(false));
                                            var M = parseInt(x.outerHeight(false));
                                            if (I <= C && C <= G + I && D <= B && B <= M + D) {} else {
                                                a(this).trigger("hidebubblepopup")
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                a(w).bind("setbubblepopupinnerhtml", function (A, x, z) {
                    var y = n(this);
                    if (i(y) && i(y.privateVars) && typeof x != "undefined") {
                        y.privateVars.last_modified_datetime = f();
                        if (typeof z == "boolean" && z == true) {
                            y.innerHtml = x
                        }
                        d(this, y);
                        if (a("#" + y.privateVars.id).length > 0) {
                            a("#" + y.privateVars.id).find("td." + y.baseClass + "-innerHtml").html(x);
                            if (y.privateVars.is_animation_complete) {
                                a(this).trigger("positionbubblepopup", [false])
                            } else {
                                a(this).trigger("positionbubblepopup", [true])
                            }
                        }
                    }
                });
                a(w).bind("setbubblepopupoptions", function (A, z) {
                    var x = n(this);
                    if (i(x) && i(x.privateVars)) {
                        var y = x;
                        x = g(z);
                        x.privateVars.id = y.privateVars.id;
                        x.privateVars.creation_datetime = y.privateVars.creation_datetime;
                        x.privateVars.last_modified_datetime = f();
                        x.privateVars.last_display_datetime = y.privateVars.last_display_datetime;
                        x.privateVars.is_open = y.privateVars.is_open;
                        x.privateVars.is_freezed = y.privateVars.is_freezed;
                        x.privateVars.last_options = {};
                        d(this, x)
                    }
                });
                a(w).bind("positionbubblepopup", function (A, y) {
                    var z = n(this);
                    if (i(z) && i(z.privateVars) && a("#" + z.privateVars.id).length > 0 && z.privateVars.is_open == true) {
                        var x = a("#" + z.privateVars.id);
                        var C = c(x, a(this), z);
                        var B = 2;
                        if (typeof y == "boolean" && y == true) {
                            x.css({
                                top: C.top,
                                left: C.left
                            })
                        } else {
                            switch (z.position) {
                            case "left":
                                x.css({
                                    top: C.top,
                                    left: (C.position != z.position ? C.left - (Math.abs(z.themeMargins.difference) * B) : C.left + (Math.abs(z.themeMargins.difference) * B))
                                });
                                break;
                            case "top":
                                x.css({
                                    top: (C.position != z.position ? C.top - (Math.abs(z.themeMargins.difference) * B) : C.top + (Math.abs(z.themeMargins.difference) * B)),
                                    left: C.left
                                });
                                break;
                            case "right":
                                x.css({
                                    top: C.top,
                                    left: (C.position != z.position ? C.left + (Math.abs(z.themeMargins.difference) * B) : C.left - (Math.abs(z.themeMargins.difference) * B))
                                });
                                break;
                            case "bottom":
                                x.css({
                                    top: (C.position != z.position ? C.top + (Math.abs(z.themeMargins.difference) * B) : C.top - (Math.abs(z.themeMargins.difference) * B)),
                                    left: C.left
                                });
                                break
                            }
                        }
                    }
                });
                a(w).bind("freezebubblepopup", function () {
                    var x = n(this);
                    if (i(x) && i(x.privateVars)) {
                        x.privateVars.is_freezed = true;
                        d(this, x)
                    }
                });
                a(w).bind("unfreezebubblepopup", function () {
                    var x = n(this);
                    if (i(x) && i(x.privateVars)) {
                        x.privateVars.is_freezed = false;
                        d(this, x)
                    }
                });
                a(w).bind("showbubblepopup", function (x, A, D, G) {
                    var H = n(this);
                    if ((typeof G == "boolean" && G == true && (i(H) && i(H.privateVars))) || (typeof G == "undefined" && (i(H) && i(H.privateVars) && !H.privateVars.is_freezed && !H.privateVars.is_open))) {
                        if (typeof G == "boolean" && G == true) {
                            a(this).trigger("unfreezebubblepopup")
                        }
                        H.privateVars.is_open = true;
                        H.privateVars.is_freezed = false;
                        H.privateVars.is_animating = false;
                        H.privateVars.is_animation_complete = false;
                        if (i(H.privateVars.last_options)) {
                            H = H.privateVars.last_options
                        } else {
                            H.privateVars.last_options = {}
                        }
                        if (i(A)) {
                            var C = H;
                            var F = f();
                            H = g(A);
                            H.privateVars.id = C.privateVars.id;
                            H.privateVars.creation_datetime = C.privateVars.creation_datetime;
                            H.privateVars.last_modified_datetime = F;
                            H.privateVars.last_display_datetime = F;
                            H.privateVars.is_open = true;
                            H.privateVars.is_freezed = false;
                            H.privateVars.is_animating = false;
                            H.privateVars.is_animation_complete = false;
                            H.privateVars.is_mouse_over = C.privateVars.is_mouse_over;
                            H.privateVars.is_position_changed = C.privateVars.is_position_changed;
                            H.privateVars.last_options = {};
                            if (typeof D == "boolean" && D == false) {
                                C.privateVars.last_modified_datetime = F;
                                C.privateVars.last_display_datetime = F;
                                H.privateVars.last_options = C
                            }
                        }
                        d(this, H);
                        b(H);
                        if (a("#" + H.privateVars.id).length > 0) {
                            a("#" + H.privateVars.id).remove()
                        }
                        var y = {};
                        var B = p(H);
                        y = a(B);
                        y.appendTo("body");
                        y = a("#" + H.privateVars.id);
                        y.css({
                            opacity: 0,
                            top: "0px",
                            left: "0px",
                            position: "absolute",
                            display: "block"
                        });
                        if (H.dropShadow == true) {
                            if (a.browser.msie && parseInt(a.browser.version) < 9) {
                                a("#" + H.privateVars.id + " table").addClass(H.baseClass + "-ie")
                            }
                        }
                        q(H);
                        var E = c(y, a(this), H);
                        y.css({
                            top: E.top,
                            left: E.left
                        });
                        if (E.position == H.position) {
                            H.privateVars.is_position_changed = false
                        } else {
                            H.privateVars.is_position_changed = true
                        }
                        d(this, H);
                        var z = setTimeout(function () {
                            H.privateVars.is_animating = true;
                            d(w, H);
                            y.stop();
                            switch (H.position) {
                            case "left":
                                y.animate({
                                    opacity: 1,
                                    left: (H.privateVars.is_position_changed ? "-=" : "+=") + H.distance + "px"
                                }, H.openingSpeed, "swing", function () {
                                    H.privateVars.is_animating = false;
                                    H.privateVars.is_animation_complete = true;
                                    d(w, H);
                                    if (H.dropShadow == true) {
                                        if (a.browser.msie && parseInt(a.browser.version) > 8) {
                                            y.addClass(H.baseClass + "-ie")
                                        }
                                    }
                                    H.afterShown()
                                });
                                break;
                            case "top":
                                y.animate({
                                    opacity: 1,
                                    top: (H.privateVars.is_position_changed ? "-=" : "+=") + H.distance + "px"
                                }, H.openingSpeed, "swing", function () {
                                    H.privateVars.is_animating = false;
                                    H.privateVars.is_animation_complete = true;
                                    d(w, H);
                                    if (H.dropShadow == true) {
                                        if (a.browser.msie && parseInt(a.browser.version) > 8) {
                                            y.addClass(H.baseClass + "-ie")
                                        }
                                    }
                                    H.afterShown()
                                });
                                break;
                            case "right":
                                y.animate({
                                    opacity: 1,
                                    left: (H.privateVars.is_position_changed ? "+=" : "-=") + H.distance + "px"
                                }, H.openingSpeed, "swing", function () {
                                    H.privateVars.is_animating = false;
                                    H.privateVars.is_animation_complete = true;
                                    d(w, H);
                                    if (H.dropShadow == true) {
                                        if (a.browser.msie && parseInt(a.browser.version) > 8) {
                                            y.addClass(H.baseClass + "-ie")
                                        }
                                    }
                                    H.afterShown()
                                });
                                break;
                            case "bottom":
                                y.animate({
                                    opacity: 1,
                                    top: (H.privateVars.is_position_changed ? "+=" : "-=") + H.distance + "px"
                                }, H.openingSpeed, "swing", function () {
                                    H.privateVars.is_animating = false;
                                    H.privateVars.is_animation_complete = true;
                                    d(w, H);
                                    if (H.dropShadow == true) {
                                        if (a.browser.msie && parseInt(a.browser.version) > 8) {
                                            y.addClass(H.baseClass + "-ie")
                                        }
                                    }
                                    H.afterShown()
                                });
                                break
                            }
                        }, H.openingDelay)
                    }
                });
                a(w).bind("hidebubblepopup", function (B, x) {
                    var A = n(this);
                    if ((typeof x == "boolean" && x == true && (i(A) && i(A.privateVars) && a("#" + A.privateVars.id).length > 0)) || (typeof x == "undefined" && (i(A) && i(A.privateVars) && a("#" + A.privateVars.id).length > 0 && !A.privateVars.is_freezed && A.privateVars.is_open))) {
                        if (typeof x == "boolean" && x == true) {
                            a(this).trigger("unfreezebubblepopup")
                        }
                        A.privateVars.is_animating = false;
                        A.privateVars.is_animation_complete = false;
                        d(this, A);
                        var y = a("#" + A.privateVars.id);
                        var z = typeof x == "undefined" ? A.closingDelay : 0;
                        var C = setTimeout(function () {
                            A.privateVars.is_animating = true;
                            d(w, A);
                            y.stop();
                            if (A.dropShadow == true) {
                                if (a.browser.msie && parseInt(a.browser.version) > 8) {
                                    y.removeClass(A.baseClass + "-ie")
                                }
                            }
                            switch (A.position) {
                            case "left":
                                y.animate({
                                    opacity: 0,
                                    left: (A.privateVars.is_position_changed ? "+=" : "-=") + A.distance + "px"
                                }, A.closingSpeed, "swing", function () {
                                    A.privateVars.is_open = false;
                                    A.privateVars.is_animating = false;
                                    A.privateVars.is_animation_complete = true;
                                    d(w, A);
                                    y.css("display", "none");
                                    A.afterHidden()
                                });
                                break;
                            case "top":
                                y.animate({
                                    opacity: 0,
                                    top: (A.privateVars.is_position_changed ? "+=" : "-=") + A.distance + "px"
                                }, A.closingSpeed, "swing", function () {
                                    A.privateVars.is_open = false;
                                    A.privateVars.is_animating = false;
                                    A.privateVars.is_animation_complete = true;
                                    d(w, A);
                                    y.css("display", "none");
                                    A.afterHidden()
                                });
                                break;
                            case "right":
                                y.animate({
                                    opacity: 0,
                                    left: (A.privateVars.is_position_changed ? "-=" : "+=") + A.distance + "px"
                                }, A.closingSpeed, "swing", function () {
                                    A.privateVars.is_open = false;
                                    A.privateVars.is_animating = false;
                                    A.privateVars.is_animation_complete = true;
                                    d(w, A);
                                    y.css("display", "none");
                                    A.afterHidden()
                                });
                                break;
                            case "bottom":
                                y.animate({
                                    opacity: 0,
                                    top: (A.privateVars.is_position_changed ? "-=" : "+=") + A.distance + "px"
                                }, A.closingSpeed, "swing", function () {
                                    A.privateVars.is_open = false;
                                    A.privateVars.is_animating = false;
                                    A.privateVars.is_animation_complete = true;
                                    d(w, A);
                                    y.css("display", "none");
                                    A.afterHidden()
                                });
                                break
                            }
                        }, z);
                        A.privateVars.last_display_datetime = f();
                        A.privateVars.is_freezed = false;
                        d(this, A);
                        s(A)
                    }
                })
            })
        }
        return this
    }
})(jQuery);


/*
 * jPlayer Plugin for jQuery JavaScript Library
 * http://www.happyworm.com/jquery/jplayer
 *
 * Copyright (c) 2009 - 2010 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Mark J Panaghiston
 * Version: 2.0.0
 * Date: 20th December 2010
 */

(function(c,h){c.fn.jPlayer=function(a){var b=typeof a==="string",d=Array.prototype.slice.call(arguments,1),f=this;a=!b&&d.length?c.extend.apply(null,[true,a].concat(d)):a;if(b&&a.charAt(0)==="_")return f;b?this.each(function(){var e=c.data(this,"jPlayer"),g=e&&c.isFunction(e[a])?e[a].apply(e,d):e;if(g!==e&&g!==h){f=g;return false}}):this.each(function(){var e=c.data(this,"jPlayer");if(e){e.option(a||{})._init();e.option(a||{})}else c.data(this,"jPlayer",new c.jPlayer(a,this))});return f};c.jPlayer=
function(a,b){if(arguments.length){this.element=c(b);this.options=c.extend(true,{},this.options,a);var d=this;this.element.bind("remove.jPlayer",function(){d.destroy()});this._init()}};c.jPlayer.event={ready:"jPlayer_ready",resize:"jPlayer_resize",error:"jPlayer_error",warning:"jPlayer_warning",loadstart:"jPlayer_loadstart",progress:"jPlayer_progress",suspend:"jPlayer_suspend",abort:"jPlayer_abort",emptied:"jPlayer_emptied",stalled:"jPlayer_stalled",play:"jPlayer_play",pause:"jPlayer_pause",loadedmetadata:"jPlayer_loadedmetadata",
loadeddata:"jPlayer_loadeddata",waiting:"jPlayer_waiting",playing:"jPlayer_playing",canplay:"jPlayer_canplay",canplaythrough:"jPlayer_canplaythrough",seeking:"jPlayer_seeking",seeked:"jPlayer_seeked",timeupdate:"jPlayer_timeupdate",ended:"jPlayer_ended",ratechange:"jPlayer_ratechange",durationchange:"jPlayer_durationchange",volumechange:"jPlayer_volumechange"};c.jPlayer.htmlEvent=["loadstart","abort","emptied","stalled","loadedmetadata","loadeddata","canplaythrough","ratechange"];c.jPlayer.pause=
function(){c.each(c.jPlayer.prototype.instances,function(a,b){b.data("jPlayer").status.srcSet&&b.jPlayer("pause")})};c.jPlayer.timeFormat={showHour:false,showMin:true,showSec:true,padHour:false,padMin:true,padSec:true,sepHour:":",sepMin:":",sepSec:""};c.jPlayer.convertTime=function(a){a=new Date(a*1E3);var b=a.getUTCHours(),d=a.getUTCMinutes();a=a.getUTCSeconds();b=c.jPlayer.timeFormat.padHour&&b<10?"0"+b:b;d=c.jPlayer.timeFormat.padMin&&d<10?"0"+d:d;a=c.jPlayer.timeFormat.padSec&&a<10?"0"+a:a;return(c.jPlayer.timeFormat.showHour?
b+c.jPlayer.timeFormat.sepHour:"")+(c.jPlayer.timeFormat.showMin?d+c.jPlayer.timeFormat.sepMin:"")+(c.jPlayer.timeFormat.showSec?a+c.jPlayer.timeFormat.sepSec:"")};c.jPlayer.uaMatch=function(a){a=a.toLowerCase();var b=/(opera)(?:.*version)?[ \/]([\w.]+)/,d=/(msie) ([\w.]+)/,f=/(mozilla)(?:.*? rv:([\w.]+))?/;a=/(webkit)[ \/]([\w.]+)/.exec(a)||b.exec(a)||d.exec(a)||a.indexOf("compatible")<0&&f.exec(a)||[];return{browser:a[1]||"",version:a[2]||"0"}};c.jPlayer.browser={};var m=c.jPlayer.uaMatch(navigator.userAgent);
if(m.browser){c.jPlayer.browser[m.browser]=true;c.jPlayer.browser.version=m.version}c.jPlayer.prototype={count:0,version:{script:"2.0.0",needFlash:"2.0.0",flash:"unknown"},options:{swfPath:"js",solution:"html, flash",supplied:"mp3",preload:"metadata",volume:0.8,muted:false,backgroundColor:"#000000",cssSelectorAncestor:"#jp_interface_1",cssSelector:{videoPlay:".jp-video-play",play:".jp-play",pause:".jp-pause",stop:".jp-stop",seekBar:".jp-seek-bar",playBar:".jp-play-bar",mute:".jp-mute",unmute:".jp-unmute",
volumeBar:".jp-volume-bar",volumeBarValue:".jp-volume-bar-value",currentTime:".jp-current-time",duration:".jp-duration"},idPrefix:"jp",errorAlerts:false,warningAlerts:false},instances:{},status:{src:"",media:{},paused:true,format:{},formatType:"",waitForPlay:true,waitForLoad:true,srcSet:false,video:false,seekPercent:0,currentPercentRelative:0,currentPercentAbsolute:0,currentTime:0,duration:0},_status:{volume:h,muted:false,width:0,height:0},internal:{ready:false,instance:h,htmlDlyCmdId:h},solution:{html:true,
flash:true},format:{mp3:{codec:'audio/mpeg; codecs="mp3"',flashCanPlay:true,media:"audio"},m4a:{codec:'audio/mp4; codecs="mp4a.40.2"',flashCanPlay:true,media:"audio"},oga:{codec:'audio/ogg; codecs="vorbis"',flashCanPlay:false,media:"audio"},wav:{codec:'audio/wav; codecs="1"',flashCanPlay:false,media:"audio"},webma:{codec:'audio/webm; codecs="vorbis"',flashCanPlay:false,media:"audio"},m4v:{codec:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',flashCanPlay:true,media:"video"},ogv:{codec:'video/ogg; codecs="theora, vorbis"',
flashCanPlay:false,media:"video"},webmv:{codec:'video/webm; codecs="vorbis, vp8"',flashCanPlay:false,media:"video"}},_init:function(){var a=this;this.element.empty();this.status=c.extend({},this.status,this._status);this.internal=c.extend({},this.internal);this.formats=[];this.solutions=[];this.require={};this.htmlElement={};this.html={};this.html.audio={};this.html.video={};this.flash={};this.css={};this.css.cs={};this.css.jq={};this.status.volume=this._limitValue(this.options.volume,0,1);this.status.muted=
this.options.muted;this.status.width=this.element.css("width");this.status.height=this.element.css("height");this.element.css({"background-color":this.options.backgroundColor});c.each(this.options.supplied.toLowerCase().split(","),function(e,g){var i=g.replace(/^\s+|\s+$/g,"");if(a.format[i]){var j=false;c.each(a.formats,function(n,k){if(i===k){j=true;return false}});j||a.formats.push(i)}});c.each(this.options.solution.toLowerCase().split(","),function(e,g){var i=g.replace(/^\s+|\s+$/g,"");if(a.solution[i]){var j=
false;c.each(a.solutions,function(n,k){if(i===k){j=true;return false}});j||a.solutions.push(i)}});this.internal.instance="jp_"+this.count;this.instances[this.internal.instance]=this.element;this.element.attr("id")===""&&this.element.attr("id",this.options.idPrefix+"_jplayer_"+this.count);this.internal.self=c.extend({},{id:this.element.attr("id"),jq:this.element});this.internal.audio=c.extend({},{id:this.options.idPrefix+"_audio_"+this.count,jq:h});this.internal.video=c.extend({},{id:this.options.idPrefix+
"_video_"+this.count,jq:h});this.internal.flash=c.extend({},{id:this.options.idPrefix+"_flash_"+this.count,jq:h,swf:this.options.swfPath+(this.options.swfPath!==""&&this.options.swfPath.slice(-1)!=="/"?"/":"")+"Jplayer.swf"});this.internal.poster=c.extend({},{id:this.options.idPrefix+"_poster_"+this.count,jq:h});c.each(c.jPlayer.event,function(e,g){if(a.options[e]!==h){a.element.bind(g+".jPlayer",a.options[e]);a.options[e]=h}});this.htmlElement.poster=document.createElement("img");this.htmlElement.poster.id=
this.internal.poster.id;this.htmlElement.poster.onload=function(){if(!a.status.video||a.status.waitForPlay)a.internal.poster.jq.show()};this.element.append(this.htmlElement.poster);this.internal.poster.jq=c("#"+this.internal.poster.id);this.internal.poster.jq.css({width:this.status.width,height:this.status.height});this.internal.poster.jq.hide();this.require.audio=false;this.require.video=false;c.each(this.formats,function(e,g){a.require[a.format[g].media]=true});this.html.audio.available=false;if(this.require.audio){this.htmlElement.audio=
document.createElement("audio");this.htmlElement.audio.id=this.internal.audio.id;this.html.audio.available=!!this.htmlElement.audio.canPlayType}this.html.video.available=false;if(this.require.video){this.htmlElement.video=document.createElement("video");this.htmlElement.video.id=this.internal.video.id;this.html.video.available=!!this.htmlElement.video.canPlayType}this.flash.available=this._checkForFlash(10);this.html.canPlay={};this.flash.canPlay={};c.each(this.formats,function(e,g){a.html.canPlay[g]=
a.html[a.format[g].media].available&&""!==a.htmlElement[a.format[g].media].canPlayType(a.format[g].codec);a.flash.canPlay[g]=a.format[g].flashCanPlay&&a.flash.available});this.html.desired=false;this.flash.desired=false;c.each(this.solutions,function(e,g){if(e===0)a[g].desired=true;else{var i=false,j=false;c.each(a.formats,function(n,k){if(a[a.solutions[0]].canPlay[k])if(a.format[k].media==="video")j=true;else i=true});a[g].desired=a.require.audio&&!i||a.require.video&&!j}});this.html.support={};
this.flash.support={};c.each(this.formats,function(e,g){a.html.support[g]=a.html.canPlay[g]&&a.html.desired;a.flash.support[g]=a.flash.canPlay[g]&&a.flash.desired});this.html.used=false;this.flash.used=false;c.each(this.solutions,function(e,g){c.each(a.formats,function(i,j){if(a[g].support[j]){a[g].used=true;return false}})});this.html.used||this.flash.used||this._error({type:c.jPlayer.error.NO_SOLUTION,context:"{solution:'"+this.options.solution+"', supplied:'"+this.options.supplied+"'}",message:c.jPlayer.errorMsg.NO_SOLUTION,
hint:c.jPlayer.errorHint.NO_SOLUTION});this.html.active=false;this.html.audio.gate=false;this.html.video.gate=false;this.flash.active=false;this.flash.gate=false;if(this.flash.used){var b="id="+escape(this.internal.self.id)+"&vol="+this.status.volume+"&muted="+this.status.muted;if(c.browser.msie&&Number(c.browser.version)<=8){var d='<object id="'+this.internal.flash.id+'"';d+=' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';d+=' codebase="'+document.URL.substring(0,document.URL.indexOf(":"))+
'://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"';d+=' type="application/x-shockwave-flash"';d+=' width="0" height="0">';d+="</object>";var f=[];f[0]='<param name="movie" value="'+this.internal.flash.swf+'" />';f[1]='<param name="quality" value="high" />';f[2]='<param name="FlashVars" value="'+b+'" />';f[3]='<param name="allowScriptAccess" value="always" />';f[4]='<param name="bgcolor" value="'+this.options.backgroundColor+'" />';b=document.createElement(d);for(d=0;d<f.length;d++)b.appendChild(document.createElement(f[d]));
this.element.append(b)}else{f='<embed name="'+this.internal.flash.id+'" id="'+this.internal.flash.id+'" src="'+this.internal.flash.swf+'"';f+=' width="0" height="0" bgcolor="'+this.options.backgroundColor+'"';f+=' quality="high" FlashVars="'+b+'"';f+=' allowScriptAccess="always"';f+=' type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';this.element.append(f)}this.internal.flash.jq=c("#"+this.internal.flash.id);this.internal.flash.jq.css({width:"0px",
height:"0px"})}if(this.html.used){if(this.html.audio.available){this._addHtmlEventListeners(this.htmlElement.audio,this.html.audio);this.element.append(this.htmlElement.audio);this.internal.audio.jq=c("#"+this.internal.audio.id)}if(this.html.video.available){this._addHtmlEventListeners(this.htmlElement.video,this.html.video);this.element.append(this.htmlElement.video);this.internal.video.jq=c("#"+this.internal.video.id);this.internal.video.jq.css({width:"0px",height:"0px"})}}this.html.used&&!this.flash.used&&
window.setTimeout(function(){a.internal.ready=true;a.version.flash="n/a";a._trigger(c.jPlayer.event.ready)},100);c.each(this.options.cssSelector,function(e,g){a._cssSelector(e,g)});this._updateInterface();this._updateButtons(false);this._updateVolume(this.status.volume);this._updateMute(this.status.muted);this.css.jq.videoPlay.length&&this.css.jq.videoPlay.hide();c.jPlayer.prototype.count++},destroy:function(){this._resetStatus();this._updateInterface();this._seeked();this.css.jq.currentTime.length&&
this.css.jq.currentTime.text("");this.css.jq.duration.length&&this.css.jq.duration.text("");this.status.srcSet&&this.pause();c.each(this.css.jq,function(a,b){b.unbind(".jPlayer")});this.element.removeData("jPlayer");this.element.unbind(".jPlayer");this.element.empty();this.instances[this.internal.instance]=h},enable:function(){},disable:function(){},_addHtmlEventListeners:function(a,b){var d=this;a.preload=this.options.preload;a.muted=this.options.muted;a.addEventListener("progress",function(){if(b.gate&&
!d.status.waitForLoad){d._getHtmlStatus(a);d._updateInterface();d._trigger(c.jPlayer.event.progress)}},false);a.addEventListener("timeupdate",function(){if(b.gate&&!d.status.waitForLoad){d._getHtmlStatus(a);d._updateInterface();d._trigger(c.jPlayer.event.timeupdate)}},false);a.addEventListener("durationchange",function(){if(b.gate&&!d.status.waitForLoad){d.status.duration=this.duration;d._getHtmlStatus(a);d._updateInterface();d._trigger(c.jPlayer.event.durationchange)}},false);a.addEventListener("play",
function(){if(b.gate&&!d.status.waitForLoad){d._updateButtons(true);d._trigger(c.jPlayer.event.play)}},false);a.addEventListener("playing",function(){if(b.gate&&!d.status.waitForLoad){d._updateButtons(true);d._seeked();d._trigger(c.jPlayer.event.playing)}},false);a.addEventListener("pause",function(){if(b.gate&&!d.status.waitForLoad){d._updateButtons(false);d._trigger(c.jPlayer.event.pause)}},false);a.addEventListener("waiting",function(){if(b.gate&&!d.status.waitForLoad){d._seeking();d._trigger(c.jPlayer.event.waiting)}},
false);a.addEventListener("canplay",function(){if(b.gate&&!d.status.waitForLoad){a.volume=d._volumeFix(d.status.volume);d._trigger(c.jPlayer.event.canplay)}},false);a.addEventListener("seeking",function(){if(b.gate&&!d.status.waitForLoad){d._seeking();d._trigger(c.jPlayer.event.seeking)}},false);a.addEventListener("seeked",function(){if(b.gate&&!d.status.waitForLoad){d._seeked();d._trigger(c.jPlayer.event.seeked)}},false);a.addEventListener("suspend",function(){if(b.gate&&!d.status.waitForLoad){d._seeked();
d._trigger(c.jPlayer.event.suspend)}},false);a.addEventListener("ended",function(){if(b.gate&&!d.status.waitForLoad){if(!c.jPlayer.browser.webkit)d.htmlElement.media.currentTime=0;d.htmlElement.media.pause();d._updateButtons(false);d._getHtmlStatus(a,true);d._updateInterface();d._trigger(c.jPlayer.event.ended)}},false);a.addEventListener("error",function(){if(b.gate&&!d.status.waitForLoad){d._updateButtons(false);d._seeked();if(d.status.srcSet){d.status.waitForLoad=true;d.status.waitForPlay=true;
d.status.video&&d.internal.video.jq.css({width:"0px",height:"0px"});d._validString(d.status.media.poster)&&d.internal.poster.jq.show();d.css.jq.videoPlay.length&&d.css.jq.videoPlay.show();d._error({type:c.jPlayer.error.URL,context:d.status.src,message:c.jPlayer.errorMsg.URL,hint:c.jPlayer.errorHint.URL})}}},false);c.each(c.jPlayer.htmlEvent,function(f,e){a.addEventListener(this,function(){b.gate&&!d.status.waitForLoad&&d._trigger(c.jPlayer.event[e])},false)})},_getHtmlStatus:function(a,b){var d=0,
f=0,e=0,g=0;d=a.currentTime;f=this.status.duration>0?100*d/this.status.duration:0;if(typeof a.seekable==="object"&&a.seekable.length>0){e=this.status.duration>0?100*a.seekable.end(a.seekable.length-1)/this.status.duration:100;g=100*a.currentTime/a.seekable.end(a.seekable.length-1)}else{e=100;g=f}if(b)f=g=d=0;this.status.seekPercent=e;this.status.currentPercentRelative=g;this.status.currentPercentAbsolute=f;this.status.currentTime=d},_resetStatus:function(){this.status=c.extend({},this.status,c.jPlayer.prototype.status)},
_trigger:function(a,b,d){a=c.Event(a);a.jPlayer={};a.jPlayer.version=c.extend({},this.version);a.jPlayer.status=c.extend(true,{},this.status);a.jPlayer.html=c.extend(true,{},this.html);a.jPlayer.flash=c.extend(true,{},this.flash);if(b)a.jPlayer.error=c.extend({},b);if(d)a.jPlayer.warning=c.extend({},d);this.element.trigger(a)},jPlayerFlashEvent:function(a,b){if(a===c.jPlayer.event.ready&&!this.internal.ready){this.internal.ready=true;this.version.flash=b.version;this.version.needFlash!==this.version.flash&&
this._error({type:c.jPlayer.error.VERSION,context:this.version.flash,message:c.jPlayer.errorMsg.VERSION+this.version.flash,hint:c.jPlayer.errorHint.VERSION});this._trigger(a)}if(this.flash.gate)switch(a){case c.jPlayer.event.progress:this._getFlashStatus(b);this._updateInterface();this._trigger(a);break;case c.jPlayer.event.timeupdate:this._getFlashStatus(b);this._updateInterface();this._trigger(a);break;case c.jPlayer.event.play:this._seeked();this._updateButtons(true);this._trigger(a);break;case c.jPlayer.event.pause:this._updateButtons(false);
this._trigger(a);break;case c.jPlayer.event.ended:this._updateButtons(false);this._trigger(a);break;case c.jPlayer.event.error:this.status.waitForLoad=true;this.status.waitForPlay=true;this.status.video&&this.internal.flash.jq.css({width:"0px",height:"0px"});this._validString(this.status.media.poster)&&this.internal.poster.jq.show();this.css.jq.videoPlay.length&&this.css.jq.videoPlay.show();this.status.video?this._flash_setVideo(this.status.media):this._flash_setAudio(this.status.media);this._error({type:c.jPlayer.error.URL,
context:b.src,message:c.jPlayer.errorMsg.URL,hint:c.jPlayer.errorHint.URL});break;case c.jPlayer.event.seeking:this._seeking();this._trigger(a);break;case c.jPlayer.event.seeked:this._seeked();this._trigger(a);break;default:this._trigger(a)}return false},_getFlashStatus:function(a){this.status.seekPercent=a.seekPercent;this.status.currentPercentRelative=a.currentPercentRelative;this.status.currentPercentAbsolute=a.currentPercentAbsolute;this.status.currentTime=a.currentTime;this.status.duration=a.duration},
_updateButtons:function(a){this.status.paused=!a;if(this.css.jq.play.length&&this.css.jq.pause.length)if(a){this.css.jq.play.hide();this.css.jq.pause.show()}else{this.css.jq.play.show();this.css.jq.pause.hide()}},_updateInterface:function(){this.css.jq.seekBar.length&&this.css.jq.seekBar.width(this.status.seekPercent+"%");this.css.jq.playBar.length&&this.css.jq.playBar.width(this.status.currentPercentRelative+"%");this.css.jq.currentTime.length&&this.css.jq.currentTime.text(c.jPlayer.convertTime(this.status.currentTime));
this.css.jq.duration.length&&this.css.jq.duration.text(c.jPlayer.convertTime(this.status.duration))},_seeking:function(){this.css.jq.seekBar.length&&this.css.jq.seekBar.addClass("jp-seeking-bg")},_seeked:function(){this.css.jq.seekBar.length&&this.css.jq.seekBar.removeClass("jp-seeking-bg")},setMedia:function(a){var b=this;this._seeked();clearTimeout(this.internal.htmlDlyCmdId);var d=this.html.audio.gate,f=this.html.video.gate,e=false;c.each(this.formats,function(g,i){var j=b.format[i].media==="video";
c.each(b.solutions,function(n,k){if(b[k].support[i]&&b._validString(a[i])){var l=k==="html";if(j)if(l){b.html.audio.gate=false;b.html.video.gate=true;b.flash.gate=false}else{b.html.audio.gate=false;b.html.video.gate=false;b.flash.gate=true}else if(l){b.html.audio.gate=true;b.html.video.gate=false;b.flash.gate=false}else{b.html.audio.gate=false;b.html.video.gate=false;b.flash.gate=true}if(b.flash.active||b.html.active&&b.flash.gate||d===b.html.audio.gate&&f===b.html.video.gate)b.clearMedia();else if(d!==
b.html.audio.gate&&f!==b.html.video.gate){b._html_pause();b.status.video&&b.internal.video.jq.css({width:"0px",height:"0px"});b._resetStatus()}if(j){if(l){b._html_setVideo(a);b.html.active=true;b.flash.active=false}else{b._flash_setVideo(a);b.html.active=false;b.flash.active=true}b.css.jq.videoPlay.length&&b.css.jq.videoPlay.show();b.status.video=true}else{if(l){b._html_setAudio(a);b.html.active=true;b.flash.active=false}else{b._flash_setAudio(a);b.html.active=false;b.flash.active=true}b.css.jq.videoPlay.length&&
b.css.jq.videoPlay.hide();b.status.video=false}e=true;return false}});if(e)return false});if(e){if(this._validString(a.poster))if(this.htmlElement.poster.src!==a.poster)this.htmlElement.poster.src=a.poster;else this.internal.poster.jq.show();else this.internal.poster.jq.hide();this.status.srcSet=true;this.status.media=c.extend({},a);this._updateButtons(false);this._updateInterface()}else{this.status.srcSet&&!this.status.waitForPlay&&this.pause();this.html.audio.gate=false;this.html.video.gate=false;
this.flash.gate=false;this.html.active=false;this.flash.active=false;this._resetStatus();this._updateInterface();this._updateButtons(false);this.internal.poster.jq.hide();this.html.used&&this.require.video&&this.internal.video.jq.css({width:"0px",height:"0px"});this.flash.used&&this.internal.flash.jq.css({width:"0px",height:"0px"});this._error({type:c.jPlayer.error.NO_SUPPORT,context:"{supplied:'"+this.options.supplied+"'}",message:c.jPlayer.errorMsg.NO_SUPPORT,hint:c.jPlayer.errorHint.NO_SUPPORT})}},
clearMedia:function(){this._resetStatus();this._updateButtons(false);this.internal.poster.jq.hide();clearTimeout(this.internal.htmlDlyCmdId);if(this.html.active)this._html_clearMedia();else this.flash.active&&this._flash_clearMedia()},load:function(){if(this.status.srcSet)if(this.html.active)this._html_load();else this.flash.active&&this._flash_load();else this._urlNotSetError("load")},play:function(a){a=typeof a==="number"?a:NaN;if(this.status.srcSet)if(this.html.active)this._html_play(a);else this.flash.active&&
this._flash_play(a);else this._urlNotSetError("play")},videoPlay:function(){this.play()},pause:function(a){a=typeof a==="number"?a:NaN;if(this.status.srcSet)if(this.html.active)this._html_pause(a);else this.flash.active&&this._flash_pause(a);else this._urlNotSetError("pause")},pauseOthers:function(){var a=this;c.each(this.instances,function(b,d){a.element!==d&&d.data("jPlayer").status.srcSet&&d.jPlayer("pause")})},stop:function(){if(this.status.srcSet)if(this.html.active)this._html_pause(0);else this.flash.active&&
this._flash_pause(0);else this._urlNotSetError("stop")},playHead:function(a){a=this._limitValue(a,0,100);if(this.status.srcSet)if(this.html.active)this._html_playHead(a);else this.flash.active&&this._flash_playHead(a);else this._urlNotSetError("playHead")},mute:function(){this.status.muted=true;this.html.used&&this._html_mute(true);this.flash.used&&this._flash_mute(true);this._updateMute(true);this._updateVolume(0);this._trigger(c.jPlayer.event.volumechange)},unmute:function(){this.status.muted=false;
this.html.used&&this._html_mute(false);this.flash.used&&this._flash_mute(false);this._updateMute(false);this._updateVolume(this.status.volume);this._trigger(c.jPlayer.event.volumechange)},_updateMute:function(a){if(this.css.jq.mute.length&&this.css.jq.unmute.length)if(a){this.css.jq.mute.hide();this.css.jq.unmute.show()}else{this.css.jq.mute.show();this.css.jq.unmute.hide()}},volume:function(a){a=this._limitValue(a,0,1);this.status.volume=a;this.html.used&&this._html_volume(a);this.flash.used&&this._flash_volume(a);
this.status.muted||this._updateVolume(a);this._trigger(c.jPlayer.event.volumechange)},volumeBar:function(a){if(!this.status.muted&&this.css.jq.volumeBar){var b=this.css.jq.volumeBar.offset();a=a.pageX-b.left;b=this.css.jq.volumeBar.width();this.volume(a/b)}},volumeBarValue:function(a){this.volumeBar(a)},_updateVolume:function(a){this.css.jq.volumeBarValue.length&&this.css.jq.volumeBarValue.width(a*100+"%")},_volumeFix:function(a){var b=0.0010*Math.random();return a+(a<0.5?b:-b)},_cssSelectorAncestor:function(a,
b){this.options.cssSelectorAncestor=a;b&&c.each(this.options.cssSelector,function(d,f){self._cssSelector(d,f)})},_cssSelector:function(a,b){var d=this;if(typeof b==="string")if(c.jPlayer.prototype.options.cssSelector[a]){this.css.jq[a]&&this.css.jq[a].length&&this.css.jq[a].unbind(".jPlayer");this.options.cssSelector[a]=b;this.css.cs[a]=this.options.cssSelectorAncestor+" "+b;this.css.jq[a]=b?c(this.css.cs[a]):[];this.css.jq[a].length&&this.css.jq[a].bind("click.jPlayer",function(f){d[a](f);c(this).blur();
return false});b&&this.css.jq[a].length!==1&&this._warning({type:c.jPlayer.warning.CSS_SELECTOR_COUNT,context:this.css.cs[a],message:c.jPlayer.warningMsg.CSS_SELECTOR_COUNT+this.css.jq[a].length+" found for "+a+" method.",hint:c.jPlayer.warningHint.CSS_SELECTOR_COUNT})}else this._warning({type:c.jPlayer.warning.CSS_SELECTOR_METHOD,context:a,message:c.jPlayer.warningMsg.CSS_SELECTOR_METHOD,hint:c.jPlayer.warningHint.CSS_SELECTOR_METHOD});else this._warning({type:c.jPlayer.warning.CSS_SELECTOR_STRING,
context:b,message:c.jPlayer.warningMsg.CSS_SELECTOR_STRING,hint:c.jPlayer.warningHint.CSS_SELECTOR_STRING})},seekBar:function(a){if(this.css.jq.seekBar){var b=this.css.jq.seekBar.offset();a=a.pageX-b.left;b=this.css.jq.seekBar.width();this.playHead(100*a/b)}},playBar:function(a){this.seekBar(a)},currentTime:function(){},duration:function(){},option:function(a,b){var d=a;if(arguments.length===0)return c.extend(true,{},this.options);if(typeof a==="string"){var f=a.split(".");if(b===h){for(var e=c.extend(true,
{},this.options),g=0;g<f.length;g++)if(e[f[g]]!==h)e=e[f[g]];else{this._warning({type:c.jPlayer.warning.OPTION_KEY,context:a,message:c.jPlayer.warningMsg.OPTION_KEY,hint:c.jPlayer.warningHint.OPTION_KEY});return h}return e}e=d={};for(g=0;g<f.length;g++)if(g<f.length-1){e[f[g]]={};e=e[f[g]]}else e[f[g]]=b}this._setOptions(d);return this},_setOptions:function(a){var b=this;c.each(a,function(d,f){b._setOption(d,f)});return this},_setOption:function(a,b){var d=this;switch(a){case "cssSelectorAncestor":this.options[a]=
b;c.each(d.options.cssSelector,function(f,e){d._cssSelector(f,e)});break;case "cssSelector":c.each(b,function(f,e){d._cssSelector(f,e)})}return this},resize:function(a){this.html.active&&this._resizeHtml(a);this.flash.active&&this._resizeFlash(a);this._trigger(c.jPlayer.event.resize)},_resizePoster:function(){},_resizeHtml:function(){},_resizeFlash:function(a){this.internal.flash.jq.css({width:a.width,height:a.height})},_html_initMedia:function(){this.status.srcSet&&!this.status.waitForPlay&&this.htmlElement.media.pause();
this.options.preload!=="none"&&this._html_load();this._trigger(c.jPlayer.event.timeupdate)},_html_setAudio:function(a){var b=this;c.each(this.formats,function(d,f){if(b.html.support[f]&&a[f]){b.status.src=a[f];b.status.format[f]=true;b.status.formatType=f;return false}});this.htmlElement.media=this.htmlElement.audio;this._html_initMedia()},_html_setVideo:function(a){var b=this;c.each(this.formats,function(d,f){if(b.html.support[f]&&a[f]){b.status.src=a[f];b.status.format[f]=true;b.status.formatType=
f;return false}});this.htmlElement.media=this.htmlElement.video;this._html_initMedia()},_html_clearMedia:function(){if(this.htmlElement.media){this.htmlElement.media.id===this.internal.video.id&&this.internal.video.jq.css({width:"0px",height:"0px"});this.htmlElement.media.pause();this.htmlElement.media.src="";c.browser.msie&&Number(c.browser.version)>=9||this.htmlElement.media.load()}},_html_load:function(){if(this.status.waitForLoad){this.status.waitForLoad=false;this.htmlElement.media.src=this.status.src;
try{this.htmlElement.media.load()}catch(a){}}clearTimeout(this.internal.htmlDlyCmdId)},_html_play:function(a){var b=this;this._html_load();this.htmlElement.media.play();if(!isNaN(a))try{this.htmlElement.media.currentTime=a}catch(d){this.internal.htmlDlyCmdId=setTimeout(function(){b.play(a)},100);return}this._html_checkWaitForPlay()},_html_pause:function(a){var b=this;a>0?this._html_load():clearTimeout(this.internal.htmlDlyCmdId);this.htmlElement.media.pause();if(!isNaN(a))try{this.htmlElement.media.currentTime=
a}catch(d){this.internal.htmlDlyCmdId=setTimeout(function(){b.pause(a)},100);return}a>0&&this._html_checkWaitForPlay()},_html_playHead:function(a){var b=this;this._html_load();try{if(typeof this.htmlElement.media.seekable==="object"&&this.htmlElement.media.seekable.length>0)this.htmlElement.media.currentTime=a*this.htmlElement.media.seekable.end(this.htmlElement.media.seekable.length-1)/100;else if(this.htmlElement.media.duration>0&&!isNaN(this.htmlElement.media.duration))this.htmlElement.media.currentTime=
a*this.htmlElement.media.duration/100;else throw"e";}catch(d){this.internal.htmlDlyCmdId=setTimeout(function(){b.playHead(a)},100);return}this.status.waitForLoad||this._html_checkWaitForPlay()},_html_checkWaitForPlay:function(){if(this.status.waitForPlay){this.status.waitForPlay=false;this.css.jq.videoPlay.length&&this.css.jq.videoPlay.hide();if(this.status.video){this.internal.poster.jq.hide();this.internal.video.jq.css({width:this.status.width,height:this.status.height})}}},_html_volume:function(a){if(this.html.audio.available)this.htmlElement.audio.volume=
a;if(this.html.video.available)this.htmlElement.video.volume=a},_html_mute:function(a){if(this.html.audio.available)this.htmlElement.audio.muted=a;if(this.html.video.available)this.htmlElement.video.muted=a},_flash_setAudio:function(a){var b=this;try{c.each(this.formats,function(f,e){if(b.flash.support[e]&&a[e]){switch(e){case "m4a":b._getMovie().fl_setAudio_m4a(a[e]);break;case "mp3":b._getMovie().fl_setAudio_mp3(a[e])}b.status.src=a[e];b.status.format[e]=true;b.status.formatType=e;return false}});
if(this.options.preload==="auto"){this._flash_load();this.status.waitForLoad=false}}catch(d){this._flashError(d)}},_flash_setVideo:function(a){var b=this;try{c.each(this.formats,function(f,e){if(b.flash.support[e]&&a[e]){switch(e){case "m4v":b._getMovie().fl_setVideo_m4v(a[e])}b.status.src=a[e];b.status.format[e]=true;b.status.formatType=e;return false}});if(this.options.preload==="auto"){this._flash_load();this.status.waitForLoad=false}}catch(d){this._flashError(d)}},_flash_clearMedia:function(){this.internal.flash.jq.css({width:"0px",
height:"0px"});try{this._getMovie().fl_clearMedia()}catch(a){this._flashError(a)}},_flash_load:function(){try{this._getMovie().fl_load()}catch(a){this._flashError(a)}this.status.waitForLoad=false},_flash_play:function(a){try{this._getMovie().fl_play(a)}catch(b){this._flashError(b)}this.status.waitForLoad=false;this._flash_checkWaitForPlay()},_flash_pause:function(a){try{this._getMovie().fl_pause(a)}catch(b){this._flashError(b)}if(a>0){this.status.waitForLoad=false;this._flash_checkWaitForPlay()}},
_flash_playHead:function(a){try{this._getMovie().fl_play_head(a)}catch(b){this._flashError(b)}this.status.waitForLoad||this._flash_checkWaitForPlay()},_flash_checkWaitForPlay:function(){if(this.status.waitForPlay){this.status.waitForPlay=false;this.css.jq.videoPlay.length&&this.css.jq.videoPlay.hide();if(this.status.video){this.internal.poster.jq.hide();this.internal.flash.jq.css({width:this.status.width,height:this.status.height})}}},_flash_volume:function(a){try{this._getMovie().fl_volume(a)}catch(b){this._flashError(b)}},
_flash_mute:function(a){try{this._getMovie().fl_mute(a)}catch(b){this._flashError(b)}},_getMovie:function(){return document[this.internal.flash.id]},_checkForFlash:function(a){var b=false,d;if(window.ActiveXObject)try{new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+a);b=true}catch(f){}else if(navigator.plugins&&navigator.mimeTypes.length>0)if(d=navigator.plugins["Shockwave Flash"])if(navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/,"$1")>=a)b=true;return c.browser.msie&&
Number(c.browser.version)>=9?false:b},_validString:function(a){return a&&typeof a==="string"},_limitValue:function(a,b,d){return a<b?b:a>d?d:a},_urlNotSetError:function(a){this._error({type:c.jPlayer.error.URL_NOT_SET,context:a,message:c.jPlayer.errorMsg.URL_NOT_SET,hint:c.jPlayer.errorHint.URL_NOT_SET})},_flashError:function(a){this._error({type:c.jPlayer.error.FLASH,context:this.internal.flash.swf,message:c.jPlayer.errorMsg.FLASH+a.message,hint:c.jPlayer.errorHint.FLASH})},_error:function(a){this._trigger(c.jPlayer.event.error,
a);if(this.options.errorAlerts)this._alert("Error!"+(a.message?"\n\n"+a.message:"")+(a.hint?"\n\n"+a.hint:"")+"\n\nContext: "+a.context)},_warning:function(a){this._trigger(c.jPlayer.event.warning,h,a);if(this.options.errorAlerts)this._alert("Warning!"+(a.message?"\n\n"+a.message:"")+(a.hint?"\n\n"+a.hint:"")+"\n\nContext: "+a.context)},_alert:function(a){alert("jPlayer "+this.version.script+" : id='"+this.internal.self.id+"' : "+a)}};c.jPlayer.error={FLASH:"e_flash",NO_SOLUTION:"e_no_solution",NO_SUPPORT:"e_no_support",
URL:"e_url",URL_NOT_SET:"e_url_not_set",VERSION:"e_version"};c.jPlayer.errorMsg={FLASH:"jPlayer's Flash fallback is not configured correctly, or a command was issued before the jPlayer Ready event. Details: ",NO_SOLUTION:"No solution can be found by jPlayer in this browser. Neither HTML nor Flash can be used.",NO_SUPPORT:"It is not possible to play any media format provided in setMedia() on this browser using your current options.",URL:"Media URL could not be loaded.",URL_NOT_SET:"Attempt to issue media playback commands, while no media url is set.",
VERSION:"jPlayer "+c.jPlayer.prototype.version.script+" needs Jplayer.swf version "+c.jPlayer.prototype.version.needFlash+" but found "};c.jPlayer.errorHint={FLASH:"Check your swfPath option and that Jplayer.swf is there.",NO_SOLUTION:"Review the jPlayer options: support and supplied.",NO_SUPPORT:"Video or audio formats defined in the supplied option are missing.",URL:"Check media URL is valid.",URL_NOT_SET:"Use setMedia() to set the media URL.",VERSION:"Update jPlayer files."};c.jPlayer.warning=
{CSS_SELECTOR_COUNT:"e_css_selector_count",CSS_SELECTOR_METHOD:"e_css_selector_method",CSS_SELECTOR_STRING:"e_css_selector_string",OPTION_KEY:"e_option_key"};c.jPlayer.warningMsg={CSS_SELECTOR_COUNT:"The number of methodCssSelectors found did not equal one: ",CSS_SELECTOR_METHOD:"The methodName given in jPlayer('cssSelector') is not a valid jPlayer method.",CSS_SELECTOR_STRING:"The methodCssSelector given in jPlayer('cssSelector') is not a String or is empty.",OPTION_KEY:"The option requested in jPlayer('option') is undefined."};
c.jPlayer.warningHint={CSS_SELECTOR_COUNT:"Check your css selector and the ancestor.",CSS_SELECTOR_METHOD:"Check your method name.",CSS_SELECTOR_STRING:"Check your css selector is a string.",OPTION_KEY:"Check your option name."}})(jQuery);

/*!
* jScrollPane - v2.0.0beta11 - 2011-07-04
* http://jscrollpane.kelvinluck.com/
*
* Copyright (c) 2010 Kelvin Luck
* Dual licensed under the MIT and GPL licenses.
*/

// Script: jScrollPane - cross browser customisable scrollbars
//
// *Version: 2.0.0beta11, Last updated: 2011-07-04*
//
// Project Home - http://jscrollpane.kelvinluck.com/
// GitHub - http://github.com/vitch/jScrollPane
// Source - http://github.com/vitch/jScrollPane/raw/master/script/jquery.jscrollpane.js
// (Minified) - http://github.com/vitch/jScrollPane/raw/master/script/jquery.jscrollpane.min.js
//
// About: License
//
// Copyright (c) 2011 Kelvin Luck
// Dual licensed under the MIT or GPL Version 2 licenses.
// http://jscrollpane.kelvinluck.com/MIT-LICENSE.txt
// http://jscrollpane.kelvinluck.com/GPL-LICENSE.txt
//
// About: Examples
//
// All examples and demos are available through the jScrollPane example site at:
// http://jscrollpane.kelvinluck.com/
//
// About: Support and Testing
//
// This plugin is tested on the browsers below and has been found to work reliably on them. If you run
// into a problem on one of the supported browsers then please visit the support section on the jScrollPane
// website (http://jscrollpane.kelvinluck.com/) for more information on getting support. You are also
// welcome to fork the project on GitHub if you can contribute a fix for a given issue.
//
// jQuery Versions - tested in 1.4.2+ - reported to work in 1.3.x
// Browsers Tested - Firefox 3.6.8, Safari 5, Opera 10.6, Chrome 5.0, IE 6, 7, 8
//
// About: Release History
//
// 2.0.0beta11 - (in progress)
// 2.0.0beta10 - (2011-04-17) cleaner required size calculation, improved keyboard support, stickToBottom/Left, other small fixes
// 2.0.0beta9 - (2011-01-31) new API methods, bug fixes and correct keyboard support for FF/OSX
// 2.0.0beta8 - (2011-01-29) touchscreen support, improved keyboard support
// 2.0.0beta7 - (2011-01-23) scroll speed consistent (thanks Aivo Paas)
// 2.0.0beta6 - (2010-12-07) scrollToElement horizontal support
// 2.0.0beta5 - (2010-10-18) jQuery 1.4.3 support, various bug fixes
// 2.0.0beta4 - (2010-09-17) clickOnTrack support, bug fixes
// 2.0.0beta3 - (2010-08-27) Horizontal mousewheel, mwheelIntent, keyboard support, bug fixes
// 2.0.0beta2 - (2010-08-21) Bug fixes
// 2.0.0beta1 - (2010-08-17) Rewrite to follow modern best practices and enable horizontal scrolling, initially hidden
// elements and dynamically sized elements.
// 1.x - (2006-12-31 - 2010-07-31) Initial version, hosted at googlecode, deprecated

(function($,window,undefined){

    $.fn.jScrollPane = function(settings)
    {
        // JScrollPane "class" - public methods are available through $('selector').data('jsp')
        function JScrollPane(elem, s)
        {
            var settings, jsp = this, pane, paneWidth, paneHeight, container, contentWidth, contentHeight,
            percentInViewH, percentInViewV, isScrollableV, isScrollableH, verticalDrag, dragMaxY,
            verticalDragPosition, horizontalDrag, dragMaxX, horizontalDragPosition,
            verticalBar, verticalTrack, scrollbarWidth, verticalTrackHeight, verticalDragHeight, arrowUp, arrowDown,
            horizontalBar, horizontalTrack, horizontalTrackWidth, horizontalDragWidth, arrowLeft, arrowRight,
            reinitialiseInterval, originalPadding, originalPaddingTotalWidth, previousContentWidth,
            wasAtTop = true, wasAtLeft = true, wasAtBottom = false, wasAtRight = false,
            originalElement = elem.clone(false, false).empty(),
            mwEvent = $.fn.mwheelIntent ? 'mwheelIntent.jsp' : 'mousewheel.jsp';

            originalPadding = elem.css('paddingTop') + ' ' +
            elem.css('paddingRight') + ' ' +
            elem.css('paddingBottom') + ' ' +
            elem.css('paddingLeft');
            originalPaddingTotalWidth = (parseInt(elem.css('paddingLeft'), 10) || 0) +
            (parseInt(elem.css('paddingRight'), 10) || 0);

            function initialise(s)
            {

                var /*firstChild, lastChild, */isMaintainingPositon, lastContentX, lastContentY,
                hasContainingSpaceChanged, originalScrollTop, originalScrollLeft,
                maintainAtBottom = false, maintainAtRight = false;

                settings = s;

                if (pane === undefined) {
                    originalScrollTop = elem.scrollTop();
                    originalScrollLeft = elem.scrollLeft();

                    elem.css(
                    {
                        overflow: 'hidden',
                        padding: 0
                    }
                    );
                    // TODO: Deal with where width/ height is 0 as it probably means the element is hidden and we should
                    // come back to it later and check once it is unhidden...
                    paneWidth = elem.innerWidth() + originalPaddingTotalWidth;
                    paneHeight = elem.innerHeight();

                    elem.width(paneWidth);

                    pane = $('<div class="jspPane" />').css('padding', originalPadding).append(elem.children());
                    container = $('<div class="jspContainer" />')
                    .css({
                        'width': paneWidth + 'px',
                        'height': paneHeight + 'px'
                    }
                    ).append(pane).appendTo(elem);

                /*
// Move any margins from the first and last children up to the container so they can still
// collapse with neighbouring elements as they would before jScrollPane
firstChild = pane.find(':first-child');
lastChild = pane.find(':last-child');
elem.css(
{
'margin-top': firstChild.css('margin-top'),
'margin-bottom': lastChild.css('margin-bottom')
}
);
firstChild.css('margin-top', 0);
lastChild.css('margin-bottom', 0);
*/
                } else {
                    elem.css('width', '');

                    maintainAtBottom = settings.stickToBottom && isCloseToBottom();
                    maintainAtRight = settings.stickToRight && isCloseToRight();

                    hasContainingSpaceChanged = elem.innerWidth() + originalPaddingTotalWidth != paneWidth || elem.outerHeight() != paneHeight;

                    if (hasContainingSpaceChanged) {
                        paneWidth = elem.innerWidth() + originalPaddingTotalWidth;
                        paneHeight = elem.innerHeight();
                        container.css({
                            width: paneWidth + 'px',
                            height: paneHeight + 'px'
                        });
                    }

                    // If nothing changed since last check...
                    if (!hasContainingSpaceChanged && previousContentWidth == contentWidth && pane.outerHeight() == contentHeight) {
                        elem.width(paneWidth);
                        return;
                    }
                    previousContentWidth = contentWidth;

                    pane.css('width', '');
                    elem.width(paneWidth);

                    container.find('>.jspVerticalBar,>.jspHorizontalBar').remove().end();
                }

                pane.css('overflow', 'auto');
                if (s.contentWidth) {
                    contentWidth = s.contentWidth;
                } else {
                    contentWidth = pane[0].scrollWidth;
                }
                contentHeight = pane[0].scrollHeight;
                pane.css('overflow', '');

                percentInViewH = contentWidth / paneWidth;
                percentInViewV = contentHeight / paneHeight;
                isScrollableV = percentInViewV > 1;

                isScrollableH = percentInViewH > 1;

                //console.log(paneWidth, paneHeight, contentWidth, contentHeight, percentInViewH, percentInViewV, isScrollableH, isScrollableV);

                if (!(isScrollableH || isScrollableV)) {
                    elem.removeClass('jspScrollable');
                    pane.css({
                        top: 0,
                        width: container.width() - originalPaddingTotalWidth
                    });
                    removeMousewheel();
                    removeFocusHandler();
                    removeKeyboardNav();
                    removeClickOnTrack();
                    unhijackInternalLinks();
                } else {
                    elem.addClass('jspScrollable');

                    isMaintainingPositon = settings.maintainPosition && (verticalDragPosition || horizontalDragPosition);
                    if (isMaintainingPositon) {
                        lastContentX = contentPositionX();
                        lastContentY = contentPositionY();
                    }

                    initialiseVerticalScroll();
                    initialiseHorizontalScroll();
                    resizeScrollbars();

                    if (isMaintainingPositon) {
                        scrollToX(maintainAtRight ? (contentWidth - paneWidth ) : lastContentX, false);
                        scrollToY(maintainAtBottom ? (contentHeight - paneHeight) : lastContentY, false);
                    }

                    initFocusHandler();
                    initMousewheel();
                    initScrollTouch();

                    if (settings.enableKeyboardNavigation) {
                        initKeyboardNav();
                    }
                    if (settings.clickOnTrack) {
                        initClickOnTrack();
                    }

                    observeHash();
                    if (settings.hijackInternalLinks) {
                        hijackInternalLinks();
                    }
                }

                if (settings.autoReinitialise && !reinitialiseInterval) {
                    reinitialiseInterval = setInterval(
                        function()
                        {
                            initialise(settings);
                        },
                        settings.autoReinitialiseDelay
                        );
                } else if (!settings.autoReinitialise && reinitialiseInterval) {
                    clearInterval(reinitialiseInterval);
                }

                originalScrollTop && elem.scrollTop(0) && scrollToY(originalScrollTop, false);
                originalScrollLeft && elem.scrollLeft(0) && scrollToX(originalScrollLeft, false);

                elem.trigger('jsp-initialised', [isScrollableH || isScrollableV]);
            }

            function initialiseVerticalScroll()
            {
                if (isScrollableV) {

                    container.append(
                        $('<div class="jspVerticalBar" />').append(
                            $('<div class="jspCap jspCapTop" />'),
                            $('<div class="jspTrack" />').append(
                                $('<div class="jspDrag" />').append(
                                    $('<div class="jspDragTop" />'),
                                    $('<div class="jspDragBottom" />')
                                    )
                                ),
                            $('<div class="jspCap jspCapBottom" />')
                            )
                        );

                    verticalBar = container.find('>.jspVerticalBar');
                    verticalTrack = verticalBar.find('>.jspTrack');
                    verticalDrag = verticalTrack.find('>.jspDrag');

                    if (settings.showArrows) {
                        arrowUp = $('<a class="jspArrow jspArrowUp" />').bind(
                            'mousedown.jsp', getArrowScroll(0, -1)
                            ).bind('click.jsp', nil);
                        arrowDown = $('<a class="jspArrow jspArrowDown" />').bind(
                            'mousedown.jsp', getArrowScroll(0, 1)
                            ).bind('click.jsp', nil);
                        if (settings.arrowScrollOnHover) {
                            arrowUp.bind('mouseover.jsp', getArrowScroll(0, -1, arrowUp));
                            arrowDown.bind('mouseover.jsp', getArrowScroll(0, 1, arrowDown));
                        }

                        appendArrows(verticalTrack, settings.verticalArrowPositions, arrowUp, arrowDown);
                    }

                    verticalTrackHeight = paneHeight;
                    container.find('>.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow').each(
                        function()
                        {
                            verticalTrackHeight -= $(this).outerHeight();
                        }
                        );


                    verticalDrag.hover(
                        function()
                        {
                            verticalDrag.addClass('jspHover');
                        },
                        function()
                        {
                            verticalDrag.removeClass('jspHover');
                        }
                        ).bind(
                        'mousedown.jsp',
                        function(e)
                        {
                            // Stop IE from allowing text selection
                            $('html').bind('dragstart.jsp selectstart.jsp', nil);

                            verticalDrag.addClass('jspActive');

                            var startY = e.pageY - verticalDrag.position().top;

                            $('html').bind(
                                'mousemove.jsp',
                                function(e)
                                {
                                    positionDragY(e.pageY - startY, false);
                                }
                                ).bind('mouseup.jsp mouseleave.jsp', cancelDrag);
                            return false;
                        }
                        );
                    sizeVerticalScrollbar();
                }
            }

            function sizeVerticalScrollbar()
            {
                verticalTrack.height(verticalTrackHeight + 'px');
                verticalDragPosition = 0;
                scrollbarWidth = settings.verticalGutter + verticalTrack.outerWidth();

                // Make the pane thinner to allow for the vertical scrollbar
                pane.width(paneWidth - scrollbarWidth - originalPaddingTotalWidth);

                // Add margin to the left of the pane if scrollbars are on that side (to position
                // the scrollbar on the left or right set it's left or right property in CSS)
                try {
                    if (verticalBar.position().left === 0) {
                        pane.css('margin-left', scrollbarWidth + 'px');
                    }
                } catch (err) {
                }
            }

            function initialiseHorizontalScroll()
            {
                if (isScrollableH) {

                    container.append(
                        $('<div class="jspHorizontalBar" />').append(
                            $('<div class="jspCap jspCapLeft" />'),
                            $('<div class="jspTrack" />').append(
                                $('<div class="jspDrag" />').append(
                                    $('<div class="jspDragLeft" />'),
                                    $('<div class="jspDragRight" />')
                                    )
                                ),
                            $('<div class="jspCap jspCapRight" />')
                            )
                        );

                    horizontalBar = container.find('>.jspHorizontalBar');
                    horizontalTrack = horizontalBar.find('>.jspTrack');
                    horizontalDrag = horizontalTrack.find('>.jspDrag');

                    if (settings.showArrows) {
                        arrowLeft = $('<a class="jspArrow jspArrowLeft" />').bind(
                            'mousedown.jsp', getArrowScroll(-1, 0)
                            ).bind('click.jsp', nil);
                        arrowRight = $('<a class="jspArrow jspArrowRight" />').bind(
                            'mousedown.jsp', getArrowScroll(1, 0)
                            ).bind('click.jsp', nil);
                        if (settings.arrowScrollOnHover) {
                            arrowLeft.bind('mouseover.jsp', getArrowScroll(-1, 0, arrowLeft));
                            arrowRight.bind('mouseover.jsp', getArrowScroll(1, 0, arrowRight));
                        }
                        appendArrows(horizontalTrack, settings.horizontalArrowPositions, arrowLeft, arrowRight);
                    }

                    horizontalDrag.hover(
                        function()
                        {
                            horizontalDrag.addClass('jspHover');
                        },
                        function()
                        {
                            horizontalDrag.removeClass('jspHover');
                        }
                        ).bind(
                        'mousedown.jsp',
                        function(e)
                        {
                            // Stop IE from allowing text selection
                            $('html').bind('dragstart.jsp selectstart.jsp', nil);

                            horizontalDrag.addClass('jspActive');

                            var startX = e.pageX - horizontalDrag.position().left;

                            $('html').bind(
                                'mousemove.jsp',
                                function(e)
                                {
                                    positionDragX(e.pageX - startX, false);
                                }
                                ).bind('mouseup.jsp mouseleave.jsp', cancelDrag);
                            return false;
                        }
                        );
                    horizontalTrackWidth = container.innerWidth();
                    sizeHorizontalScrollbar();
                }
            }

            function sizeHorizontalScrollbar()
            {
                container.find('>.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow').each(
                    function()
                    {
                        horizontalTrackWidth -= $(this).outerWidth();
                    }
                    );

                horizontalTrack.width(horizontalTrackWidth + 'px');
                horizontalDragPosition = 0;
            }

            function resizeScrollbars()
            {
                if (isScrollableH && isScrollableV) {
                    var horizontalTrackHeight = horizontalTrack.outerHeight(),
                    verticalTrackWidth = verticalTrack.outerWidth();
                    verticalTrackHeight -= horizontalTrackHeight;
                    $(horizontalBar).find('>.jspCap:visible,>.jspArrow').each(
                        function()
                        {
                            horizontalTrackWidth += $(this).outerWidth();
                        }
                        );
                    horizontalTrackWidth -= verticalTrackWidth;
                    paneHeight -= verticalTrackWidth;
                    paneWidth -= horizontalTrackHeight;
                    horizontalTrack.parent().append(
                        $('<div class="jspCorner" />').css('width', horizontalTrackHeight + 'px')
                        );
                    sizeVerticalScrollbar();
                    sizeHorizontalScrollbar();
                }
                // reflow content
                if (isScrollableH) {
                    pane.width((container.outerWidth() - originalPaddingTotalWidth) + 'px');
                }
                contentHeight = pane.outerHeight();
                percentInViewV = contentHeight / paneHeight;

                if (isScrollableH) {
                    horizontalDragWidth = Math.ceil(1 / percentInViewH * horizontalTrackWidth);
                    if (horizontalDragWidth > settings.horizontalDragMaxWidth) {
                        horizontalDragWidth = settings.horizontalDragMaxWidth;
                    } else if (horizontalDragWidth < settings.horizontalDragMinWidth) {
                        horizontalDragWidth = settings.horizontalDragMinWidth;
                    }
                    horizontalDrag.width(horizontalDragWidth + 'px');
                    dragMaxX = horizontalTrackWidth - horizontalDragWidth;
                    _positionDragX(horizontalDragPosition); // To update the state for the arrow buttons
                }
                if (isScrollableV) {
                    verticalDragHeight = Math.ceil(1 / percentInViewV * verticalTrackHeight);
                    if (verticalDragHeight > settings.verticalDragMaxHeight) {
                        verticalDragHeight = settings.verticalDragMaxHeight;
                    } else if (verticalDragHeight < settings.verticalDragMinHeight) {
                        verticalDragHeight = settings.verticalDragMinHeight;
                    }
                    verticalDrag.height(verticalDragHeight + 'px');
                    dragMaxY = verticalTrackHeight - verticalDragHeight;
                    _positionDragY(verticalDragPosition); // To update the state for the arrow buttons
                }
            }

            function appendArrows(ele, p, a1, a2)
            {
                var p1 = "before", p2 = "after", aTemp;

                // Sniff for mac... Is there a better way to determine whether the arrows would naturally appear
                // at the top or the bottom of the bar?
                if (p == "os") {
                    p = /Mac/.test(navigator.platform) ? "after" : "split";
                }
                if (p == p1) {
                    p2 = p;
                } else if (p == p2) {
                    p1 = p;
                    aTemp = a1;
                    a1 = a2;
                    a2 = aTemp;
                }

                ele[p1](a1)[p2](a2);
            }

            function getArrowScroll(dirX, dirY, ele)
            {
                return function()
                {
                    arrowScroll(dirX, dirY, this, ele);
                    this.blur();
                    return false;
                };
            }

            function arrowScroll(dirX, dirY, arrow, ele)
            {
                arrow = $(arrow).addClass('jspActive');

                var eve,
                scrollTimeout,
                isFirst = true,
                doScroll = function()
                {
                    if (dirX !== 0) {
                        jsp.scrollByX(dirX * settings.arrowButtonSpeed);
                    }
                    if (dirY !== 0) {
                        jsp.scrollByY(dirY * settings.arrowButtonSpeed);
                    }
                    scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.arrowRepeatFreq);
                    isFirst = false;
                };

                doScroll();

                eve = ele ? 'mouseout.jsp' : 'mouseup.jsp';
                ele = ele || $('html');
                ele.bind(
                    eve,
                    function()
                    {
                        arrow.removeClass('jspActive');
                        scrollTimeout && clearTimeout(scrollTimeout);
                        scrollTimeout = null;
                        ele.unbind(eve);
                    }
                    );
            }

            function initClickOnTrack()
            {
                removeClickOnTrack();
                if (isScrollableV) {
                    verticalTrack.bind(
                        'mousedown.jsp',
                        function(e)
                        {
                            if (e.originalTarget === undefined || e.originalTarget == e.currentTarget) {
                                var clickedTrack = $(this),
                                offset = clickedTrack.offset(),
                                direction = e.pageY - offset.top - verticalDragPosition,
                                scrollTimeout,
                                isFirst = true,
                                doScroll = function()
                                {
                                    var offset = clickedTrack.offset(),
                                    pos = e.pageY - offset.top - verticalDragHeight / 2,
                                    contentDragY = paneHeight * settings.scrollPagePercent,
                                    dragY = dragMaxY * contentDragY / (contentHeight - paneHeight);
                                    if (direction < 0) {
                                        if (verticalDragPosition - dragY > pos) {
                                            jsp.scrollByY(-contentDragY);
                                        } else {
                                            positionDragY(pos);
                                        }
                                    } else if (direction > 0) {
                                        if (verticalDragPosition + dragY < pos) {
                                            jsp.scrollByY(contentDragY);
                                        } else {
                                            positionDragY(pos);
                                        }
                                    } else {
                                        cancelClick();
                                        return;
                                    }
                                    scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.trackClickRepeatFreq);
                                    isFirst = false;
                                },
                                cancelClick = function()
                                {
                                    scrollTimeout && clearTimeout(scrollTimeout);
                                    scrollTimeout = null;
                                    $(document).unbind('mouseup.jsp', cancelClick);
                                };
                                doScroll();
                                $(document).bind('mouseup.jsp', cancelClick);
                                return false;
                            }
                        }
                        );
                }

                if (isScrollableH) {
                    horizontalTrack.bind(
                        'mousedown.jsp',
                        function(e)
                        {
                            if (e.originalTarget === undefined || e.originalTarget == e.currentTarget) {
                                var clickedTrack = $(this),
                                offset = clickedTrack.offset(),
                                direction = e.pageX - offset.left - horizontalDragPosition,
                                scrollTimeout,
                                isFirst = true,
                                doScroll = function()
                                {
                                    var offset = clickedTrack.offset(),
                                    pos = e.pageX - offset.left - horizontalDragWidth / 2,
                                    contentDragX = paneWidth * settings.scrollPagePercent,
                                    dragX = dragMaxX * contentDragX / (contentWidth - paneWidth);
                                    if (direction < 0) {
                                        if (horizontalDragPosition - dragX > pos) {
                                            jsp.scrollByX(-contentDragX);
                                        } else {
                                            positionDragX(pos);
                                        }
                                    } else if (direction > 0) {
                                        if (horizontalDragPosition + dragX < pos) {
                                            jsp.scrollByX(contentDragX);
                                        } else {
                                            positionDragX(pos);
                                        }
                                    } else {
                                        cancelClick();
                                        return;
                                    }
                                    scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.trackClickRepeatFreq);
                                    isFirst = false;
                                },
                                cancelClick = function()
                                {
                                    scrollTimeout && clearTimeout(scrollTimeout);
                                    scrollTimeout = null;
                                    $(document).unbind('mouseup.jsp', cancelClick);
                                };
                                doScroll();
                                $(document).bind('mouseup.jsp', cancelClick);
                                return false;
                            }
                        }
                        );
                }
            }

            function removeClickOnTrack()
            {
                if (horizontalTrack) {
                    horizontalTrack.unbind('mousedown.jsp');
                }
                if (verticalTrack) {
                    verticalTrack.unbind('mousedown.jsp');
                }
            }

            function cancelDrag()
            {
                $('html').unbind('dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp');

                if (verticalDrag) {
                    verticalDrag.removeClass('jspActive');
                }
                if (horizontalDrag) {
                    horizontalDrag.removeClass('jspActive');
                }
            }

            function positionDragY(destY, animate)
            {
                if (!isScrollableV) {
                    return;
                }
                if (destY < 0) {
                    destY = 0;
                } else if (destY > dragMaxY) {
                    destY = dragMaxY;
                }

                // can't just check if(animate) because false is a valid value that could be passed in...
                if (animate === undefined) {
                    animate = settings.animateScroll;
                }
                if (animate) {
                    jsp.animate(verticalDrag, 'top', destY, _positionDragY);
                } else {
                    verticalDrag.css('top', destY);
                    _positionDragY(destY);
                }

            }

            function _positionDragY(destY)
            {
                if (destY === undefined) {
                    destY = verticalDrag.position().top;
                }

                container.scrollTop(0);
                verticalDragPosition = destY;

                var isAtTop = verticalDragPosition === 0,
                isAtBottom = verticalDragPosition == dragMaxY,
                percentScrolled = destY/ dragMaxY,
                destTop = -percentScrolled * (contentHeight - paneHeight);

                if (wasAtTop != isAtTop || wasAtBottom != isAtBottom) {
                    wasAtTop = isAtTop;
                    wasAtBottom = isAtBottom;
                    elem.trigger('jsp-arrow-change', [wasAtTop, wasAtBottom, wasAtLeft, wasAtRight]);
                }

                updateVerticalArrows(isAtTop, isAtBottom);
                pane.css('top', destTop);
                elem.trigger('jsp-scroll-y', [-destTop, isAtTop, isAtBottom]).trigger('scroll');
            }

            function positionDragX(destX, animate)
            {
                if (!isScrollableH) {
                    return;
                }
                if (destX < 0) {
                    destX = 0;
                } else if (destX > dragMaxX) {
                    destX = dragMaxX;
                }

                if (animate === undefined) {
                    animate = settings.animateScroll;
                }
                if (animate) {
                    jsp.animate(horizontalDrag, 'left', destX, _positionDragX);
                } else {
                    horizontalDrag.css('left', destX);
                    _positionDragX(destX);
                }
            }

            function _positionDragX(destX)
            {
                if (destX === undefined) {
                    destX = horizontalDrag.position().left;
                }

                container.scrollTop(0);
                horizontalDragPosition = destX;

                var isAtLeft = horizontalDragPosition === 0,
                isAtRight = horizontalDragPosition == dragMaxX,
                percentScrolled = destX / dragMaxX,
                destLeft = -percentScrolled * (contentWidth - paneWidth);

                if (wasAtLeft != isAtLeft || wasAtRight != isAtRight) {
                    wasAtLeft = isAtLeft;
                    wasAtRight = isAtRight;
                    elem.trigger('jsp-arrow-change', [wasAtTop, wasAtBottom, wasAtLeft, wasAtRight]);
                }

                updateHorizontalArrows(isAtLeft, isAtRight);
                pane.css('left', destLeft);
                elem.trigger('jsp-scroll-x', [-destLeft, isAtLeft, isAtRight]).trigger('scroll');
            }

            function updateVerticalArrows(isAtTop, isAtBottom)
            {
                if (settings.showArrows) {
                    arrowUp[isAtTop ? 'addClass' : 'removeClass']('jspDisabled');
                    arrowDown[isAtBottom ? 'addClass' : 'removeClass']('jspDisabled');
                }
            }

            function updateHorizontalArrows(isAtLeft, isAtRight)
            {
                if (settings.showArrows) {
                    arrowLeft[isAtLeft ? 'addClass' : 'removeClass']('jspDisabled');
                    arrowRight[isAtRight ? 'addClass' : 'removeClass']('jspDisabled');
                }
            }

            function scrollToY(destY, animate)
            {
                var percentScrolled = destY / (contentHeight - paneHeight);
                positionDragY(percentScrolled * dragMaxY, animate);
            }

            function scrollToX(destX, animate)
            {
                var percentScrolled = destX / (contentWidth - paneWidth);
                positionDragX(percentScrolled * dragMaxX, animate);
            }

            function scrollToElement(ele, stickToTop, animate)
            {
                var e, eleHeight, eleWidth, eleTop = 0, eleLeft = 0, viewportTop, viewportLeft, maxVisibleEleTop, maxVisibleEleLeft, destY, destX;

                // Legal hash values aren't necessarily legal jQuery selectors so we need to catch any
                // errors from the lookup...
                try {
                    e = $(ele);
                } catch (err) {
                    return;
                }
                eleHeight = e.outerHeight();
                eleWidth= e.outerWidth();

                container.scrollTop(0);
                container.scrollLeft(0);

                // loop through parents adding the offset top of any elements that are relatively positioned between
                // the focused element and the jspPane so we can get the true distance from the top
                // of the focused element to the top of the scrollpane...
                while (!e.is('.jspPane')) {
                    eleTop += e.position().top;
                    eleLeft += e.position().left;
                    e = e.offsetParent();
                    if (/^body|html$/i.test(e[0].nodeName)) {
                        // we ended up too high in the document structure. Quit!
                        return;
                    }
                }

                viewportTop = contentPositionY();
                maxVisibleEleTop = viewportTop + paneHeight;
                if (eleTop < viewportTop || stickToTop) { // element is above viewport
                    destY = eleTop - settings.verticalGutter;
                } else if (eleTop + eleHeight > maxVisibleEleTop) { // element is below viewport
                    destY = eleTop - paneHeight + eleHeight + settings.verticalGutter;
                }
                if (destY) {
                    scrollToY(destY, animate);
                }

                viewportLeft = contentPositionX();
                maxVisibleEleLeft = viewportLeft + paneWidth;
                if (eleLeft < viewportLeft || stickToTop) { // element is to the left of viewport
                    destX = eleLeft - settings.horizontalGutter;
                } else if (eleLeft + eleWidth > maxVisibleEleLeft) { // element is to the right viewport
                    destX = eleLeft - paneWidth + eleWidth + settings.horizontalGutter;
                }
                if (destX) {
                    scrollToX(destX, animate);
                }

            }

            function contentPositionX()
            {
                return -pane.position().left;
            }

            function contentPositionY()
            {
                return -pane.position().top;
            }

            function isCloseToBottom()
            {
                var scrollableHeight = contentHeight - paneHeight;
                return (scrollableHeight > 20) && (scrollableHeight - contentPositionY() < 10);
            }

            function isCloseToRight()
            {
                var scrollableWidth = contentWidth - paneWidth;
                return (scrollableWidth > 20) && (scrollableWidth - contentPositionX() < 10);
            }

            function initMousewheel()
            {
                container.unbind(mwEvent).bind(
                    mwEvent,
                    function (event, delta, deltaX, deltaY) {
                        var dX = horizontalDragPosition, dY = verticalDragPosition;
                        jsp.scrollBy(deltaX * settings.mouseWheelSpeed, -deltaY * settings.mouseWheelSpeed, false);
                        // return true if there was no movement so rest of screen can scroll
                        return dX == horizontalDragPosition && dY == verticalDragPosition;
                    }
                    );
            }

            function removeMousewheel()
            {
                container.unbind(mwEvent);
            }

            function nil()
            {
                return false;
            }

            function initFocusHandler()
            {
                pane.find(':input,a').unbind('focus.jsp').bind(
                    'focus.jsp',
                    function(e)
                    {
                        scrollToElement(e.target, false);
                    }
                    );
            }

            function removeFocusHandler()
            {
                pane.find(':input,a').unbind('focus.jsp');
            }

            function initKeyboardNav()
            {
                var keyDown, elementHasScrolled, validParents = [];
                isScrollableH && validParents.push(horizontalBar[0]);
                isScrollableV && validParents.push(verticalBar[0]);

                // IE also focuses elements that don't have tabindex set.
                pane.focus(
                    function()
                    {
                        elem.focus();
                    }
                    );

                elem.attr('tabindex', 0)
                .unbind('keydown.jsp keypress.jsp')
                .bind(
                    'keydown.jsp',
                    function(e)
                    {
                        if (e.target !== this && !(validParents.length && $(e.target).closest(validParents).length)){
                            return;
                        }
                        var dX = horizontalDragPosition, dY = verticalDragPosition;
                        switch(e.keyCode) {
                            case 40: // down
                            case 38: // up
                            case 34: // page down
                            case 32: // space
                            case 33: // page up
                            case 39: // right
                            case 37: // left
                                keyDown = e.keyCode;
                                keyDownHandler();
                                break;
                            case 35: // end
                                scrollToY(contentHeight - paneHeight);
                                keyDown = null;
                                break;
                            case 36: // home
                                scrollToY(0);
                                keyDown = null;
                                break;
                        }

                        elementHasScrolled = e.keyCode == keyDown && dX != horizontalDragPosition || dY != verticalDragPosition;
                        return !elementHasScrolled;
                    }
                    ).bind(
                    'keypress.jsp', // For FF/ OSX so that we can cancel the repeat key presses if the JSP scrolls...
                    function(e)
                    {
                        if (e.keyCode == keyDown) {
                            keyDownHandler();
                        }
                        return !elementHasScrolled;
                    }
                    );

                if (settings.hideFocus) {
                    elem.css('outline', 'none');
                    if ('hideFocus' in container[0]){
                        elem.attr('hideFocus', true);
                    }
                } else {
                    elem.css('outline', '');
                    if ('hideFocus' in container[0]){
                        elem.attr('hideFocus', false);
                    }
                }

                function keyDownHandler()
                {
                    var dX = horizontalDragPosition, dY = verticalDragPosition;
                    switch(keyDown) {
                        case 40: // down
                            jsp.scrollByY(settings.keyboardSpeed, false);
                            break;
                        case 38: // up
                            jsp.scrollByY(-settings.keyboardSpeed, false);
                            break;
                        case 34: // page down
                        case 32: // space
                            jsp.scrollByY(paneHeight * settings.scrollPagePercent, false);
                            break;
                        case 33: // page up
                            jsp.scrollByY(-paneHeight * settings.scrollPagePercent, false);
                            break;
                        case 39: // right
                            jsp.scrollByX(settings.keyboardSpeed, false);
                            break;
                        case 37: // left
                            jsp.scrollByX(-settings.keyboardSpeed, false);
                            break;
                    }

                    elementHasScrolled = dX != horizontalDragPosition || dY != verticalDragPosition;
                    return elementHasScrolled;
                }
            }

            function removeKeyboardNav()
            {
                elem.attr('tabindex', '-1')
                .removeAttr('tabindex')
                .unbind('keydown.jsp keypress.jsp');
            }

            function observeHash()
            {
                if (location.hash && location.hash.length > 1) {
                    var e,
                    retryInt,
                    hash = escape(location.hash) // hash must be escaped to prevent XSS
                    ;
                    try {
                        e = $(hash);
                    } catch (err) {
                        return;
                    }

                    if (e.length && pane.find(hash)) {
                        // nasty workaround but it appears to take a little while before the hash has done its thing
                        // to the rendered page so we just wait until the container's scrollTop has been messed up.
                        if (container.scrollTop() === 0) {
                            retryInt = setInterval(
                                function()
                                {
                                    if (container.scrollTop() > 0) {
                                        scrollToElement(hash, true);
                                        $(document).scrollTop(container.position().top);
                                        clearInterval(retryInt);
                                    }
                                },
                                50
                                );
                        } else {
                            scrollToElement(hash, true);
                            $(document).scrollTop(container.position().top);
                        }
                    }
                }
            }

            function unhijackInternalLinks()
            {
                $('a.jspHijack').unbind('click.jsp-hijack').removeClass('jspHijack');
            }

            function hijackInternalLinks()
            {
                unhijackInternalLinks();
                $('a[href^=#]').addClass('jspHijack').bind(
                    'click.jsp-hijack',
                    function()
                    {
                        var uriParts = this.href.split('#'), hash;
                        if (uriParts.length > 1) {
                            hash = uriParts[1];
                            if (hash.length > 0 && pane.find('#' + hash).length > 0) {
                                scrollToElement('#' + hash, true);
                                // Need to return false otherwise things mess up... Would be nice to maybe also scroll
                                // the window to the top of the scrollpane?
                                return false;
                            }
                        }
                    }
                    );
            }

            // Init touch on iPad, iPhone, iPod, Android
            function initScrollTouch()
            {
                var startX,
                startY,
                touchStartX,
                touchStartY,
                moved,
                moving = false;
  
                container.unbind('touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick').bind(
                    'touchstart.jsp',
                    function(e)
                    {
                        var touch = e.originalEvent.touches[0];
                        startX = contentPositionX();
                        startY = contentPositionY();
                        touchStartX = touch.pageX;
                        touchStartY = touch.pageY;
                        moved = false;
                        moving = true;
                    }
                    ).bind(
                    'touchmove.jsp',
                    function(ev)
                    {
                        if(!moving) {
                            return;
                        }

                        var touchPos = ev.originalEvent.touches[0],
                        dX = horizontalDragPosition, dY = verticalDragPosition;

                        jsp.scrollTo(startX + (touchPos.pageX - touchStartX), startY + (touchPos.pageY - touchStartY));

                        moved = moved || (touchPos.pageX - touchStartX > 0) || (touchPos.pageY - touchStartY > 0);

                        // return true if there was no movement so rest of screen can scroll
                        return dX == horizontalDragPosition && dY == verticalDragPosition;
                    }
                    ).bind(
                    'touchend.jsp',
                    function(e)
                    {
                        moving = false;
                    /*if(moved) {
return false;
}*/
                    }
                    ).bind(
                    'click.jsp-touchclick',
                    function(e)
                    {
                        if(moved) {
                            moved = false;
                            return false;
                        }
                    }
                    );
            }

            function destroy(){
                var currentY = contentPositionY(),
                currentX = contentPositionX();
                elem.removeClass('jspScrollable').unbind('.jsp');
                elem.replaceWith(originalElement.append(pane.children()));
                originalElement.scrollTop(currentY);
                originalElement.scrollLeft(currentX);
            }

            // Public API
            $.extend(
                jsp,
                {
                    // Reinitialises the scroll pane (if it's internal dimensions have changed since the last time it
                    // was initialised). The settings object which is passed in will override any settings from the
                    // previous time it was initialised - if you don't pass any settings then the ones from the previous
                    // initialisation will be used.
                    reinitialise: function(s)
                    {
                        s = $.extend({}, settings, s);
                        initialise(s);
                    },
                    // Scrolls the specified element (a jQuery object, DOM node or jQuery selector string) into view so
                    // that it can be seen within the viewport. If stickToTop is true then the element will appear at
                    // the top of the viewport, if it is false then the viewport will scroll as little as possible to
                    // show the element. You can also specify if you want animation to occur. If you don't provide this
                    // argument then the animateScroll value from the settings object is used instead.
                    scrollToElement: function(ele, stickToTop, animate)
                    {
                        scrollToElement(ele, stickToTop, animate);
                    },
                    // Scrolls the pane so that the specified co-ordinates within the content are at the top left
                    // of the viewport. animate is optional and if not passed then the value of animateScroll from
                    // the settings object this jScrollPane was initialised with is used.
                    scrollTo: function(destX, destY, animate)
                    {
                        scrollToX(destX, animate);
                        scrollToY(destY, animate);
                    },
                    // Scrolls the pane so that the specified co-ordinate within the content is at the left of the
                    // viewport. animate is optional and if not passed then the value of animateScroll from the settings
                    // object this jScrollPane was initialised with is used.
                    scrollToX: function(destX, animate)
                    {
                        scrollToX(destX, animate);
                    },
                    // Scrolls the pane so that the specified co-ordinate within the content is at the top of the
                    // viewport. animate is optional and if not passed then the value of animateScroll from the settings
                    // object this jScrollPane was initialised with is used.
                    scrollToY: function(destY, animate)
                    {
                        scrollToY(destY, animate);
                    },
                    // Scrolls the pane to the specified percentage of its maximum horizontal scroll position. animate
                    // is optional and if not passed then the value of animateScroll from the settings object this
                    // jScrollPane was initialised with is used.
                    scrollToPercentX: function(destPercentX, animate)
                    {
                        scrollToX(destPercentX * (contentWidth - paneWidth), animate);
                    },
                    // Scrolls the pane to the specified percentage of its maximum vertical scroll position. animate
                    // is optional and if not passed then the value of animateScroll from the settings object this
                    // jScrollPane was initialised with is used.
                    scrollToPercentY: function(destPercentY, animate)
                    {
                        scrollToY(destPercentY * (contentHeight - paneHeight), animate);
                    },
                    // Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
                    // the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollBy: function(deltaX, deltaY, animate)
                    {
                        jsp.scrollByX(deltaX, animate);
                        jsp.scrollByY(deltaY, animate);
                    },
                    // Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
                    // the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollByX: function(deltaX, animate)
                    {
                        var destX = contentPositionX() + Math[deltaX<0 ? 'floor' : 'ceil'](deltaX),
                        percentScrolled = destX / (contentWidth - paneWidth);
                        positionDragX(percentScrolled * dragMaxX, animate);
                    },
                    // Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
                    // the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollByY: function(deltaY, animate)
                    {
                        var destY = contentPositionY() + Math[deltaY<0 ? 'floor' : 'ceil'](deltaY),
                        percentScrolled = destY / (contentHeight - paneHeight);
                        positionDragY(percentScrolled * dragMaxY, animate);
                    },
                    // Positions the horizontal drag at the specified x position (and updates the viewport to reflect
                    // this). animate is optional and if not passed then the value of animateScroll from the settings
                    // object this jScrollPane was initialised with is used.
                    positionDragX: function(x, animate)
                    {
                        positionDragX(x, animate);
                    },
                    // Positions the vertical drag at the specified y position (and updates the viewport to reflect
                    // this). animate is optional and if not passed then the value of animateScroll from the settings
                    // object this jScrollPane was initialised with is used.
                    positionDragY: function(y, animate)
                    {
                        positionDragY(y, animate);
                    },
                    // This method is called when jScrollPane is trying to animate to a new position. You can override
                    // it if you want to provide advanced animation functionality. It is passed the following arguments:
                    // * ele - the element whose position is being animated
                    // * prop - the property that is being animated
                    // * value - the value it's being animated to
                    // * stepCallback - a function that you must execute each time you update the value of the property
                    // You can use the default implementation (below) as a starting point for your own implementation.
                    animate: function(ele, prop, value, stepCallback)
                    {
                        var params = {};
                        params[prop] = value;
                        ele.animate(
                            params,
                            {
                                'duration' : settings.animateDuration,
                                'easing' : settings.animateEase,
                                'queue' : false,
                                'step' : stepCallback
                            }
                            );
                    },
                    // Returns the current x position of the viewport with regards to the content pane.
                    getContentPositionX: function()
                    {
                        return contentPositionX();
                    },
                    // Returns the current y position of the viewport with regards to the content pane.
                    getContentPositionY: function()
                    {
                        return contentPositionY();
                    },
                    // Returns the width of the content within the scroll pane.
                    getContentWidth: function()
                    {
                        return contentWidth;
                    },
                    // Returns the height of the content within the scroll pane.
                    getContentHeight: function()
                    {
                        return contentHeight;
                    },
                    // Returns the horizontal position of the viewport within the pane content.
                    getPercentScrolledX: function()
                    {
                        return contentPositionX() / (contentWidth - paneWidth);
                    },
                    // Returns the vertical position of the viewport within the pane content.
                    getPercentScrolledY: function()
                    {
                        return contentPositionY() / (contentHeight - paneHeight);
                    },
                    // Returns whether or not this scrollpane has a horizontal scrollbar.
                    getIsScrollableH: function()
                    {
                        return isScrollableH;
                    },
                    // Returns whether or not this scrollpane has a vertical scrollbar.
                    getIsScrollableV: function()
                    {
                        return isScrollableV;
                    },
                    // Gets a reference to the content pane. It is important that you use this method if you want to
                    // edit the content of your jScrollPane as if you access the element directly then you may have some
                    // problems (as your original element has had additional elements for the scrollbars etc added into
                    // it).
                    getContentPane: function()
                    {
                        return pane;
                    },
                    // Scrolls this jScrollPane down as far as it can currently scroll. If animate isn't passed then the
                    // animateScroll value from settings is used instead.
                    scrollToBottom: function(animate)
                    {
                        positionDragY(dragMaxY, animate);
                    },
                    // Hijacks the links on the page which link to content inside the scrollpane. If you have changed
                    // the content of your page (e.g. via AJAX) and want to make sure any new anchor links to the
                    // contents of your scroll pane will work then call this function.
                    hijackInternalLinks: function()
                    {
                        hijackInternalLinks();
                    },
                    // Removes the jScrollPane and returns the page to the state it was in before jScrollPane was
                    // initialised.
                    destroy: function()
                    {
                        destroy();
                    }
                }
                );

            initialise(s);
        }

        // Pluginifying code...
        settings = $.extend({}, $.fn.jScrollPane.defaults, settings);

        // Apply default speed
        $.each(['mouseWheelSpeed', 'arrowButtonSpeed', 'trackClickSpeed', 'keyboardSpeed'], function() {
            settings[this] = settings[this] || settings.speed;
        });

        return this.each(
            function()
            {
                var elem = $(this), jspApi = elem.data('jsp');
                if (jspApi) {
                    jspApi.reinitialise(settings);
                } else {
                    jspApi = new JScrollPane(elem, settings);
                    elem.data('jsp', jspApi);
                }
            }
            );
    };

    $.fn.jScrollPane.defaults = {
        showArrows : false,
        maintainPosition : true,
        stickToBottom : false,
        stickToRight : false,
        clickOnTrack : true,
        autoReinitialise : false,
        autoReinitialiseDelay : 500,
        verticalDragMinHeight : 0,
        verticalDragMaxHeight : 99999,
        horizontalDragMinWidth : 0,
        horizontalDragMaxWidth : 99999,
        contentWidth : undefined,
        animateScroll : false,
        animateDuration : 300,
        animateEase : 'linear',
        hijackInternalLinks : false,
        verticalGutter : 4,
        horizontalGutter : 4,
        mouseWheelSpeed : 0,
        arrowButtonSpeed : 0,
        arrowRepeatFreq : 50,
        arrowScrollOnHover : false,
        trackClickSpeed : 0,
        trackClickRepeatFreq : 70,
        verticalArrowPositions : 'split',
        horizontalArrowPositions : 'split',
        enableKeyboardNavigation : true,
        hideFocus : false,
        keyboardSpeed : 0,
        initialDelay : 300, // Delay before starting repeating
        speed : 30, // Default speed when others falsey
        scrollPagePercent : .8 // Percent of visible area scrolled when pageUp/Down or track area pressed
    };

})(jQuery,this);

/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.4
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( event.wheelDelta ) { delta = event.wheelDelta/120; }
    if ( event.detail     ) { delta = -event.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return $.event.handle.apply(this, args);
}

})(jQuery);

/* Copyright (c) 2006 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate: 2007-07-21 18:44:59 -0500 (Sat, 21 Jul 2007) $
 * $Rev: 2446 $
 *
 * Version 2.1.1
 */

(function($){

/**
 * The bgiframe is chainable and applies the iframe hack to get 
 * around zIndex issues in IE6. It will only apply itself in IE6 
 * and adds a class to the iframe called 'bgiframe'. The iframe
 * is appeneded as the first child of the matched element(s) 
 * with a tabIndex and zIndex of -1.
 * 
 * By default the plugin will take borders, sized with pixel units,
 * into account. If a different unit is used for the border's width,
 * then you will need to use the top and left settings as explained below.
 *
 * NOTICE: This plugin has been reported to cause perfromance problems
 * when used on elements that change properties (like width, height and
 * opacity) a lot in IE6. Most of these problems have been caused by 
 * the expressions used to calculate the elements width, height and 
 * borders. Some have reported it is due to the opacity filter. All 
 * these settings can be changed if needed as explained below.
 *
 * @example $('div').bgiframe();
 * @before <div><p>Paragraph</p></div>
 * @result <div><iframe class="bgiframe".../><p>Paragraph</p></div>
 *
 * @param Map settings Optional settings to configure the iframe.
 * @option String|Number top The iframe must be offset to the top
 * 		by the width of the top border. This should be a negative 
 *      number representing the border-top-width. If a number is 
 * 		is used here, pixels will be assumed. Otherwise, be sure
 *		to specify a unit. An expression could also be used. 
 * 		By default the value is "auto" which will use an expression 
 * 		to get the border-top-width if it is in pixels.
 * @option String|Number left The iframe must be offset to the left
 * 		by the width of the left border. This should be a negative 
 *      number representing the border-left-width. If a number is 
 * 		is used here, pixels will be assumed. Otherwise, be sure
 *		to specify a unit. An expression could also be used. 
 * 		By default the value is "auto" which will use an expression 
 * 		to get the border-left-width if it is in pixels.
 * @option String|Number width This is the width of the iframe. If
 *		a number is used here, pixels will be assume. Otherwise, be sure
 * 		to specify a unit. An experssion could also be used.
 *		By default the value is "auto" which will use an experssion
 * 		to get the offsetWidth.
 * @option String|Number height This is the height of the iframe. If
 *		a number is used here, pixels will be assume. Otherwise, be sure
 * 		to specify a unit. An experssion could also be used.
 *		By default the value is "auto" which will use an experssion
 * 		to get the offsetHeight.
 * @option Boolean opacity This is a boolean representing whether or not
 * 		to use opacity. If set to true, the opacity of 0 is applied. If
 *		set to false, the opacity filter is not applied. Default: true.
 * @option String src This setting is provided so that one could change 
 *		the src of the iframe to whatever they need.
 *		Default: "javascript:false;"
 *
 * @name bgiframe
 * @type jQuery
 * @cat Plugins/bgiframe
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 */
$.fn.bgIframe = $.fn.bgiframe = function(s) {
	// This is only for IE6
	if ( $.browser.msie && /6.0/.test(navigator.userAgent) ) {
		s = $.extend({
			top     : 'auto', // auto == .currentStyle.borderTopWidth
			left    : 'auto', // auto == .currentStyle.borderLeftWidth
			width   : 'auto', // auto == offsetWidth
			height  : 'auto', // auto == offsetHeight
			opacity : true,
			src     : 'javascript:false;'
		}, s || {});
		var prop = function(n){return n&&n.constructor==Number?n+'px':n;},
		    html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
		               'style="display:block;position:absolute;z-index:-1;'+
			               (s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
					       'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+
					       'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+
					       'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+
					       'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+
					'"/>';
		return this.each(function() {
			if ( $('> iframe.bgiframe', this).length == 0 )
				this.insertBefore( document.createElement(html), this.firstChild );
		});
	}
	return this;
};

})(jQuery);

(function ($){
    /*!
 * mcDropdown jQuery Plug-in
 *
 * Copyright 2011 Giva, Inc. (http://www.givainc.com/labs/) 
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 	http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Date: 2011-07-25
 * Rev:  1.3.1
 */
    $.fn.mcDropdown = function(list, options) {
        // track the dropdown object
        var dd;

        // create a dropdown for each match
        this.each(function() {
            dd = $.data(this, "mcDropdown");
			
            // we're already a dropdown, return a reference to myself
            if( dd ) return false;

            new $.mcDropDownMenu(this, list, options);
        });
		
        // return either the dropdown object or the jQuery object reference
        return dd || this;
    };

    // set default options
    $.mcDropdown = {
        version: "1.3.1",
        setDefaults: function(options){
            $.extend(defaults, options);
        }
    };

    // set the defaults
    var defaults = {
        minRows: 8                   // specify the minimum rows before creating a new column
        , 
        maxRows: 25                  // specify the maximum rows in a column
        , 
        targetColumnSize: 2          // specify the default target column size (it'll attempt to create this many columns by default, unless the min/max row rules are not being met)
        , 
        openFx: "slideDown"          // the fx to use for showing the root menu
        , 
        openSpeed: 250               // the speed of the openFx
        , 
        closeFx: "slideUp"           // the fx to use for hiding the root menu
        , 
        closeSpeed: 250              // the speed of the closeFx
        , 
        hoverOverDelay: 200          // the delay before opening a submenu
        , 
        hoverOutDelay: 0             // the delay before closing a submenu
        , 
        showFx: "show"               // the fx to use when showing a submenu
        , 
        showSpeed: 0                 // the speed of the showFx
        , 
        hideFx: "hide"               // the fx to use when closing a submenu
        , 
        hideSpeed: 0                 // the speed of the hideFx
        , 
        dropShadow: true             // determine whether drop shadows should be shown on the submenus
        , 
        autoHeight: true             // always uses the lineHeight options (much faster than calculating height)
        , 
        lineHeight: 19               // the base height of each list item (li) this is normally calculated automatically, but in some cases the value can't be determined and you'll need to set it manually
        , 
        screenPadding: 10            // the padding to use around the border of the screen -- this is used to make sure items stay on the screen
        , 
        allowParentSelect: false     // determines if parent items are allowed to be selected (by default only end nodes can be selected)
        , 
        delim: ":"                   // the delimited to use when showing the display string
        , 
        showACOnEmptyFocus: false    // show the autocomplete box on focus when input is empty
        , 
        valueAttr: "rel"             // the attribute that contains the value to use in the hidden field
        , 
        click: null                  // callback that occurs when the user clicks on a menu item
        , 
        select: null                 // callback that occurs when a value is selected
        , 
        init: null                   // callback that occurs when the control is fully initialized
    };

    // check to see if the browser is IE6	
    var isIE6 = ($.browser.version && $.browser.version <= 6);

    $.mcDropDownMenu = function(el, list, options){
        var $self, thismenu = this, $list, $divInput, settings, typedText = "", matchesCache, oldCache, $keylist, $keylistiframe, bInput, bDisabled = false;
		
        // create a reference to the dropdown
        $self = $(el);
		
        // is the field and input element
        bInput = $self.is(":input");
		
        // get the settings for this instance
        settings = $.extend({}, defaults, options);
		
        // set the default click behavior
        if( settings.click == null ) {
            settings.click = function (e, dropdown, settings){
                if( this.attr(settings.valueAttr) ){
                    dropdown.setValue(this.attr(settings.valueAttr));
                } else {
                    dropdown.setValue($(this.parents("li")[0]).attr(settings.valueAttr));
                }
            };
        }
	
        // attach window behaviors
        $(document)
        // Bind a click event to hide all visible menus when the document is clicked
        .bind("click", function(e){
            // get the target that was clicked
            var $target = $(e.target);
            var $ul = $target.parents().filter(function (){
                return this === $list[0] || (!!$keylist && $keylist[0] === this);
            });
            // check to make sure the clicked element was inside the list
            if( $ul.length ){
                var bIsParent = $target.is(".mc_parent");
					
                // if we've clicked a parent item in the autocomplete box, we must adjust the current value
                if( bIsParent && $keylist && $ul[0] === $keylist[0] ){
                    updateValue($target.find("> ul > li:first"), false);
                    e.stopPropagation();
                    return false;
                }
                // check to see if the user can click on parent items
                else if( !settings.allowParentSelect && bIsParent ) return false;

                // make sure to hide the parent branch if we're not the root
                if( $target.not(".mc_root") ) hideBranch.apply($target.parent().parent()[0], [e]);
					
                if( settings.click != null && settings.click.apply($target, [e, thismenu, settings]) == false ){
                    return false;
                }
            }
				
            // close the menu
            thismenu.closeMenu();
        });
			
        // store a reference to the list, if it's not already a jQuery object make it one
        $list = (((typeof list == "object") && !!list.jquery)) ? list : $(list);
		
        // we need to calculate the visual width for each nested list
        $list
        // move list to body -- this allows us to always calculate the correct position & width of the elements
        .appendTo("body")
        // move the list way off screen
        .css({
            position: "absolute", 
            top: -10000, 
            left: -10000
        })
        // find all the ul tags
        .find("ul")
        // add the root ul tag to the array
        .andSelf()
        // make all the nodes visible
        .css("display", "block")
        // loop through each node
        .each(function (){
            var $el = $(this);
            // calculate the width of the element -- using clientWidth is 2x as fast as width()
            $el.data("width", $el[0].clientWidth);
        })
        // now that we've gotten the widths, hide all the lists and move them to x:0, y:0
        .css({
            top: 0, 
            left: 0, 
            display: "none"
        });
			
        // mark the root children items
        $list.find("> li").addClass("mc_root");
        // add parent class
        $("li > ul", $list).parent().addClass("mc_parent");

        // create the div to wrap everything in
        $divInput = $('<div class="mcdropdown"><a href="#" tabindex="-1"></a><input type="hidden" name="' + (el.name || el.id) + '" id="' + (el.id || el.name) + '" /></div>')
        .appendTo($('<div style="position: relative;"></div>'))
        .parent();
			
        // get a reference to the input element and remove it from the DOM				
        var $input = $self.replaceWith($divInput).attr({
            id: "", 
            name: ""
        });
        // get a reference to the hidden form field
        var $hidden = $divInput.find(":input");
		
        // put the input element back in the div.mcdropdown layer
        $divInput = $divInput.find(".mcdropdown").prepend($input);
		
        // make a visible copy of the element so we can get the correct sizes, then delete it
        var $divInputClone = $divInput.clone().css({
            position: "absolute", 
            top: -9999999, 
            left: -999999, 
            visibility: "visible"
        }).show().appendTo("body");
        var di = {
            width: $divInputClone.width() - $("a", $divInputClone).width(), 
            height: $divInputClone.outerHeight()
            }
        $divInputClone.remove();
		
        // store a reference to this link select
        $.data($hidden[0], "mcDropdown", thismenu);

        // update the height of the outer relative div, this allows us to
        // correctly anchor the dropdown
        $divInput.parent().height(di.height);

        // safari will not get the correct width until after everything has rendered		
        if( $.browser.safari ){
            setTimeout(function (){
                $self
                .width($divInput.width() - $("a", $divInput).width());
            }, 100);
        }
		
        // adjust the width of the new input element
        $self
        .width(di.width)
        // make sure we only attach the next events if we're in input element
        .filter(":input")
        // turn autocomplete off
        .attr("autocomplete", "off")
        // add key stroke bindings (IE6 requires keydown)
        .bind("keypress", checkKeypress)
        // prevent user from selecting text
        .bind("mousedown", function (e){
            $(this).triggerHandler("focus");
            e.stopPropagation();
            return false;
        })
        // disable context menu
        .bind("contextmenu", function (){
            return false;
        })
        // select the text when the cursor is placed in the field
        .bind("focus", onFocus)
        // when the user leaves the text field
        .bind("blur", onBlur);
			
        // IE6 doesn't register certain keypress events, so we must catch them during the keydown event
        if( $.browser.msie || $.browser.safari) $self.bind("keydown", function (e){
            // check to see if a key was pressed that IE6 doesn't trigger a keypress event for
            if( ",8,9,37,38,39,40,".indexOf("," + e.keyCode + ",") > -1 ) return checkKeypress(e);
        });
		
        // attach a click event to the anchor
        $("a", $divInput).bind("click", function (e){
            // if disabled, skip processing
            if( bDisabled ) return false;
            thismenu.openMenu(e);
            return false;
        });
		
        // set the value of the field
        this.setValue = function (value, skipCallback){
            // update the hidden value
            $hidden.val(value);
            // get the display name
            var name = displayString(value);
			
            // run the select callback (some keyboard entry methods will manage this callback manually)
            if( settings.select != null && skipCallback != true ) settings.select.apply(thismenu, [value, name]);
			
            // update the display value and return the jQuery object
            return $self[bInput ? "val" : "text"](name);
        };
		
        // set the default value (but don't run callback)
        if( bInput ) this.setValue($self[0].defaultValue, true);
	
        // get the value of the field (returns array)
        this.getValue = function (value){
            return [$hidden.val(), $self[bInput ? "val" : "text"]()];
        };
		
        // open the menu programmatically
        this.openMenu = function (e){
            // if the menu is open, kill processing
            if( $list.is(":visible") ){
                // on a mouse click, close the menu, otherwise just cancel
                return (!!e) ? thismenu.closeMenu() : false;
            }
			
            function open(){
                // columnize the root list
                columnizeList($list).hide();
                // add the bindings to the menu
                addBindings($list);
				
                // anchor the menu relative parent
                anchorTo($divInput.parent(), $list, true);
				
                // remove existing hover classes, which might exist from keyboard entry
                $list.find(".mc_hover").removeClass("mc_hover");

                // show the menu
                $list[settings.openFx](settings.openSpeed, function (){
                    // scroll the list into view
                    scrollToView($list);
                });

                // if the bgIframe exists, use the plug-in
                if( isIE6 && !!$.fn.bgIframe ) $list.bgIframe();
            }
			
            // if this is triggered via an event, just open the menu
            if( e ) open();
            // otherwise we need to open the menu asynchronously to avoid collision with $(document).click event
            else setTimeout(open, 1);
        };
		
        // close the menu programmatically
        this.closeMenu = function (e){
            // hide any open menus
            $list.find("ul:visible").parent().each(function (){
                hideBranch.apply(this);
            });
			
            // remove the bindings
            removeBindings($list);
	
            // close the menu
            $list[settings.closeFx](settings.closeSpeed);
        };
		
        // place focus in the input box
        this.focus = function (){
            $self.focus();
        };
	
        // disable the element
        this.disable = function (status){
            // change the disabled status
            bDisabled = !!status;
			
            $divInput[bDisabled ? "addClass" : "removeClass"]("mcdropdownDisabled");
            $input.attr("disabled", bDisabled);
        };
		
        function getNodeText($el){
            var nodeContent;
            var nContents = $el.contents().filter(function() {
                // remove empty text nodes and comments
                return (this.nodeType == 1) || (this.nodeType == 3 && $.trim(this.nodeValue).length>0);
            });
            // return either an empty string or the node's value
            if (nContents[0] && nContents[0].nodeType == 3) {
                // Text node : take it's value
                nodeContent = nContents[0].nodeValue; 
            } else if (nContents[0] && nContents[0].nodeType == 1) {
                // Element node : take the contents
                nodeContent = $(nContents[0]).text();
            } else {
                nodeContent = "";
            }
            return $.trim(nodeContent);
        };
		
        function getTreePath($li){
            if( $li.length == 0 ) return [];
	
            var name = [getNodeText($li)];
            // loop through the parents and get the value
            $li.parents().each(function (){
                var $el = $(this);
                // break when we get to the main list element
                if( this === $list[0] ) return false;
                else if( $el.is("li") ) name.push(getNodeText($el));
            });
	
            // return the display name
            return name.reverse();
        };
		
        function displayValue(value){
            // return the path as an array
            return getTreePath(getListItem(value));
        };
		
        function displayString(value){
                    
            //just return the child, and not the full tree path
            //Lee added this
            return getNodeText(getListItem(value));
                    
                    
                    
            // return the display name
            return displayValue(value).join(settings.delim);
        };
		
        function parseTree($selector){
            var s = [], level = (arguments.length > 1) ? ++arguments[1] : 1;
	
            // loop through all the children and store information about the tree
            $("> li", $selector).each(
                function (){
                    // get a reference to the current object
                    var $self = $(this);
	
                    // look for a ul tag as a direct child
                    var $ul = $("> ul", this);
					
                    // push a reference to the element to the tree array
                    s.push({
                        // get the name of the node
                        name:     getNodeText($self)
                        // store a reference to the current element
                        , 
                        element:  this
                        // parse and store any children items
                        , 
                        children: ($ul.length) ? parseTree($ul, level) : []
                    });
	
                }
                );
			
            return s;
        };
		
        function addBindings(el){
            removeBindings(el);
            $("> li", el)
            .bind("mouseover", hoverOver)
            .bind("mouseout", hoverOut);
        };
		
        function removeBindings(el){
            $("> li", el)
            .unbind("mouseover", hoverOver)
            .unbind("mouseout", hoverOut);
        };
		
        // scroll the current element into view
        function scrollToView($el){
            // get the current position
            var p = position($el, true);
            // get the screen dimensions
            var sd = getScreenDimensions();
			
            // if we're hidden off the bottom of the page, move up
            if( p.bottom > sd.y ){
                $("html,body").animate({
                    "scrollTop": "+=" + ((p.bottom - sd.y) + settings.screenPadding) + "px"
                })
            }
        };
		
        function hoverOver(e){
            var self = this;
            var timer = $.data(self, "timer");
			
            // if the timer exists, clear it
            if( !isNaN(timer) ) clearTimeout(timer);
	
            // if IE6, add the hover class
            $(this).addClass("mc_hover");

            // show the branch
            $.data(self, "timer", setTimeout(function(){
                showBranch.apply(self);
            }, settings.hoverOverDelay)
            );
        };
		
        function hoverOut(e){
            var self = this;
            var timer = $.data(self, "timer");
			
            // if the timer exists, clear it
            if( !isNaN(timer) ) clearTimeout(timer);
	
            // if IE6, remove the hover class
            $(this).removeClass("mc_hover");
			
            // hide the branch
            $.data(self, "timer", setTimeout(function(){
                var $li = $(self);
                setTimeout(function (){
                    // if no children selected, we must close the parent menus
                    if( $li.parent().find("> li.mc_hover").length == 0 ){
                        $li.parents("li").each(function (){
                            var self = this;
                            clearTimeout($.data(self, "timer"));
                            hideBranch.apply(self);
                            // check to see if we've hovered over a parent item
                            if( $(this).siblings().filter(".mc_hover").length > 0 ) return false;
                        });
                    }
						
                }, settings.hoverOverDelay);

                hideBranch.apply(self);
            }, settings.hoverOutDelay)
            );
			
            // this will stop flickering in IE6, but it leaves mc_hover classes behind
            if( isIE6 ) e.stopPropagation();
        };
		
        function getShadow(depth){
            var shadows = $self.data("shadows");
			
            // if the shadows don't exist, create an object to track them
            if( !shadows ) 
                shadows = {};
			
            // if the shadow doesn't exist, create it
            if( !shadows[depth] ){
                // create shadow
                shadows[depth] = $('<div class="mcdropdown_shadow"></div>').appendTo('body');
                // if the bgIframe exists, use the plug-in
                if( !!$.fn.bgIframe ) shadows[depth].bgIframe();
                // update the shadows cache
                $self.data("shadows", shadows);
            }
			
            return shadows[depth];
        };
		
        function showBranch(){
            var self = this;
            // the child menu
            var $ul = $("> ul", this);
			
            // if the menu is already visible or there is no submenu, cancel
            if( $ul.is(":visible") || ($ul.length == 0) ) return false;
			
            // hide any visible sibling menus
            $(this).parent().find('> li ul:visible').not($ul).parent().each(function(){
                hideBranch.apply(this);
            });
			
            // columnize the list
            columnizeList($ul);
			
            // add new bindings
            addBindings($ul);
	
            var depth = $ul.parents("ul").length;
			
            // get the screen dimensions
            var sd = getScreenDimensions();
			
            // get the coordinates for the menu item
            var li_coords = position($(this));
	
            // move the menu to the correct position and show the menu || ((depth)*2)
            $ul.css({
                top: li_coords.bottom, 
                left: li_coords.marginLeft/*, zIndex: settings.baseZIndex + ((depth)*2)*/
            }).show();
	
            // get the bottom of the menu
            var menuBottom = $ul.outerHeight() + $ul.offset().top;
	
            // if we're hidden off the bottom of the page, move up
            if( menuBottom > sd.y ){
                // adjust the menu by subtracting the bottom edge by the screen offset
                $ul.css("top", li_coords.bottom - (menuBottom - sd.y) - settings.screenPadding);
            }
			
            var showShadow = function (){
                // if using drop shadows, then show them		
                if( settings.dropShadow ){
                    // get a reference to the current shadow
                    var $shadow = getShadow(depth);
                    // get the position of the parent element
                    var pos = position($ul);
					
                    // move the shadow to the correct visual & DOM position
                    $shadow.css({
                        top: pos.top + pos.marginTop
                        , 
                        left: pos.left + pos.marginLeft
                        , 
                        width: pos.width
                        , 
                        height: pos.height
                    /*, zIndex: settings.baseZIndex + ((2*depth)-1)*/
                    }).insertAfter($ul).show();
			
                    // store a reference to the shadow so we can hide it		
                    $.data(self, "shadow", $shadow);
                }
            }
			
            // columnize the list and then show it using the defined effect
            // if the menu has a zero delay, just open it and then draw the
            // shadow, otherwise show the effect and the draw the shadow
            // after you're done.
            if( settings.showSpeed <= 0 ){
                showShadow();
            } else {
                $ul.hide()[settings.showFx](settings.showSpeed, showShadow);
            }
        };
		
        function hideBranch(){
            var $ul = $("> ul", this);
            // if the menu is already visible or there is no submenu, cancel
            if( $ul.is(":hidden") || ($ul.length == 0) ) return false;
			
            // if using drop shadows, then hide
            if( settings.dropShadow && $.data(this, "shadow") ) $.data(this, "shadow").hide();
	
            // if we're IE6, we need to set the visiblity to "hidden" so child
            // menus are correctly hidden and remove the .mc_hover class due to
            // the e.stopPropagation() call in the hoverOut() call
            if( isIE6 )
                $ul.css("visibility", "hidden").parent().removeClass("mc_hover");
	
            // hide the menu
            $ul.stop()[settings.hideFx](settings.hideSpeed);
        };
	
        function position($el, bUseOffset){
            var bHidden = false;
            // if the element is hidden we must make it visible to the DOM to get
            if ($el.is(":hidden")) {
                bHidden = !!$el.css("visibility", "hidden").show();
            }
			
            var pos = $.extend($el[bUseOffset === true ? "offset" : "position"](),{
                width: $el.outerWidth()
                , 
                height: $el.outerHeight()
                , 
                marginLeft: parseInt($.curCSS($el[0], "marginLeft", true), 10) || 0
                , 
                marginRight: parseInt($.curCSS($el[0], "marginRight", true), 10) || 0
                , 
                marginTop: parseInt($.curCSS($el[0], "marginTop", true), 10) || 0
                , 
                marginBottom: parseInt($.curCSS($el[0], "marginBottom", true), 10) || 0
            });
			
            if( pos.marginTop < 0 ) pos.top += pos.marginTop;
            if( pos.marginLeft < 0 ) pos.left += pos.marginLeft;
			
            pos["bottom"] = pos.top + pos.height;
            pos["right"] = pos.left + pos.width;
			
            // hide the element again
            if( bHidden ) $el.hide().css("visibility", "visible");
	
            return pos;
        };
		
        function anchorTo($anchor, $target, bUseOffset){
            var pos = position($anchor, bUseOffset);
			
            $target.css({
                position: "absolute"
                , 
                top: pos.bottom
                , 
                left: pos.left
            });
			
            /*
			 * we need to return the top edge of the core drop down menu, because
			 * the top:0 starts at this point when repositioning items absolutely
			 * this means we have to offset everything by the offset of the top menu
			 */ 
			
            return pos.bottom;
        };
		
        function getScreenDimensions(){
            var d = {
                scrollLeft: $(window).scrollLeft()
                , 
                scrollTop:  $(window).scrollTop()
                , 
                width:      $(window).width()     // changed from innerWidth
                , 
                height:     $(window).height()    // changed from innerHeight			
            };
			
            // calculate the correct x/y positions
            d.x = d.scrollLeft + d.width;
            d.y = d.scrollTop + d.height;
			
            return d;
        };
		
        function getPadding(el, name){
            var torl = name == 'height' ? 'Top'    : 'Left',  // top or left
            borr = name == 'height' ? 'Bottom' : 'Right'; // bottom or right
			
            return (
                // we add "0" to each string to make sure parseInt() returns a number
                parseInt("0"+$.curCSS(el, "border"+torl+"Width", true), 10)
                + parseInt("0"+$.curCSS(el, "border"+borr+"Width", true), 10)
                + parseInt("0"+$.curCSS(el, "padding"+torl, true), 10)
                + parseInt("0"+$.curCSS(el, "padding"+borr, true), 10)
                + parseInt("0"+$.curCSS(el, "margin"+torl, true), 10)
                + parseInt("0"+$.curCSS(el, "margin"+borr, true), 10)
                );
        };
		
        function getListDimensions($el, cols){
            if( !$el.data("dimensions") ){
                // get the width of the dropdown menu
                var ddWidth = $divInput.outerWidth();
                // if showing the root item, then try to make sure the width of the menu is sized to the drop down menu
                var width = ( ($el === $list) && ($el.data("width") * cols < ddWidth) ) ? Math.floor(ddWidth/cols) : $el.data("width");
		
                $el.data("dimensions", {
                    // get the original width of the list item
                    column: width
                    // subtract the padding from the first list item from the width to get the width of the items
                    , 
                    item: width - getPadding($el.children().eq(0)[0], "width")
                    // get the original height
                    , 
                    height: $el.height()
                });
            }
			
            return $el.data("dimensions");
        };
		
        function getHeight($el){
            // skip height calculation and use lineHeight
            if( settings.autoHeight === false ) return settings.lineHeight;
            // if we haven't cached our height, do so now
            if( !$el.data("height") ) $el.data("height", $el.outerHeight());
	
            // return the cached value
            return $el.data("height");
        };
		
        function columnizeList($el){
            // get the children items
            var $children = $el.find("> li");
            // get the total number of items
            var items = $children.length;
			
            // calculate how many columns we think we should have based on the max rows
            var calculatedCols = Math.ceil(items/settings.maxRows);
            // get the number of columns, don't columnize if we don't have enough rows
            // if the height of the column is bigger than the screen, we automatically try 
            // moving to a new column
            var cols = !!arguments[1] ? arguments[1] : ( items <= settings.minRows ) ? 1 : (calculatedCols > settings.targetColumnSize) ? calculatedCols : settings.targetColumnSize;
            // get the dimension of this element
            var widths = getListDimensions($el, cols);
            var prevColumn = 0;
            var columnHeight = 0;
            var maxColumnHeight = 0;
            var maxRows = Math.ceil(items/cols);
	
            // get the width of the parent item
            var parentLIWidth = $el.parent("li").width();
			
            // we need to draw the list element, but hide it so we can correctly calculate it's information
            $el.css({
                "visibility": "hidden", 
                "display": "block"
            });
			
            // loop through each child item
            $children.each(function (i){
                var currentItem = i+1;
                var nextItemColumn = Math.floor((currentItem/items) * cols);
                // calculate the column we're in
                var column = Math.floor((i/items) * cols);
                // reference the current item
                var $li = $(this);
                // variable to track margin-top
                var marginTop;
	
                // if we're in the same column
                if( prevColumn != column ){
                    // move to the top of the next column
                    marginTop = (columnHeight+1) * -1;
                    // reset column height
                    columnHeight = 0;
                // if we're in a new column
                } else {
                    marginTop = 0;
                }
				
                // increase the column height based on it's current height (calculate this before adding classes)
                columnHeight += (getHeight($li) || settings.lineHeight);
				
                // update the css settings
                $li.css({
                    "marginLeft": (widths.column * column)
                    , 
                    "marginTop": marginTop
                    , 
                    "width": widths.item
                })
                [((nextItemColumn > column) || (currentItem == items)) ? "addClass" : "removeClass"]("mc_endcol")
                [(marginTop != 0) ? "addClass" : "removeClass"]("mc_firstrow")
                ;
                // get the height of the longest column			
                if( columnHeight > maxColumnHeight ) maxColumnHeight = columnHeight;
	
                // update the previous column
                prevColumn = column;
            });
	
            // if the menu is too tall to fit on the screen, try adding another column
            if( ($el !== $list) && (maxColumnHeight + (settings.screenPadding*2) >= getScreenDimensions().height) ){
                return columnizeList($el, cols+1);
            }
	
            /*
			 * set the height of the list to the max column height. this fixes
			 * display problems in FF when the last column is not full.	
			 * 
			 * we also need to set the visiblity to "visible" to make sure that
			 * the element will show up	
			 */ 
            $el.css("visibility", "visible").height(maxColumnHeight);
			
            return $el;
        };
		
        function getListItem(value){
            return $list.find("li[" + settings.valueAttr + "='"+ value +"']");
        };
		
        function getCurrentListItem(){
            return getListItem($hidden.val());
        };
		
        function onFocus(e){
            var $current = getCurrentListItem();
            var value = $self.val().toLowerCase();
            var treePath = value.toLowerCase().split(settings.delim);
            var currentNode = treePath.pop();
            var lastDelim = value.lastIndexOf(settings.delim) + 1;
			
            // reset the typed text
            typedText = treePath.join(settings.delim) + (treePath.length > 0 ? settings.delim : "");
	
            // we need to set the selection asynchronously so that when user TABs to field the pre-select isn't overwritten
            setTimeout(function (){
                // preselect the last child node
                setSelection($self[0], lastDelim, lastDelim+currentNode.length);
            }, 0);
			
            // create the keyboard hint list
            if( !$keylist ){
                $keylist = $('<ul class="mcdropdown_autocomplete"></ul>').appendTo("body");
                // if IE6 we need an iframe to hide the scrolling list
                if( isIE6 && !!$.fn.bgIframe ) $keylistiframe = $('<div></div>').bgIframe().appendTo("body");
            } 
			
            // should we show matches?
            var hideResults = !(settings.showACOnEmptyFocus && (typedText.length == 0));

            // get the siblings for the current item
            var $siblings = ($current.length == 0 || $current.hasClass("mc_root")) ? $list.find("> li") : $current.parent().find("> li");
            // show all matches
            showMatches($siblings, hideResults);
        };
		
        var iBlurTimeout = null;
        function onBlur(e){
            // only run the last blur event
            if( iBlurTimeout ) clearTimeout(iBlurTimeout);
            // we may need to cancel this blur event, so we run it asynchronously
            iBlurTimeout = setTimeout(function (){
                // get the current item
                var $current = getCurrentListItem();
				
                // if we must select a child item, then update to the first child we can find
                if( !settings.allowParentSelect && $current.is(".mc_parent") ){
                    // grab the first end child item we can find for the current path
                    var value = $current.find("li:not('.mc_parent'):first").attr(settings.valueAttr);
                    // update the value
                    thismenu.setValue(value, true);
                }
				
                // run the select callback
                if( settings.select != null ) settings.select.apply(thismenu, thismenu.getValue());
				
                // hide matches
                hideMatches();
				
                // mark event as having run
                iBlurTimeout = null;
            }, 200);
        };
		
        function showMatches($li, hideResults){
            var bCached = ($li === oldCache), $items = bCached ? $keylist.find("> li").removeClass("mc_hover mc_hover_parent mc_firstrow") : $li.clone().removeAttr("style").removeClass("mc_hover mc_hover_parent mc_firstrow mc_endcol").filter(":last").addClass("mc_endcol").end();
	
            // only do the following if we've updated the cache or the list is hidden
            if( !bCached || $keylist.is(":hidden") ){
                // update the matches
                $keylist.empty().append($items).width($divInput.outerWidth() - getPadding($keylist[0], "width")).css("height", "auto");
				
                // anchor the menu relative parent
                anchorTo($divInput.parent(), $keylist, true);

                // show hover on mouseover				
                $items.hover(function (){
                    $keylist.find("> li").removeClass("mc_hover_parent mc_hover");
                    $(this).addClass("mc_hover")
                    }, function (){
                    $(this).removeClass("mc_hover")
                    });

                // make sure the the ul's are hidden (so the li's are sized correctly)				
                $items.find("> ul").css("display", "none");
		
                // show the list
                $keylist.show().css("visibility", (hideResults === true) ? "hidden" : "visible");
	
                // if we're IE6, ensure we enforce the "max-height" CSS property			
                if( isIE6 ){
                    var maxHeight = parseInt($keylist.css("max-height"), 10) || 0;
                    if( (maxHeight > 0) && (maxHeight < $keylist.outerHeight()) ) $keylist.height(maxHeight);
					
                    // anchor the iframe behind the scrollable list
                    if( !!$.fn.bgIframe ) anchorTo($divInput.parent(), $keylistiframe.css({
                        height: $keylist.outerHeight(), 
                        width: $keylist.width()
                        }, true).show())
                }
	
                // scroll the list into view
                if( hideResults !== true ) scrollToView($keylist);
            }
			
            // do not show the list on screen
            if( hideResults === true ){
                // hide the results and move them offscreen (so it doesn't hide the cursor in FF2)
                $keylist.css({
                    top: "-10000px", 
                    left: "-10000px"
                });
                // hiden the iframe overlay
                if( isIE6 && !!$.fn.bgIframe ) $keylistiframe.css("display", "none");
            }

            // get the currently selected item
            var $current = $keylist.find("li[" + settings.valueAttr + "='"+ $hidden.val() +"']");
			
            // make sure the last match is still highlighted
            $current.addClass("mc_hover" + ($current.is(".mc_parent")? "_parent" : ""));
			
            // scroll the item into view
            if( $current.length > 0 && (hideResults != true) ) scrollIntoView($current);
			
            // update the cache
            oldCache = matchesCache = $li;
        };
		
        function hideMatches(){
            // hide the bgiframe
            if( isIE6 && !!$.fn.bgIframe && $keylistiframe ) $keylistiframe.hide();
            if( $keylist ) $keylist.hide();
        };
		
        // check the user's keypress
        function checkKeypress(e){
            var key = String.fromCharCode(e.keyCode || e.charCode).toLowerCase();
            var $current = getCurrentListItem();
            var $lis = ($current.length == 0 || $current.hasClass("mc_root")) ? $list.find("> li") : $current.parent().find("> li");
            var treePath = typedText.split(settings.delim);
            var currentNode = treePath.pop();
            var compare = currentNode + key;
            var selectedText = getSelection($self[0]).toLowerCase();
            var value = $self.val().toLowerCase();
			
            // if the up arrow was pressed
            if( e.keyCode == 38 ){
                moveMatch(-1);
                return false;
	
            // if the down arrow was pressed
            } else if( e.keyCode == 40 ){
                moveMatch(1);
                return false;
	
            // if the [ESC] was pressed
            } else if( e.keyCode == 27 ){
                // clear typedText
                typedText = "";
                // clear the value
                thismenu.setValue("");
                // show the root level
                showMatches($list.find("> li"));
			
                return false;
	
            // if user pressed [DEL] or [LEFT ARROW], go remove last typed character		
            } else if( e.keyCode == 8 || e.keyCode == 37 ){
                // if left arrow, go back to previous parent
                compare = (e.keyCode == 37) ? "" : currentNode.substring(0, currentNode.length - 1);
				
                // if all the text is highlighted we just came from a delete
                if( selectedText == currentNode ){
                    currentNode = "";
                }
                // we're going backwards to the last parent, move backwards
                if( treePath.length > 0 && currentNode.length == 0){
                    updateValue($current.parent().parent());
                    return false;
                // if all the text is selected, remove everything
                } else if( selectedText == value ){
                    typedText = "";
                    thismenu.setValue("");
                    return false;
                }
            // if the user pressed [ENTER], [TAB], [RIGHT ARROW] or the delimiter--go to next level
            } else if( e.keyCode == 9 || e.keyCode == 13 || e.keyCode == 39 || key == settings.delim ){
                // get the first child item if there is one
                var $first = $current.find("> ul > li:first");
	
                // update with the next child branch
                if( $first.length > 0 ){
                    updateValue($first);
                // leave the field
                } else {
                    // if IE6, we must deselect the selection
                    if( $.browser.msie ) setSelection($self[0], 0, 0);
                    if( e.keyCode == 9 ){
                        // blur out of the field
                        $self.triggerHandler("blur");
                        // hide the matches
                        hideMatches();
                        // allow the tab
                        return true;
                    } else {
                        // blur out of the field
                        $self.trigger("blur");
                        // hide the matches
                        hideMatches();
                    }
                }
	
                return false;
            // if all the text is highlighted then we need to delete everything
            } else if( selectedText == value ){
                typedText = "";
                compare = key;
            }
	
            // update the match cache with all the matches
            matchesCache = findMatches($lis, compare);
			
            // if we have some matches, populate autofill and show matches
            if( matchesCache.length > 0 ){
                // update the a reference to what the user's typed
                typedText = treePath.join(settings.delim) + (treePath.length > 0 ? settings.delim : "") + compare;
                updateValue(matchesCache.eq(0), true);
            } else {
                // find the previous compare string
                compare = compare.length ? compare.substring(0, compare.length-1) : "";
			
                // since we have no matches, get the previous matches
                matchesCache = findMatches($lis, compare);
	
                // if we have some matches, show them
                if( matchesCache.length > 0 )
                    showMatches(matchesCache);
                // hide the matches
                else
                    hideMatches();
            }

            // stop default behavior
            e.preventDefault();
			
            return false;
        };
		
        function moveMatch(step){
            // find the current item in the matches cache
            var $current = getCurrentListItem(), $next, pos = 0;
			
            // if nothing selected, look for the item with the hover class
            if( $current.length == 0 ) $current = matchesCache.filter(".mc_hover, .mc_hover_parent");
            // if still nothing, grab the first item in the cache
            if( $current.length == 0 || $keylist.is(":hidden") ){
                // grab the first item
                $current = matchesCache.eq(0);
                // since nothing is selected, don't step forward/back
                step = 0;
            } 
	
            // find the current position of the element		
            matchesCache.each(function (i){ 
                if( this === $current[0]){
                    pos = i;
                    return false;
                }
            });
	
            // if no matches, cancel
            if( !matchesCache || matchesCache.length == 0 || $current.length == 0 ) return false;
			
            // adjust by the step count
            pos = pos + step;
	
            // make sure pos is in valid bounds		
            if( pos < 0 ) pos = matchesCache.length-1;
            else if( pos >= matchesCache.length ) pos = 0;
			
            // get the next item
            $next = matchesCache.eq(pos);
			
            updateValue($next, true);
        };
		
        function findMatches($lis, compare){
            var matches = $([]); // $([]) = empty jquery object
			
            $lis.each(function (){
                // get the current list item and it's label
                var $li = $(this), label = getNodeText($li);
	
                // label matches what the user typed, add it to the queue
                if( label.substring(0, compare.length).toLowerCase() == compare ){
                    // store a copy to this jQuery item
                    matches = matches.add($li);
                }
            });
	
            // return the matches found		
            return matches;
        };
		
        function updateValue($li, keepTypedText){
            // grab all direct children items
            var $siblings = keepTypedText ? matchesCache : ($li.length == 0 || $li.hasClass("mc_root")) ? $list.find("> li") : $li.parent().find("> li");
            var treePath = getTreePath($li);
            var currentNode = treePath.pop().toLowerCase();
	
            // update the a reference to what the user's typed
            if( !keepTypedText ) typedText = treePath.join(settings.delim).toLowerCase() + (treePath.length > 0 ? settings.delim : "");
	
            // update form field and display with the updated value
            thismenu.setValue($li.attr(settings.valueAttr), true);
			
            // pre-select the last node
            setSelection($self[0], typedText.length, currentNode.length+typedText.length);
			
            // remove any currently selected items
            $siblings.filter(".mc_hover,.mc_hover_parent").removeClass("mc_hover mc_hover_parent");
            // add the hover class
            $li.addClass("mc_hover" + ($li.is(".mc_parent")? "_parent" : ""));
			
            // show all the matches
            showMatches($siblings);
        };
	
        // get the text currently selected by the user in a text field
        function getSelection(field){
            var text = "";
            if( field.setSelectionRange ){
                text = field.value.substring(field.selectionStart, field.selectionEnd);
            } else if( document.selection ){
                var range = document.selection.createRange();
                if( range.parentElement() == field ){
                    text = range.text;
                }
            }
            return text;
        };
	
        // set the text selected in a text field
        function setSelection(field, start, end) {
            if( field.createTextRange ){
                var selRange = field.createTextRange();
                selRange.collapse(true);
                selRange.moveStart("character", start);
                selRange.moveEnd("character", end);
                selRange.select();
            } else if( field.setSelectionRange ){
                field.setSelectionRange(start, end);
            } else {
                if( field.selectionStart ){
                    field.selectionStart = start;
                    field.selectionEnd = end;
                }
            }
            field.focus();
        };
	
        function scrollIntoView($el, center){
            var el = $el[0];
            var scrollable = $keylist[0];
            // get the padding which is need to adjust the scrollTop
            var s = {
                pTop: parseInt($keylist.css("paddingTop"), 10)||0, 
                pBottom: parseInt($keylist.css("paddingBottom"), 10)||0, 
                bTop: parseInt($keylist.css("borderTopWidth"), 10)||0, 
                bBottom: parseInt($keylist.css("borderBottomWidth"), 10)||0
                };
	
            // scrolling down
            if( (el.offsetTop + el.offsetHeight) > (scrollable.scrollTop + scrollable.clientHeight) ){
                scrollable.scrollTop = $el.offset().top + (scrollable.scrollTop - $keylist.offset().top) - ((scrollable.clientHeight/((center == true) ? 2 : 1)) - ($el.outerHeight() + s.pBottom));
            // scrolling up
            } else if( el.offsetTop - s.bTop - s.bBottom <= (scrollable.scrollTop + s.pTop + s.pBottom) ){
                scrollable.scrollTop = $el.offset().top + (scrollable.scrollTop - $keylist.offset().top) - s.pTop;
            }
        };
		
        // run the init callback (some keyboard entry methods will manage this callback manually)
        if( settings.init != null ) settings.init.apply(thismenu, [$input, $hidden, $list]);

    };
	
})(jQuery);


/*!
 * iButton jQuery Plug-in
 *
 * Copyright 2011 Giva, Inc. (http://www.givainc.com/labs/) 
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 	http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Date: 2011-07-26
 * Rev:  1.0.03
 */
;(function($){
	// set default options
	$.iButton = {
		version: "1.0.03",
		setDefaults: function(options){
			$.extend(defaults, options);
		}
	};
	
	$.fn.iButton = function(options) {
		var method = typeof arguments[0] == "string" && arguments[0];
		var args = method && Array.prototype.slice.call(arguments, 1) || arguments;
		// get a reference to the first iButton found
		var self = (this.length == 0) ? null : $.data(this[0], "iButton");
		
		// if a method is supplied, execute it for non-empty results
		if( self && method && this.length ){

			// if request a copy of the object, return it			
			if( method.toLowerCase() == "object" ) return self;
			// if method is defined, run it and return either it's results or the chain
			else if( self[method] ){
				// define a result variable to return to the jQuery chain
				var result;
				this.each(function (i){
					// apply the method to the current element
					var r = $.data(this, "iButton")[method].apply(self, args);
					// if first iteration we need to check if we're done processing or need to add it to the jquery chain
					if( i == 0 && r ){
						// if this is a jQuery item, we need to store them in a collection
						if( !!r.jquery ){
							result = $([]).add(r);
						// otherwise, just store the result and stop executing
						} else {
							result = r;
							// since we're a non-jQuery item, just cancel processing further items
							return false;
						}
					// keep adding jQuery objects to the results
					} else if( !!r && !!r.jquery ){
						result = result.add(r);
					}
				});

				// return either the results (which could be a jQuery object) or the original chain
				return result || this;
			// everything else, return the chain
			} else return this;
		// initializing request (only do if iButton not already initialized)
		} else {
			// create a new iButton for each object found
			return this.each(function (){
				new iButton(this, options);
			});
		};
	};

	// count instances	
	var counter = 0;
	// detect iPhone
	$.browser.iphone = (navigator.userAgent.toLowerCase().indexOf("iphone") > -1);
	
	var iButton = function (input, options){
		var self = this
			, $input = $(input)
			, id = ++counter
			, disabled = false
			, width = {}
			, mouse = {dragging: false, clicked: null}
			, dragStart = {position: null, offset: null, time: null }
			// make a copy of the options and use the metadata if provided
			, options = $.extend({}, defaults, options, (!!$.metadata ? $input.metadata() : {}))
			// check to see if we're using the default labels
			, bDefaultLabelsUsed = (options.labelOn == ON && options.labelOff == OFF)
			// set valid field types
			, allow = ":checkbox, :radio";

		// only do for checkboxes buttons, if matches inside that node
    if( !$input.is(allow) ) return $input.find(allow).iButton(options);
		// if iButton already exists, stop processing
		else if($.data($input[0], "iButton") ) return;

		// store a reference to this marquee
		$.data($input[0], "iButton", self);
		
		// if using the "auto" setting, then don't resize handle or container if using the default label (since we'll trust the CSS)
		if( options.resizeHandle == "auto" ) options.resizeHandle = !bDefaultLabelsUsed;
		if( options.resizeContainer == "auto" ) options.resizeContainer = !bDefaultLabelsUsed;
		
		// toggles the state of a button (or can turn on/off)
		this.toggle = function (t){
			var toggle = (arguments.length > 0) ? t : !$input[0].checked;
			$input.attr("checked", toggle).trigger("change");
		};
		
		// disable/enable the control
		this.disable = function (t){
			var toggle = (arguments.length > 0) ? t : !disabled;
			// mark the control disabled
			disabled = toggle;
			// mark the input disabled
			$input.attr("disabled", toggle);
			// set the diabled styles
			$container[toggle ? "addClass" : "removeClass"](options.classDisabled);
			// run callback
			if( $.isFunction(options.disable) ) options.disable.apply(self, [disabled, $input, options]);
		};
		
		// repaint the button
		this.repaint = function (){
			positionHandle();
		};
		
		// this will destroy the iButton style
		this.destroy = function (){
			// remove behaviors
			$([$input[0], $container[0]]).unbind(".iButton");
			$(document).unbind(".iButton_" + id);
			// move the checkbox to it's original location
			$container.after($input).remove();
			// kill the reference
			$.data($input[0], "iButton", null);
			// run callback
			if( $.isFunction(options.destroy) ) options.destroy.apply(self, [$input, options]);
		};

    $input
			// create the wrapper code
			.wrap('<div class="' + $.trim(options.classContainer + ' ' + options.className) + '" />')
    	.after(
				  '<div class="' + options.classHandle + '"><div class="' + options.classHandleRight + '"><div class="' + options.classHandleMiddle + '" /></div></div>'
      	+ '<div class="' + options.classLabelOff + '"><span><label>'+ options.labelOff + '</label></span></div>'
      	+ '<div class="' + options.classLabelOn + '"><span><label>' + options.labelOn   + '</label></span></div>'
      	+ '<div class="' + options.classPaddingLeft + '"></div><div class="' + options.classPaddingRight + '"></div>'
			);

    var $container = $input.parent()
			, $handle    = $input.siblings("." + options.classHandle)
			, $offlabel  = $input.siblings("." + options.classLabelOff)
			, $offspan   = $offlabel.children("span")
			, $onlabel   = $input.siblings("." + options.classLabelOn)
			, $onspan    = $onlabel.children("span");


		// if we need to do some resizing, get the widths only once
		if( options.resizeHandle || options.resizeContainer ){
			width.onspan = $onspan.outerWidth(); 
			width.offspan = $offspan.outerWidth();
		}
			
		// automatically resize the handle
		if( options.resizeHandle ){
			width.handle = Math.min(width.onspan, width.offspan);
			$handle.css("width", width.handle);
		} else {
			width.handle = $handle.width();
		}

    // automatically resize the control
		if( options.resizeContainer ){
			width.container = (Math.max(width.onspan, width.offspan) + width.handle + 20);
			$container.css("width", width.container);
			// adjust the off label to match the new container size
			$offlabel.css("width", width.container - 5);
		} else {
			width.container = $container.width();
		}

		var handleRight = width.container - width.handle - 6;
    
		var positionHandle = function (animate){
			var checked = $input[0].checked
				, x = (checked) ? handleRight : 0
				, animate = (arguments.length > 0) ? arguments[0] : true;

			if( animate && options.enableFx ){
				$handle.stop().animate({left: x}, options.duration, options.easing);
				$onlabel.stop().animate({width: x + 4}, options.duration, options.easing);
				$onspan.stop().animate({marginLeft: x - handleRight}, options.duration, options.easing);
				$offspan.stop().animate({marginRight: -x}, options.duration, options.easing);
			} else {
				$handle.css("left", x);
				$onlabel.css("width", x + 4);
				$onspan.css("marginLeft", x - handleRight);
				$offspan.css("marginRight", -x);
			}
		};

		// place the buttons in their default location	
		positionHandle(false);
		
		var getDragPos = function(e){
			return e.pageX || ((e.originalEvent.changedTouches) ? e.originalEvent.changedTouches[0].pageX : 0);
		};

		// monitor mouse clicks in the container
		$container.bind("mousedown.iButton touchstart.iButton", function(e) {
			// abort if disabled or allow clicking the input to toggle the status (if input is visible)
			if( $(e.target).is(allow) || disabled || (!options.allowRadioUncheck && $input.is(":radio:checked")) ) return;
			
			e.preventDefault();
			mouse.clicked = $handle;
			dragStart.position = getDragPos(e);
			dragStart.offset = dragStart.position - (parseInt($handle.css("left"), 10) || 0);
			dragStart.time = (new Date()).getTime();
			return false;
		});

		// make sure dragging support is enabled		
		if( options.enableDrag ){
			// monitor mouse movement on the page
			$(document).bind("mousemove.iButton_" + id + " touchmove.iButton_" + id, function(e) {
				// if we haven't clicked on the container, cancel event
				if( mouse.clicked != $handle ){ return }
				e.preventDefault();
				
				var x = getDragPos(e);
				if( x != dragStart.offset ){
					mouse.dragging = true;
					$container.addClass(options.classHandleActive);
				}
	
				// make sure number is between 0 and 1			
				var pct = Math.min(1, Math.max(0, (x - dragStart.offset) / handleRight));
				
				$handle.css("left", pct * handleRight);
				$onlabel.css("width", pct * handleRight + 4);
				$offspan.css("marginRight", -pct * handleRight);
				$onspan.css("marginLeft", -(1 - pct) * handleRight);
				
				return false;
			});
		}
    
		// monitor when the mouse button is released
		$(document).bind("mouseup.iButton_" + id + " touchend.iButton_" + id, function(e) {
			if( mouse.clicked != $handle ){ return false }
			e.preventDefault();

			// track if the value has changed			
			var changed = true;

			// if not dragging or click time under a certain millisecond, then just toggle			
			if( !mouse.dragging || (((new Date()).getTime() - dragStart.time) < options.clickOffset ) ){
				var checked = $input[0].checked;
				$input.attr("checked", !checked);

				// run callback
				if( $.isFunction(options.click) ) options.click.apply(self, [!checked, $input, options]);
			} else {
				var x = getDragPos(e);
				
				var pct = (x - dragStart.offset) / handleRight;
				var checked = (pct >= 0.5);
				
				// if the value is the same, don't run change event
				if( $input[0].checked == checked ) changed = false;

				$input.attr("checked", checked);
			}
			
			// remove the active handler class			
			$container.removeClass(options.classHandleActive);
			mouse.clicked =  null;
			mouse.dragging = null;
			// run any change event for the element
			if( changed ) $input.trigger("change");
			// if the value didn't change, just reset the handle
			else positionHandle();
			
			return false;
		});
		
		// animate when we get a change event
		$input
			.bind("change.iButton", function (){
				// move handle
				positionHandle();

				// if a radio element, then we must repaint the other elements in it's group to show them as not selected
				if( $input.is(":radio") ){
					var el = $input[0];
	
					// try to use the DOM to get the grouped elements, but if not in a form get by name attr
					var $radio = $(el.form ? el.form[el.name] : ":radio[name=" + el.name + "]");

					// repaint the radio elements that are not checked	
					$radio.filter(":not(:checked)").iButton("repaint");
				}

				// run callback
				if( $.isFunction(options.change) ) options.change.apply(self, [$input, options]);
			})
			// if the element has focus, we need to highlight the container
			.bind("focus.iButton", function (){
				$container.addClass(options.classFocus);
			})
			// if the element has focus, we need to highlight the container
			.bind("blur.iButton", function (){
				$container.removeClass(options.classFocus);
			});

		// if a click event is registered, we must register on the checkbox so it's fired if triggered on the checkbox itself
		if( $.isFunction(options.click) ){
			$input.bind("click.iButton", function (){
				options.click.apply(self, [$input[0].checked, $input, options]);
			});
		}

		// if the field is disabled, mark it as such
		if( $input.is(":disabled") ) this.disable(true);

		// special behaviors for IE    
		if( $.browser.msie ){
			// disable text selection in IE, other browsers are controlled via CSS
			$container.find("*").andSelf().attr("unselectable", "on");
			// IE needs to register to the "click" event to make changes immediately (the change event only occurs on blur)
			$input.bind("click.iButton", function (){ $input.triggerHandler("change.iButton"); });
		}
		
		// run the init callback
		if( $.isFunction(options.init) ) options.init.apply(self, [$input, options]);
	};

	var defaults = {
		  duration: 200                           // the speed of the animation
		, easing: "swing"                         // the easing animation to use
		, labelOn: "ON"                           // the text to show when toggled on
		, labelOff: "OFF"                         // the text to show when toggled off
		, resizeHandle: false                    // determines if handle should be resized
		, resizeContainer: false                 // determines if container should be resized
		, enableDrag: true                        // determines if we allow dragging
		, enableFx: true                          // determines if we show animation
		, allowRadioUncheck: false                // determine if a radio button should be able to be unchecked
		, clickOffset: 120                        // if millseconds between a mousedown & mouseup event this value, then considered a mouse click

		// define the class statements
		, className:         ""
		, classContainer:    "ibutton-container"
		, classDisabled:     "ibutton-disabled"
		, classFocus:        "ibutton-focus"
		, classLabelOn:      "ibutton-label-on"
		, classLabelOff:     "ibutton-label-off"
		, classHandle:       "ibutton-handle"
		, classHandleMiddle: "ibutton-handle-middle"
		, classHandleRight:  "ibutton-handle-right"
		, classHandleActive: "ibutton-active-handle"
		, classPaddingLeft:  "ibutton-padding-left"
		, classPaddingRight: "ibutton-padding-right"

		// event handlers
		, init: null                              // callback that occurs when a iButton is initialized
		, change: null                            // callback that occurs when the button state is changed
		, click: null                             // callback that occurs when the button is clicked
		, disable: null                           // callback that occurs when the button is disabled/enabled
		, destroy: null                           // callback that occurs when the button is destroyed
	}, ON = defaults.labelOn, OFF = defaults.labelOff;

})(jQuery);
