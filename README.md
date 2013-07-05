# Dojo Mobile SidePane

A container displayed on the side of the screen. It can be displayed on top of the page (mode=overlay) or can push the
content of the page (mode=push).

## Samples

Overlay mode: http://dmandrioli.github.com/dojox/mobile/tests/test_SidePane-overlay.html

Push mode: http://dmandrioli.github.com/dojox/mobile/tests/test_SidePane-push.html

## Installing

Copy the content of this repository in a Dojo 1.9 distribution.

## Tested platforms

* iOS 6.x
* Android 4.x
* Blackberry 10
* Windows Phone 8

## Known bugs/limitations

* In overlay mode, the size of the panel can't be set in HTML. It is set to 15em by default. To change this value,
change @PANEL_WIDTH in SidePane.less and regenerate themes.


