# Dojo Mobile SidePane

Status: Experimental

A container displayed on the side of the screen. It can be displayed on top of the page (mode=overlay), can push the
content of the page (mode=push) or reveal the content the pane (mode=reveal). Compatible with Dojo 1.9.x.

To open/close the panel, swipe from the border of the screen to the center or call the open() method of the widget.

## Samples

Overlay mode: http://dmandrioli.github.io/sidepane/tests/test_SidePane-overlay.html

Push mode: http://dmandrioli.github.io/sidepane/tests/test_SidePane-push.html

Reveal mode: http://dmandrioli.github.io/sidepane/tests/test_SidePane-reveal.html

A sidePane visible only on the first load (cookie based) : http://dmandrioli.github.io/sidepane/tests/test_SidePane-VisibleOnce.html

Dojo Commits Explorer: http://dmandrioli.github.io/sidepane/tests/test_SidePane.html

<img src="https://raw.github.com/dmandrioli/sidepane/master/screenshots/all.jpg">

## Installing

Clone this repository into a Dojo 1.9 distribution, next to 'dojo', 'dojox' and 'dijit'.

## Tested platforms

* iOS 6.x
* Android 4.x (Chrome and stock browser)
* Blackberry 10
* Windows Phone 8
* Chrome Desktop
* IE10 Desktop

## Limitations

* The size of the panel can't be set in HTML. It is 15em by default. To change this value,
change @PANEL_WIDTH in SidePane.less and regenerate the stylesheet.

* Blackberry and Chrome Mobile on Android have built-in left/right swipe gesture. On these platforms, swipe opening is not really usable.

## Known bugs

 * Swipe opening from the right works only on iOS and desktop browsers.


## Credits

* Damien Mandrioli (IBM CCLA)
