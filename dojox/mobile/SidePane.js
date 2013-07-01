define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/sniff",
    "dojo/_base/window",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/window",
    "dijit/_WidgetBase",
    "dojo/_base/array",
    "dijit/registry",
    "dojo/touch",
    "./_css3"
], function(declare, lang, has, win, on, domClass, domGeom, domStyle, windowUtils, WidgetBase, array, registry, touch, css3){

    return declare("dojox.mobile.SidePane", WidgetBase, {
        // summary:
        //		...
        //		...

        // baseClass: String
        //		The name of the CSS class of this widget.
        baseClass: "mblSidePane",

        mode: "overlay", // | "reveal" | "push"
        position: "start", // | end
        startup: function(){

            this.hide();
            domClass.add(this.domNode, "mblSidePaneOverlay");
            domClass.add(this.domNode, "mblBackground");
            this._pressListener = on(win.doc, touch.press, lang.hitch(this, this._touchPress));
        },

        _touchPress: function(event){
            this._originX = event.pageX;
            this._originY = event.pageY;
            if(this._visible || !this._visible && this._originX <= 10){
                if(this._visible){
                    this._makingVisible = false;
                }else{
                    this._makingVisible = true;
                }

                this._pressListener.remove();
                this._moveListener = on(win.doc, touch.move, lang.hitch(this, this._touchMove));
                this._releaseListener = on(win.doc, touch.release, lang.hitch(this, this._touchRelease));
                domClass.add(win.doc.body, "noSelect");
            }
        },
        _visible: false,
        _makingVisible: false,
        _paneWidth: 0,
        _originX: NaN,
        _originY: NaN,

        _touchMove: function(event){

            if (!this._makingVisible && Math.abs(event.pageY - this._originY) > 10){
                this._resetInteractions();
            }else{
                var pos = event.pageX;
                if(!this._visible && (pos - this._originX) > 10){
                    this.show();
                }else if(this._visible){
                    if (this._originX < pos){
                        this._originX = pos;
                    }
                    if((this._originX - pos) > 10){
                        this.hide();
                        this._originX = pos;
                    }
                }
            }
        },

        _touchRelease: function(event){
            this._makingVisible = false;
            domClass.remove(win.doc.body, "noSelect");
            this._resetInteractions();
        },

        _resetInteractions: function(){
            this._releaseListener.remove();
            this._moveListener.remove();
            this._pressListener = on(win.doc, touch.press, lang.hitch(this, this._touchPress));
            this._originX = NaN;
            this._originY = NaN;
        },

        _updatePaneWidth: function(){
            this._paneWidth = domGeom.getMarginBox(this.domNode).w;
        },

        postCreate: function(){
            this._updatePaneWidth();
            this.domNode.style.display = "none";
            setTimeout(lang.hitch(this, function(){this.domNode.style.display = "";}),0);
        },

        buildRendering: function(){
            this.inherited(arguments);
        },

        show: function(){
            this._visible = true;
            this.domNode.style.left = 0;
        },

        hide: function(){
            this._visible = false;
            this.domNode.style.left = "-100%";
        }
    });
});
