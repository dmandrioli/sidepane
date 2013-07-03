define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/sniff",
    "dojo/_base/window",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/window",
    "dijit/_WidgetBase",
    "dojo/_base/array",
    "dijit/registry",
    "dojo/touch"
], function(declare, lang, has, win, on, domClass, dom, domGeom, domStyle, windowUtils, WidgetBase, array, registry, touch){

    return declare("dojox.mobile.SidePane", WidgetBase, {
        // summary:
        //		...
        //		...

        // baseClass: String
        //		The name of the CSS class of this widget.
        baseClass: "mblSidePane",

        mode: "overlay", // | "reveal" | "push"
        position: "start", // | end
        inheritViewBg: true,
        startup: function(){

            this.hide();
        },
        _setPositionAttr: function(value){

            this.position = value;
            this.buildRendering();
        },
        _touchPress: function(event){

            this._originX = event.pageX;
            this._originY = event.pageY;

            //alert(win.doc.innerWidth + " " + this._originX + " " + screen.pixelDepth);
            if(this._visible || (this.position == "start" && !this._visible && this._originX <= 10) ||
                (this.position == "end" && !this._visible && this._originX >= win.doc.width - 10)){

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
                if(this.position == "start"){
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
                }else{
                    if(!this._visible && (this._originX - pos) > 10){
                        this.show();
                    }else if(this._visible){
                        if (this._originX > pos){
                            this._originX = pos;
                        }
                        if((pos - this._originX) > 10){
                            this.hide();
                            this._originX = pos;
                        }
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
            if (this._releaseListener){
                this._releaseListener.remove();
            }
            if(this._moveListener){
                this._moveListener.remove();
            }
            if(this._pressListener){
                this._pressListener.remove();
            }
            this._pressListener = on(this._visible ? this.domNode : win.doc, touch.press, lang.hitch(this, this._touchPress));

            this._originX = NaN;
            this._originY = NaN;
        },

        _updatePaneWidth: function(){
            this._paneWidth = domGeom.getMarginBox(this.domNode).w;
        },
        _hideAndReveal: function(){
            this.domNode.style.display = "none";
            setTimeout(lang.hitch(this, function(){this.domNode.style.display = "";}),0);
        },
        postCreate: function(){
            this._updatePaneWidth();
            this._hideAndReveal();
        },

        buildRendering: function(){
            this.inherited(arguments);
            this._hideAndReveal();

            // Clean CSS
            var props = [
                "mblSidePaneEnd",
                "mblSidePanePush",
                "mblSidePaneStart",
                "mblSidePaneOverlay",
                "mblSidePaneEndPushHiddenPane",
                "mblSidePaneEndPushVisiblePane",
                "mblSidePaneStartPushHiddenPane",
                "mblSidePaneStartPushVisiblePane"
            ];

            for (var i in props){
                domClass.remove(this.domNode, props[i]);
            }
            var nextElement = this._getNextElement(this.domNode);
            if(nextElement){
                domClass.remove(nextElement, "mblSidePaneStartPushHiddenWrapper");
                domClass.remove(nextElement, "mblSidePaneStartPushVisibleWrapper");
                domClass.remove(nextElement, "mblSidePaneEndPushHiddenWrapper");
                domClass.remove(nextElement, "mblSidePaneEndPushVisibleWrapper");
            }
            // Set CSS classes
            if(this.mode == "overlay"){
                domClass.add(this.domNode, "mblSidePaneOverlay");
            }else if(this.mode == "push"){
                domClass.add(this.domNode, "mblSidePanePush");
            }
            if(this.position == "start"){
                domClass.add(this.domNode, "mblSidePaneStart");
            }else{
                domClass.add(this.domNode, "mblSidePaneEnd");
            }

            if(this.inheritViewBg){
                domClass.add(this.domNode, "mblBackground");
            }else{
                domClass.remove(this.domNode, "mblBackground");
            }
            this.hide();
            this._resetInteractions();

        },
        _getNextElement: function(domElt){
            var nextElement = domElt.nextSibling;
            while (nextElement && nextElement.nodeType != 1){
                nextElement = nextElement.nextSibling;
            }
            if(nextElement && nextElement.nodeType == 1){
                return nextElement;
            }else{
                return null;
            }
        },
        show: function(){
            this._visible = true;
            if(this.mode == "overlay"){
                this.domNode.style[this.position=="start" ? "left" : "right"] = 0;
            }else if(this.mode == "push"){
                var nextElement = this._getNextElement(this.domNode);
                if(this.position == "start"){
                    domClass.add(this.domNode, "mblSidePaneStartPushVisiblePane");
                    domClass.remove(this.domNode, "mblSidePaneStartPushHiddenPane");
                    if(nextElement){
                        domClass.add(nextElement, "mblSidePaneStartPushHiddenWrapper");
                        domClass.remove(nextElement, "mblSidePaneStartPushVisibleWrapper");
                    }
                }else{
                    domClass.add(this.domNode, "mblSidePaneEndPushVisiblePane");
                    domClass.remove(this.domNode, "mblSidePaneEndPushHiddenPane");
                    if(nextElement){
                        domClass.add(nextElement, "mblSidePaneEndPushHiddenWrapper");
                        domClass.remove(nextElement, "mblSidePaneEndPushVisibleWrapper");
                    }
                }
            }
        },

        hide: function(){
            this._visible = false;
            this._makingVisible = false;
            domClass.remove(win.doc.body, "noSelect");

            if(this.mode == "overlay"){
                this.domNode.style[this.position=="start" ? "left" : "right"] = "-100%";

            }else if(this.mode == "push"){
                var nextElement = this._getNextElement(this.domNode);
                if(this.position == "start"){
                    domClass.add(this.domNode, "mblSidePaneStartPushHiddenPane");
                    domClass.remove(this.domNode, "mblSidePaneStartPushVisiblePane");
                    if(nextElement){
                        domClass.add(nextElement, "mblSidePaneStartPushVisibleWrapper");
                        domClass.remove(nextElement, "mblSidePaneStartPushHiddenWrapper");
                    }
                }else{
                    domClass.add(this.domNode, "mblSidePaneEndPushHiddenPane");
                    domClass.remove(this.domNode, "mblSidePaneEndPushVisiblePane");
                    if(nextElement){
                        domClass.add(nextElement, "mblSidePaneEndPushVisibleWrapper");
                        domClass.remove(nextElement, "mblSidePaneEndPushHiddenWrapper");
                    }
                }
            }
        }
    });
});
