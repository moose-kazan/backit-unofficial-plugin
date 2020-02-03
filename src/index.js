var { ToggleButton } = require('sdk/ui/button/toggle');
var tabs = require("sdk/tabs");
var panels = require("sdk/panel");
var self = require("sdk/self");
var request = require("sdk/request");
var dataStorage = require("sdk/simple-storage");
var _ = require("sdk/l10n").get;

var offersList = [];


var button = ToggleButton({
	id: "backit-unoff-main-button",
	//badge: '3%',
	label: _("pluginTitle"),
	icon: {
		"16": "./logo-16.png",
		"32": "./logo-32.png",
		"42": "./logo-42.png",
		"48": "./logo-48.png"
	},
	badgeColor: "#009400",
	onChange: handleChangeMain
});

var panel = panels.Panel({
	contentURL: self.data.url(_("pluginMainHTML")),
	height: 360,
	width: 320,
	onHide: handleHide,
});

function handleChangeMain(state) {
	if (state.checked) {
		if (isAffLink(tabs.activeTab.url)) {
			tabs.activeTab.url = _('createLinkURL', encodeURIComponent(tabs.activeTab.url));
			button.state('window', {checked: false});
		}
		else {
			panel.show({
				position: button,
			});
		}
	}
}


function handleHide() {
	button.state('window', {checked: false});
}

// Update list of offers
function updateOffersList() {
	request.Request({
		url: _("updateOffersList"),
		onComplete: function (response) {
			if (response.status == 200) {
				if (!response.json.error && response.json.data) {
					offersList = response.json.data;
				}
			}
		}
	}).get();
}

function prepareRegExp(re) {
	try {
		return new RegExp(re.slice(1, -3), 'iu');
	}
	catch(e) {
		return new RegExp(re.slice(1, -3).replace(/\\-/g, '-'), 'iu');
	}
}

function isAffLink(link) {
	var rv = false;
	for (var i = 0; i < offersList.length; i++) {
		if (offersList[i].attributes.link_match) {
			if (link.match(prepareRegExp(offersList[i].attributes.link_match))) {
				return true;
			}
		}
	}
	return rv;
}

// Init offers
updateOffersList();
// Update list of offers every hour
//setInterval(updateOffersList, 60^60*1000);
