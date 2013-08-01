/**
 * Created with PyCharm.
 * User: lundberg
 * Date: 7/31/13
 * Time: 2:12 PM
 */

/*global jQuery: false, SAMLmetaJS: false */
(function ($) {
	"use strict";
	var UI = {
		"clearSocial2Saml": function () {
			$("div#social2saml > div.content").empty();
		},
		"addSocial2Saml": function (social2saml) {
			var randID = Math.floor(Math.random() * 10000 + 1000),
				social2samlHTML = [
					'<fieldset><legend>Social2SAML encrypted data</legend>',
					'<div class="social2samlfield inlineField">',
					'<label for="social2saml-' + randID + '-EncryptedData">Encrypted data: </label>',
					'<textarea name="social2saml-' + randID + '-EncryptedData-name" id="social2saml-' + randID + '-EncryptedData" cols="50">',
                    (social2saml.values || ''),
                    '</textarea>',
					'</div>',
					'<button style="display: block; clear: both" class="remove">Remove</button>',
					'</fieldset>'
				];

			$(social2samlHTML.join('')).appendTo("div#social2saml > div.content").find('button.remove').click(function (e) {
				e.preventDefault();
				$(e.target).closest('fieldset').remove();
                $("div#social2saml button.addsocial2saml").show();
			});
            $("div#social2saml button.addsocial2saml").hide();
		}
	};

	SAMLmetaJS.plugins.social2saml = {

        getNewSocial2SamlEntityAttr: function () {
            var newSocial2SamlEntityAttr = {'values': []};
            newSocial2SamlEntityAttr.nameFormat = 'urn:oasis:names:tc:SAML:2.0:attrname-format:uri';
            newSocial2SamlEntityAttr.name = 'http://social2saml.nordu.net/customer'; // Strange name
            newSocial2SamlEntityAttr.friendlyName = 'Social2SAML Encrypted Data';
            return newSocial2SamlEntityAttr;
        },

		tabClick: function (handler) {
			handler($("a[href='#social2saml']"));
		},

		addTab: function (pluginTabs) {
			pluginTabs.list.push('<li><a href="#social2saml">Social2SAML</a></li>');
			pluginTabs.content.push([
				'<div id="social2saml">',
				'<div class="content"></div>',
				'<div><button class="addsocial2saml">Add Social2SAML data</button></div>',
				'</div>'
			].join(''));
		},

		setUp: function () {
			$("div#social2saml button.addsocial2saml").click(function (e) {
				e.preventDefault();
                var newSocial2SamlEntityAttr = SAMLmetaJS.plugins.social2saml.getNewSocial2SamlEntityAttr();
				UI.addSocial2Saml(newSocial2SamlEntityAttr);
			});
		},

		fromXML: function (entitydescriptor) {
		        var i;

			// Clear attributes
			UI.clearSocial2Saml();

			// Add existing Social2SAML entity attribute (from XML)
			if (entitydescriptor.entityAttributes) {
                var newSocial2SamlEntityAttr = SAMLmetaJS.plugins.social2saml.getNewSocial2SamlEntityAttr();
                for (i=0; i < entitydescriptor.entityAttributes.length; i += 1) {
                    // Maybe just a check of name is enough?
                    if ((newSocial2SamlEntityAttr.name === entitydescriptor.entityAttributes[i].name) &&
                        (newSocial2SamlEntityAttr.nameFormat === entitydescriptor.entityAttributes[i].nameFormat)) {
                        UI.addSocial2Saml(entitydescriptor.entityAttributes[i]);
                    }
				}
			}
		},

		toXML: function (entitydescriptor) {
			$('div#social2saml fieldset').each(function (index, element) {
				var textarea = $(element).find('textarea');
                var newSocial2SamlEntityAttr = SAMLmetaJS.plugins.social2saml.getNewSocial2SamlEntityAttr();
				newSocial2SamlEntityAttr.values.push(textarea.val().trim());

				if (!entitydescriptor.entityAttributes) {
					entitydescriptor.entityAttributes = [];
				}
				entitydescriptor.entityAttributes.push(newSocial2SamlEntityAttr);
			});
		},
		validate: function () {
			return true;  // All the attribute fields are optional, so this always validates
		}
	};

}(jQuery));
