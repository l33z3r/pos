/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function(tinymce) {
    tinymce.create('tinymce.plugins.MaxlengthPlugin', {
        init : function(ed, url)
        {
            var content = '';
            var content_nohtml = '';

            ed.onKeyUp.add(function(ed, e)
            {
                if(ed.getParam('maxlength')>0)
                {
                    var maxlength = ed.getParam('maxlength');
                    var n_h = ed.getContent().replace(/(<([^>]+)>)/ig, "");
                    if(maxlength<n_h.length)
                    {
                        window.setTimeout(function()
                        {
                            ed.setContent(content);
                        }, 10);
                    }
                    else
                    {
                        content = ed.getContent();
                        content_nohtml = n_h;
                        var text = "<span style=\"display: block; text-align: right; float: right;\">"+content_nohtml.split(' ').length + " Words, " + content_nohtml.length + " Characters of "+maxlength+"</span>";
                        tinymce.DOM.setHTML(tinymce.DOM.get(tinyMCE.activeEditor.id + '_path_row'), text);
                    }
                }
            });
        },
        /**
         * Returns information about the plugin as a name/value array.
         * The current keys are longname, author, authorurl, infourl and version.
         *
         * @return {Object} Name/value array containing information about the plugin.
         */
        getInfo : function() {
            return {
                longname : 'maxlength plugin',
                author : 'ZiTAL',
                authorurl : 'http://zital.hackinbadakigu.net/',
                infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/maxlength',
                version : "1.0"
            };
        }
    });
    // Register plugin
    tinymce.PluginManager.add('maxlength', tinymce.plugins.MaxlengthPlugin);
})(tinymce);