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
        baseClass: "mblSidePane",
        // mode: String
        //		Can be "overlay" or "push".
        mode: "overlay",
        // position: String
        //		Can be "start" or "end". If set to "start", the panel is displayed on the left side in left-to-right mode.
        position: "start",
        // inheritViewBg: Boolean
        //		If true, the "mblBackground" CSS class is added to the panel to reuse the background of the mobile theme used.
        inheritViewBg: true,

        show: function(){
            // summary:
            //		Open the panel.
            this._showImpl();
            this._resetInteractions();
            var opts = {bubbles:true, cancelable:true, detail: this};
            on.emit(this.domNode,"showStart", opts);
        },

        hide: function(){
            // summary:
            //		Close the panel.
            this._hideImpl();
            this._resetInteractions();
            var opts = {bubbles:true, cancelable:true, detail: this};
            on.emit(this.domNode,"hideStart", opts);
        },

        _visible: false,
        _makingVisible: false,
        _originX: NaN,
        _originY: NaN,

        _setPositionAttr: function(value){
            this.position = value;
            this.buildRendering();
        },

        _setModeAttr: function(value){
            this.mode = value;
            this.buildRendering();
        },
        _getStateAttr: function(value){
            return this._visible ? "open" : "close";
        },
        _touchPress: function(event){
            this._originX = event.pageX;
            this._originY = event.pageY;

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

        _hideAndReveal: function(){
            this.domNode.style.display = "none";
            setTimeout(lang.hitch(this, function(){this.domNode.style.display = "";}),0);
        },

        postCreate: function(){
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

        _showImpl: function(){
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

        _hideImpl: function(){
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
