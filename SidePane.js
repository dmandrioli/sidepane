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
        //		A container displayed on the side of the screen. It can be displayed on top of the page (mode=overlay) or
        //		can push the content of the page (mode=push or mode=reveal).
        // description:
        //		SidePane is an interactive container hidden by default. To open it, swipe the screen from the border to the center of the page.
        //		To close it, swipe horizontally the panel in the other direction.
        //		This widget must be a sibling of html's body element or use the entire screen.
        //		If mode is set to "push" or "reveal", the width of the SidePane can't be changed in the markup (15em by default).
        //		However it can be changed in SidePane.less (@PANE_WIDTH variable) to regenerate SidePane.css.
        //		In "push" and "reveal" mode, the pushed element is the first sibling of the SidePane which is is of type element
        //		(nodeType == 1) and not a SidePane.

        // baseClass: String
        //		The name of the CSS class of this widget.
        baseClass: "mblSidePane",

        // mode: String
        //		Can be "overlay", "reveal" or "push".
        mode: "overlay",

        // position: String
        //		Can be "start" or "end". If set to "start", the panel is displayed on the left side in left-to-right mode.
        position: "start",

        // inheritViewBg: Boolean
        //		If true, the "mblBackground" CSS class is added to the panel to reuse the background of the mobile theme used.
        inheritViewBg: true,

        // swipeOpening: Boolean
        //		Enables the swipe opening of the pane.
        swipeOpening: true,

        // swipeClosing: Boolean
        //		Enables the swipe closing of the pane.
        swipeClosing: true,

        open: function(){
            // summary:
            //		Open the panel.

            if(this.domNode.style.display == "none"){
                // The dom node has to be visible to be animated. If it's not visible, postpone the opening to enable animation.
                this.domNode.style.display = "";
                setTimeout(lang.hitch(this, this._openImpl, 0));
            }else{
                this._openImpl();
            }

            var opts = {bubbles:true, cancelable:true, detail: this};
            on.emit(this.domNode,"showStart", opts);

        },

        close: function(){
            // summary:
            //		Close the panel.
            this._hideImpl();
            var opts = {bubbles:true, cancelable:true, detail: this};
            on.emit(this.domNode,"hideStart", opts);
        },

        _visible: false,
        _makingVisible: false,
        _originX: NaN,
        _originY: NaN,
        _cssClasses: {},

        _setPositionAttr: function(value){
            this.domNode.style.display = "none";
            this.position = value;
            this.buildRendering();
        },

        _setModeAttr: function(value){
            this.domNode.style.display = "none";
            this.mode = value;
            this.buildRendering();
        },

        _getStateAttr: function(){
            return this._visible ? "open" : "close";
        },

        _setSwipeClosingAttr: function(value){
            this.swipeClosing = value;
            this._resetInteractions();
        },

        _setSwipeOpeningAttr: function(value){
            this.swipeOpening = value;
            this._resetInteractions();
        },

        postCreate: function(){
            this.inherited(arguments);
            this.domNode.style.display = "none";
        },

        buildRendering: function(){
            this.inherited(arguments);
            this._cleanCSS();
            this._addClass(this.domNode, "mblSidePane" + this._capitalize(this.position));

            if(this.inheritViewBg){
                this._addClass(this.domNode, "mblBackground");
            }
            this.close();
            this._resetInteractions();
        },

        _openImpl: function(){
            this._visible = true;
            this._changeClass(this.domNode, "VisiblePane", "HiddenPane");
            this._changeClass(this.domNode, "mblSidePaneVisiblePane", "mblSidePaneHiddenPane");
            if(this.mode == "overlay"){
                this.domNode.style[this.position=="start" ? "left" : "right"] = 0;
            }else if(this.mode == "push" || this.mode == "reveal"){
                var nextElement = this._findPushedElement(this.domNode);
                if(nextElement){
                    var addedClass = "mblSidePane" + this._capitalize(this.position) + "PushHiddenWrapper";
                    this._changeClass(nextElement, addedClass, addedClass.replace("Hidden", "Visible"));
                }
            }
        },

        _hideImpl: function(){
            this._visible = false;
            this._makingVisible = false;
            this._removeClass(win.doc.body, "noSelect");
            this._changeClass(this.domNode, "HiddenPane", "VisiblePane");
            this._changeClass(this.domNode, "mblSidePaneHiddenPane", "mblSidePaneVisiblePane");
            if(this.mode == "overlay"){
                this.domNode.style[this.position=="start" ? "left" : "right"] = "-100%";
            }else if(this.mode == "push" || this.mode == "reveal"){
                var nextElement = this._findPushedElement(this.domNode);
                if(nextElement){
                    var removedClass = "mblSidePane" + this._capitalize(this.position) + "PushHiddenWrapper";
                    this._changeClass(nextElement, removedClass.replace("Hidden", "Visible"), removedClass);
                }
            }
        },

        _touchPress: function(event){
            this._originX = event.pageX;
            this._originY = event.pageY;

            if(this.domNode.style.display == "none"){
                this.domNode.style.display = "";
            }

            if(this._visible || (this.position == "start" && !this._visible && this._originX <= 10) ||
                (this.position == "end" && !this._visible && this._originX >= win.doc.width - 10)){
                this._makingVisible = !this._visible;
                this._pressHandle.remove();
                this._moveHandle = on(win.doc, touch.move, lang.hitch(this, this._touchMove));
                this._releaseHandle = on(win.doc, touch.release, lang.hitch(this, this._touchRelease));

                this._addClass(win.doc.body, "noSelect");
            }
        },

        _touchMove: function(event){
            if (!this._makingVisible && Math.abs(event.pageY - this._originY) > 10){
                this._resetInteractions();
            }else{
                var pos = event.pageX;

                if(this.position == "start"){
                    if(this.swipeOpening && !this._visible && (pos - this._originX) > 10){
                        this.open();
                    }else if(this._visible){
                        if (this._originX < pos){
                            this._originX = pos;
                        }

                        if((this.swipeClosing && this._originX - pos) > 10){
                            this.close();
                            this._originX = pos;
                        }
                    }
                }else{
                    if(this.swipeOpening && !this._visible && (this._originX - pos) > 10){
                        this.open();
                    }else if(this._visible){
                        if (this._originX > pos){
                            this._originX = pos;
                        }
                        if((this.swipeClosing && pos - this._originX) > 10){
                            this.close();
                            this._originX = pos;
                        }
                    }
                }
            }
        },

        _touchRelease: function(event){
            this._makingVisible = false;
            this._removeClass(win.doc.body, "noSelect");
            this._resetInteractions();
        },

        _resetInteractions: function(){
            if (this._releaseHandle){
                this._releaseHandle.remove();
            }
            if(this._moveHandle){
                this._moveHandle.remove();
            }
            if(this._pressHandle){
                this._pressHandle.remove();
            }
            var elt = this._visible ? this.domNode : win.doc;

            if(this.domNode.style.display == "none" || this.swipeOpening || this.swipeClosing){
                this._pressHandle = on(elt, touch.press, lang.hitch(this, this._touchPress));
            }

            this._originX = NaN;
            this._originY = NaN;
        },

        _cssClassGen: function(suffix){
            if(suffix.indexOf("mbl") == 0){
                // Already a mobile class
                return suffix;
            }else{
                return "mblSidePane" + this._capitalize(this.position) + this._capitalize(this.mode) + suffix;
            }
        },

        _addClass: function(node, suffix){
            var cls = this._cssClassGen(suffix);
            domClass.add(node, cls);
            if(this._cssClasses[cls]){
                this._cssClasses[cls].push(node);
            }else{
                this._cssClasses[cls] = [node];
            }
        },
        _removeClass: function(node, suffix){
            var cls = this._cssClassGen(suffix);
            domClass.remove(node, cls);
            if(this._cssClasses[cls]){
                var i = this._cssClasses[cls].indexOf(node);
                if(i != -1) {
                    this._cssClasses[cls].splice(i, 1);
                }
            }else{
                this._cssClasses[cls] = [node];
            }
        },

        _changeClass: function(node, toAdd, toRemove){
            this._addClass(node, toAdd);
            this._removeClass(node, toRemove);
        },

        _cleanCSS: function(){
            for(var cls in this._cssClasses){
                for(var i = 0; i < this._cssClasses[cls].length; i++){
                    this._removeClass(this._cssClasses[cls][i], cls);
                }
            }
            this._cssClasses = {};
        },

        _findPushedElement: function(domElt){
            var siblings = domElt.parentElement.children;
            for (var i = 0; i < siblings.length; i++){
                if(siblings[i].nodeType == 1 && !domClass.contains(siblings[i], "mblSidePane")){
                    return siblings[i];
                }
            }
            return null;
        },

        _capitalize: function(str){
            return str[0].toUpperCase() + str.substring(1);
        },

        destroy: function(){
            this._cleanCSS();

            if(this._pressHandle){
                this._pressHandle.remove();
            }
            if(this._moveHandle){
                this._moveHandle.remove();
            }
            if(this._releaseHandle){
                this._releaseHandle.remove();
            }
        }
    });
});
