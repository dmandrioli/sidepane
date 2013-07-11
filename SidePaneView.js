define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dijit/_WidgetBase",
    "dojo/touch"
], function(declare, lang, win, on, domClass, domGeom, WidgetBase, touch){

    return declare(WidgetBase, {
        // summary:
        //		A container displayed on the side of the screen. It can be displayed on top of the page (mode=overlay)
        //		or can push the content of the page (mode=push).
        // description:
        //		SidePane is an interactive container hidden by default. To open it, swipe the screen from the border to the center of the page.
        //		To close it, swipe horizontally the panel in the other direction.
        //		This widget must be a sibling of html's body element.
        //		If mode is set to "push", there are some rules to follow:
        //		1. The pushed element(s) have to be wrapped into a single html container with its "position" CSS property set to "absolute".
        //		2. Place the widget just before this single container, whatever the value of position.
        //		3. The width of the SidePane can't be changed in the markup (15em by default). However it can be changed in the LESS/CSS files.

        // baseClass: String
        //		The name of the CSS class of this widget.
        baseClass: "mblSidePaneView",
        buildRendering: function(){
            this.inherited(arguments);
            //domClass.add(this.domNode, "mblSidePaneView");
        }
    });
});
