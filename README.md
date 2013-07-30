# Dojo Mobile SidePane

A container displayed on the side of the screen. It can be displayed on top of the page (mode=overlay) or can push the
content of the page (mode=push). Compatible with Dojo 1.9.x.

To open/close the panel, swipe from the border of the screen to the center.

## Samples

Overlay mode: http://dmandrioli.github.io/sidepane/tests/test_SidePane-overlay.html

Push mode: http://dmandrioli.github.io/sidepane/tests/test_SidePane-push.html

Reveal mode: http://dmandrioli.github.io/sidepane/tests/test_SidePane-reveal.html

Dojo Commits Explorer: http://dmandrioli.github.io/sidepane/tests/test_SidePane.html

<img src="https://raw.github.com/dmandrioli/sidepane/master/screenshots/image001.png">
<img src="https://raw.github.com/dmandrioli/sidepane/master/screenshots/image002.png">
<img src="https://raw.github.com/dmandrioli/sidepane/master/screenshots/image003.png">
<img src="https://raw.github.com/dmandrioli/sidepane/master/screenshots/image004.png">

## Installing

Clone this repository into a Dojo 1.9 distribution, next to 'dojo', 'dojox' and 'dijit'.

## Tested platforms

* iOS 6.x
* Android 4.x (Chrome and stock browser)
* Blackberry 10
* Windows Phone 8
* Chrome Desktop
* Firefox Desktop
* IE10 Desktop

## Limitations

* In push and reveal mode, the size of the panel can't be set in HTML. It is 15em by default. To change this value,
change @PANEL_WIDTH in SidePane.less and regenerate the stylesheet.

* Blackberry Chrome Mobile on Android have built-in left/right swipe gesture. On these platforms, swipe opening is not really usable.

## Known bugs

 * Swipe opening from the right works only on iOS and desktop browsers.


## Credits

* Damien Mandrioli (IBM CCLA)
