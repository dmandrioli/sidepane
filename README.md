# Dojo Mobile SidePane

A container displayed on the side of the screen. It can be displayed on top of the page (mode=overlay) or can push the
content of the page (mode=push).

## Samples

Overlay mode: http://ibm.biz/BdxTqH

Push mode: http://ibm.biz/BdxTqX

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

* Windows Phone and Blackberry: opening a right panel using swipe gesture does not work. Should be fixed quickly.

