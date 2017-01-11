"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var NgGridPlaceholder_1 = require('../components/NgGridPlaceholder');
var NgGrid = (function () {
    //	Constructor
    function NgGrid(_differs, _ngEl, _renderer, componentFactoryResolver, _containerRef) {
        this._differs = _differs;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
        this.componentFactoryResolver = componentFactoryResolver;
        this._containerRef = _containerRef;
        //	Event Emitters
        this.onDragStart = new core_1.EventEmitter();
        this.onDrag = new core_1.EventEmitter();
        this.onDragStop = new core_1.EventEmitter();
        this.onResizeStart = new core_1.EventEmitter();
        this.onResize = new core_1.EventEmitter();
        this.onResizeStop = new core_1.EventEmitter();
        this.onItemChange = new core_1.EventEmitter();
        //	Public variables
        this.colWidth = 250;
        this.rowHeight = 250;
        this.minCols = 1;
        this.minRows = 1;
        this.marginTop = 10;
        this.marginRight = 10;
        this.marginBottom = 10;
        this.marginLeft = 10;
        this.isDragging = false;
        this.isResizing = false;
        this.autoStyle = true;
        this.resizeEnable = true;
        this.dragEnable = true;
        this.cascade = 'up';
        this.minWidth = 100;
        this.minHeight = 100;
        //	Private variables
        this._items = [];
        this._draggingItem = null;
        this._resizingItem = null;
        this._resizeDirection = null;
        this._itemGrid = {}; //{ 1: { 1: null } };
        this._maxCols = 0;
        this._maxRows = 0;
        this._visibleCols = 0;
        this._visibleRows = 0;
        this._setWidth = 250;
        this._setHeight = 250;
        this._posOffset = null;
        this._adding = false;
        this._placeholderRef = null;
        this._fixToGrid = false;
        this._autoResize = false;
        this._destroyed = false;
        this._maintainRatio = false;
        this._preferNew = false;
        this._zoomOnDrag = false;
        this._limitToScreen = false;
        this._curMaxRow = 0;
        this._curMaxCol = 0;
        this._dragReady = false;
        this._resizeReady = false;
        this._enableCollisionDetection = true;
        this._adjustOnWindowResize = true;
        this._config = NgGrid.CONST_DEFAULT_CONFIG;
    }
    Object.defineProperty(NgGrid.prototype, "config", {
        //	[ng-grid] attribute handler
        set: function (v) {
            this.setConfig(v);
            if (this._differ == null && v != null) {
                this._differ = this._differs.find(this._config).create(null);
            }
        },
        enumerable: true,
        configurable: true
    });
    //	Public methods
    NgGrid.prototype.ngOnInit = function () {
        this._renderer.setElementClass(this._ngEl.nativeElement, 'grid', true);
        if (this.autoStyle)
            this._renderer.setElementStyle(this._ngEl.nativeElement, 'position', 'relative');
        this.setConfig(this._config);
    };
    NgGrid.prototype.ngOnDestroy = function () {
        this._destroyed = true;
    };
    NgGrid.prototype.setConfig = function (config) {
        this._config = config;
        var maxColRowChanged = false;
        for (var x in config) {
            var val = config[x];
            var intVal = !val ? 0 : parseInt(val);
            switch (x) {
                case 'margins':
                    this.setMargins(val);
                    break;
                case 'col_width':
                    this.colWidth = Math.max(intVal, 1);
                    break;
                case 'row_height':
                    this.rowHeight = Math.max(intVal, 1);
                    break;
                case 'auto_style':
                    this.autoStyle = val ? true : false;
                    break;
                case 'auto_resize':
                    this._autoResize = val ? true : false;
                    break;
                case 'draggable':
                    this.dragEnable = val ? true : false;
                    break;
                case 'resizable':
                    this.resizeEnable = val ? true : false;
                    break;
                case 'max_rows':
                    maxColRowChanged = maxColRowChanged || this._maxRows != intVal;
                    this._maxRows = intVal < 0 ? 0 : intVal;
                    break;
                case 'max_cols':
                    maxColRowChanged = maxColRowChanged || this._maxCols != intVal;
                    this._maxCols = intVal < 0 ? 0 : intVal;
                    break;
                case 'visible_rows':
                    this._visibleRows = Math.max(intVal, 0);
                    break;
                case 'visible_cols':
                    this._visibleCols = Math.max(intVal, 0);
                    break;
                case 'min_rows':
                    this.minRows = Math.max(intVal, 1);
                    break;
                case 'min_cols':
                    this.minCols = Math.max(intVal, 1);
                    break;
                case 'min_height':
                    this.minHeight = Math.max(intVal, 1);
                    break;
                case 'min_width':
                    this.minWidth = Math.max(intVal, 1);
                    break;
                case 'zoom_on_drag':
                    this._zoomOnDrag = val ? true : false;
                    break;
                case 'cascade':
                    if (this.cascade != val) {
                        this.cascade = val;
                        this._cascadeGrid();
                    }
                    break;
                case 'fix_to_grid':
                    this._fixToGrid = val ? true : false;
                    break;
                case 'maintain_ratio':
                    this._maintainRatio = val ? true : false;
                    break;
                case 'prefer_new':
                    this._preferNew = val ? true : false;
                    break;
                case 'limit_to_screen':
                    this._limitToScreen = val ? true : false;
                case 'enable_collision_detection':
                    this._enableCollisionDetection = val ? true : false;
                    break;
                case 'adjust_on_window_resize':
                    this._adjustOnWindowResize = val ? true : false;
                    break;
            }
        }
        if (this._maintainRatio) {
            if (this.colWidth && this.rowHeight) {
                this._aspectRatio = this.colWidth / this.rowHeight;
            }
            else {
                this._maintainRatio = false;
            }
        }
        if (maxColRowChanged) {
            if (this._maxCols > 0 && this._maxRows > 0) {
                switch (this.cascade) {
                    case 'left':
                    case 'right':
                        this._maxCols = 0;
                        break;
                    case 'up':
                    case 'down':
                    default:
                        this._maxRows = 0;
                        break;
                }
            }
            for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                var item = _a[_i];
                var pos = item.getGridPosition();
                var dims = item.getSize();
                this._removeFromGrid(item);
                if (this._maxCols > 0 && dims.x > this._maxCols) {
                    dims.x = this._maxCols;
                    item.setSize(dims);
                }
                else if (this._maxRows > 0 && dims.y > this._maxRows) {
                    dims.y = this._maxRows;
                    item.setSize(dims);
                }
                if (this._hasGridCollision(pos, dims) || !this._isWithinBounds(pos, dims)) {
                    var newPosition = this._fixGridPosition(pos, dims);
                    item.setGridPosition(newPosition);
                }
                this._addToGrid(item);
            }
            this._cascadeGrid();
        }
        this._calculateRowHeight();
        this._calculateColWidth();
        var maxWidth = this._maxCols * this.colWidth;
        var maxHeight = this._maxRows * this.rowHeight;
        if (maxWidth > 0 && this.minWidth > maxWidth)
            this.minWidth = 0.75 * this.colWidth;
        if (maxHeight > 0 && this.minHeight > maxHeight)
            this.minHeight = 0.75 * this.rowHeight;
        if (this.minWidth > this.colWidth)
            this.minCols = Math.max(this.minCols, Math.ceil(this.minWidth / this.colWidth));
        if (this.minHeight > this.rowHeight)
            this.minRows = Math.max(this.minRows, Math.ceil(this.minHeight / this.rowHeight));
        if (this._maxCols > 0 && this.minCols > this._maxCols)
            this.minCols = 1;
        if (this._maxRows > 0 && this.minRows > this._maxRows)
            this.minRows = 1;
        this._updateRatio();
        for (var _b = 0, _c = this._items; _b < _c.length; _b++) {
            var item = _c[_b];
            this._removeFromGrid(item);
            item.setCascadeMode(this.cascade);
        }
        this._updateLimit();
        for (var _d = 0, _e = this._items; _d < _e.length; _d++) {
            var item = _e[_d];
            item.recalculateSelf();
            this._addToGrid(item);
        }
        this._cascadeGrid();
        this._updateSize();
    };
    NgGrid.prototype.getItemPosition = function (index) {
        return this._items[index].getGridPosition();
    };
    NgGrid.prototype.getItemSize = function (index) {
        return this._items[index].getSize();
    };
    NgGrid.prototype.ngDoCheck = function () {
        if (this._differ != null) {
            var changes = this._differ.diff(this._config);
            if (changes != null) {
                this._applyChanges(changes);
                return true;
            }
        }
        return false;
    };
    NgGrid.prototype.setMargins = function (margins) {
        this.marginTop = Math.max(parseInt(margins[0]), 0);
        this.marginRight = margins.length >= 2 ? Math.max(parseInt(margins[1]), 0) : this.marginTop;
        this.marginBottom = margins.length >= 3 ? Math.max(parseInt(margins[2]), 0) : this.marginTop;
        this.marginBottom = margins.length >= 3 ? Math.max(parseInt(margins[2]), 0) : this.marginTop;
        this.marginLeft = margins.length >= 4 ? Math.max(parseInt(margins[3]), 0) : this.marginRight;
    };
    NgGrid.prototype.enableDrag = function () {
        this.dragEnable = true;
    };
    NgGrid.prototype.disableDrag = function () {
        this.dragEnable = false;
    };
    NgGrid.prototype.enableResize = function () {
        this.resizeEnable = true;
    };
    NgGrid.prototype.disableResize = function () {
        this.resizeEnable = false;
    };
    NgGrid.prototype.addItem = function (ngItem) {
        ngItem.setCascadeMode(this.cascade);
        if (!this._preferNew) {
            var newPos = this._fixGridPosition(ngItem.getGridPosition(), ngItem.getSize());
            ngItem.savePosition(newPos);
        }
        this._items.push(ngItem);
        this._addToGrid(ngItem);
        ngItem.recalculateSelf();
        ngItem.onCascadeEvent();
        this._emitOnItemChange();
    };
    NgGrid.prototype.removeItem = function (ngItem) {
        this._removeFromGrid(ngItem);
        for (var x = 0; x < this._items.length; x++) {
            if (this._items[x] == ngItem) {
                this._items.splice(x, 1);
            }
        }
        if (this._destroyed)
            return;
        this._cascadeGrid();
        this._updateSize();
        this._items.forEach(function (item) { return item.recalculateSelf(); });
        this._emitOnItemChange();
    };
    NgGrid.prototype.updateItem = function (ngItem) {
        this._removeFromGrid(ngItem);
        this._addToGrid(ngItem);
        this._cascadeGrid();
        this._updateSize();
        ngItem.onCascadeEvent();
    };
    NgGrid.prototype.triggerCascade = function () {
        this._cascadeGrid(null, null, false);
    };
    NgGrid.prototype.resizeEventHandler = function (e) {
        if (!this._adjustOnWindowResize) {
            return;
        }
        this._calculateColWidth();
        this._calculateRowHeight();
        this._updateRatio();
        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
            var item = _a[_i];
            this._removeFromGrid(item);
        }
        this._updateLimit();
        for (var _b = 0, _c = this._items; _b < _c.length; _b++) {
            var item = _c[_b];
            this._addToGrid(item);
            item.recalculateSelf();
        }
        this._updateSize();
    };
    NgGrid.prototype.mouseDownEventHandler = function (e) {
        var mousePos = this._getMousePosition(e);
        var item = this._getItemFromPosition(mousePos);
        if (item != null) {
            if (this.resizeEnable && item.canResize(e)) {
                this._resizeReady = true;
            }
            else if (this.dragEnable && item.canDrag(e)) {
                this._dragReady = true;
            }
        }
        return true;
    };
    NgGrid.prototype.mouseUpEventHandler = function (e) {
        if (this.isDragging) {
            this._dragStop(e);
            return false;
        }
        else if (this.isResizing) {
            this._resizeStop(e);
            return false;
        }
        else if (this._dragReady || this._resizeReady) {
            this._dragReady = false;
            this._resizeReady = false;
        }
        return true;
    };
    NgGrid.prototype.mouseMoveEventHandler = function (e) {
        if (this._resizeReady) {
            this._resizeStart(e);
            return false;
        }
        else if (this._dragReady) {
            this._dragStart(e);
            return false;
        }
        if (this.isDragging) {
            this._drag(e);
            return false;
        }
        else if (this.isResizing) {
            this._resize(e);
            return false;
        }
        else {
            var mousePos = this._getMousePosition(e);
            var item = this._getItemFromPosition(mousePos);
            if (item) {
                item.onMouseMove(e);
            }
        }
        return true;
    };
    //	Private methods
    NgGrid.prototype._calculateColWidth = function () {
        if (this._autoResize) {
            if (this._maxCols > 0 || this._visibleCols > 0) {
                var maxCols = this._maxCols > 0 ? this._maxCols : this._visibleCols;
                var maxWidth = this._ngEl.nativeElement.getBoundingClientRect().width;
                var colWidth = Math.floor(maxWidth / maxCols);
                colWidth -= (this.marginLeft + this.marginRight);
                if (colWidth > 0)
                    this.colWidth = colWidth;
                if (this.colWidth < this.minWidth || this.minCols > this._config.min_cols) {
                    this.minCols = Math.max(this._config.min_cols, Math.ceil(this.minWidth / this.colWidth));
                }
            }
        }
    };
    NgGrid.prototype._calculateRowHeight = function () {
        if (this._autoResize) {
            if (this._maxRows > 0 || this._visibleRows > 0) {
                var maxRows = this._maxRows > 0 ? this._maxRows : this._visibleRows;
                var maxHeight = window.innerHeight - this.marginTop - this.marginBottom;
                var rowHeight = Math.max(Math.floor(maxHeight / maxRows), this.minHeight);
                rowHeight -= (this.marginTop + this.marginBottom);
                if (rowHeight > 0)
                    this.rowHeight = rowHeight;
                if (this.rowHeight < this.minHeight || this.minRows > this._config.min_rows) {
                    this.minRows = Math.max(this._config.min_rows, Math.ceil(this.minHeight / this.rowHeight));
                }
            }
        }
    };
    NgGrid.prototype._updateRatio = function () {
        if (this._autoResize && this._maintainRatio) {
            if (this._maxCols > 0 && this._visibleRows <= 0) {
                this.rowHeight = this.colWidth / this._aspectRatio;
            }
            else if (this._maxRows > 0 && this._visibleCols <= 0) {
                this.colWidth = this._aspectRatio * this.rowHeight;
            }
            else if (this._maxCols == 0 && this._maxRows == 0) {
                if (this._visibleCols > 0) {
                    this.rowHeight = this.colWidth / this._aspectRatio;
                }
                else if (this._visibleRows > 0) {
                    this.colWidth = this._aspectRatio * this.rowHeight;
                }
            }
        }
    };
    NgGrid.prototype._updateLimit = function () {
        if (!this._autoResize && this._limitToScreen) {
            this._limitGrid(this._getContainerColumns());
        }
    };
    NgGrid.prototype._applyChanges = function (changes) {
        var _this = this;
        changes.forEachAddedItem(function (record) { _this._config[record.key] = record.currentValue; });
        changes.forEachChangedItem(function (record) { _this._config[record.key] = record.currentValue; });
        changes.forEachRemovedItem(function (record) { delete _this._config[record.key]; });
        this.setConfig(this._config);
    };
    NgGrid.prototype._resizeStart = function (e) {
        if (this.resizeEnable) {
            var mousePos = this._getMousePosition(e);
            var item = this._getItemFromPosition(mousePos);
            if (!item) {
                return;
            }
            item.startMoving();
            this._resizingItem = item;
            this._resizeDirection = item.canResize(e);
            this._removeFromGrid(item);
            this._createPlaceholder(item);
            this.isResizing = true;
            this._resizeReady = false;
            this.onResizeStart.emit(item);
            item.onResizeStartEvent();
        }
    };
    NgGrid.prototype._dragStart = function (e) {
        if (this.dragEnable) {
            var mousePos = this._getMousePosition(e);
            var item = this._getItemFromPosition(mousePos);
            var itemPos = item.getPosition();
            if (!itemPos || !item) {
                return;
            }
            var pOffset = { 'left': (mousePos.left - itemPos.left), 'top': (mousePos.top - itemPos.top) };
            item.startMoving();
            this._draggingItem = item;
            this._posOffset = pOffset;
            this._removeFromGrid(item);
            this._createPlaceholder(item);
            this.isDragging = true;
            this._dragReady = false;
            this.onDragStart.emit(item);
            item.onDragStartEvent();
            if (this._zoomOnDrag) {
                this._zoomOut();
            }
        }
    };
    NgGrid.prototype._zoomOut = function () {
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'scale(0.5, 0.5)');
    };
    NgGrid.prototype._resetZoom = function () {
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', '');
    };
    NgGrid.prototype._drag = function (e) {
        if (this.isDragging) {
            if (window.getSelection) {
                if (window.getSelection().empty) {
                    window.getSelection().empty();
                }
                else if (window.getSelection().removeAllRanges) {
                    window.getSelection().removeAllRanges();
                }
            }
            else if (document.selection) {
                document.selection.empty();
            }
            var mousePos = this._getMousePosition(e);
            var newL = (mousePos.left - this._posOffset.left);
            var newT = (mousePos.top - this._posOffset.top);
            var itemPos = this._draggingItem.getGridPosition();
            var gridPos = this._calculateGridPosition(newL, newT);
            var dims = this._draggingItem.getSize();
            if (!itemPos) {
                return;
            }
            if (!this._isWithinBoundsX(gridPos, dims))
                gridPos.col = this._maxCols - (dims.x - 1);
            if (!this._isWithinBoundsY(gridPos, dims))
                gridPos.row = this._maxRows - (dims.y - 1);
            if (!this._autoResize && this._limitToScreen) {
                if ((gridPos.col + dims.x - 1) > this._getContainerColumns()) {
                    gridPos.col = this._getContainerColumns() - (dims.x - 1);
                }
            }
            if (gridPos.col != itemPos.col || gridPos.row != itemPos.row) {
                this._draggingItem.setGridPosition(gridPos, this._fixToGrid);
                this._placeholderRef.instance.setGridPosition(gridPos);
                if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
                    this._fixGridCollisions(gridPos, dims, true);
                    this._cascadeGrid(gridPos, dims);
                }
            }
            if (!this._fixToGrid) {
                this._draggingItem.setPosition(newL, newT);
            }
            this.onDrag.emit(this._draggingItem);
            this._draggingItem.onDragEvent();
        }
    };
    NgGrid.prototype._resize = function (e) {
        if (this.isResizing) {
            if (window.getSelection) {
                if (window.getSelection().empty) {
                    window.getSelection().empty();
                }
                else if (window.getSelection().removeAllRanges) {
                    window.getSelection().removeAllRanges();
                }
            }
            else if (document.selection) {
                document.selection.empty();
            }
            var mousePos = this._getMousePosition(e);
            var itemPos = this._resizingItem.getPosition();
            var itemDims = this._resizingItem.getDimensions();
            if (!itemPos) {
                return;
            }
            var newW = this._resizeDirection == 'height' ? itemDims.width : (mousePos.left - itemPos.left + 10);
            var newH = this._resizeDirection == 'width' ? itemDims.height : (mousePos.top - itemPos.top + 10);
            if (newW < this.minWidth)
                newW = this.minWidth;
            if (newH < this.minHeight)
                newH = this.minHeight;
            if (newW < this._resizingItem.minWidth)
                newW = this._resizingItem.minWidth;
            if (newH < this._resizingItem.minHeight)
                newH = this._resizingItem.minHeight;
            var calcSize = this._calculateGridSize(newW, newH);
            var itemSize = this._resizingItem.getSize();
            var iGridPos = this._resizingItem.getGridPosition();
            if (!this._isWithinBoundsX(iGridPos, calcSize))
                calcSize.x = (this._maxCols - iGridPos.col) + 1;
            if (!this._isWithinBoundsY(iGridPos, calcSize))
                calcSize.y = (this._maxRows - iGridPos.row) + 1;
            calcSize = this._resizingItem.fixResize(calcSize);
            if (calcSize.x != itemSize.x || calcSize.y != itemSize.y) {
                this._resizingItem.setSize(calcSize, false);
                this._placeholderRef.instance.setSize(calcSize);
                if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
                    this._fixGridCollisions(iGridPos, calcSize, true);
                    this._cascadeGrid(iGridPos, calcSize);
                }
            }
            if (!this._fixToGrid)
                this._resizingItem.setDimensions(newW, newH);
            var bigGrid = this._maxGridSize(itemPos.left + newW + (2 * e.movementX), itemPos.top + newH + (2 * e.movementY));
            if (this._resizeDirection == 'height')
                bigGrid.x = iGridPos.col + itemSize.x;
            if (this._resizeDirection == 'width')
                bigGrid.y = iGridPos.row + itemSize.y;
            this.onResize.emit(this._resizingItem);
            this._resizingItem.onResizeEvent();
        }
    };
    NgGrid.prototype._dragStop = function (e) {
        if (this.isDragging) {
            this.isDragging = false;
            var itemPos = this._draggingItem.getGridPosition();
            this._draggingItem.savePosition(itemPos);
            this._addToGrid(this._draggingItem);
            this._cascadeGrid();
            this._draggingItem.stopMoving();
            this._draggingItem.onDragStopEvent();
            this.onDragStop.emit(this._draggingItem);
            this._draggingItem = null;
            this._posOffset = null;
            this._placeholderRef.destroy();
            this._emitOnItemChange();
            if (this._zoomOnDrag) {
                this._resetZoom();
            }
        }
    };
    NgGrid.prototype._resizeStop = function (e) {
        if (this.isResizing) {
            this.isResizing = false;
            var itemDims = this._resizingItem.getSize();
            this._resizingItem.setSize(itemDims);
            this._addToGrid(this._resizingItem);
            this._cascadeGrid();
            this._resizingItem.stopMoving();
            this._resizingItem.onResizeStopEvent();
            this.onResizeStop.emit(this._resizingItem);
            this._resizingItem = null;
            this._resizeDirection = null;
            this._placeholderRef.destroy();
            this._emitOnItemChange();
        }
    };
    NgGrid.prototype._maxGridSize = function (w, h) {
        var sizex = Math.ceil(w / (this.colWidth + this.marginLeft + this.marginRight));
        var sizey = Math.ceil(h / (this.rowHeight + this.marginTop + this.marginBottom));
        return { 'x': sizex, 'y': sizey };
    };
    NgGrid.prototype._calculateGridSize = function (width, height) {
        width += this.marginLeft + this.marginRight;
        height += this.marginTop + this.marginBottom;
        var sizex = Math.max(this.minCols, Math.round(width / (this.colWidth + this.marginLeft + this.marginRight)));
        var sizey = Math.max(this.minRows, Math.round(height / (this.rowHeight + this.marginTop + this.marginBottom)));
        if (!this._isWithinBoundsX({ col: 1, row: 1 }, { x: sizex, y: sizey }))
            sizex = this._maxCols;
        if (!this._isWithinBoundsY({ col: 1, row: 1 }, { x: sizex, y: sizey }))
            sizey = this._maxRows;
        return { 'x': sizex, 'y': sizey };
    };
    NgGrid.prototype._calculateGridPosition = function (left, top) {
        var col = Math.max(1, Math.round(left / (this.colWidth + this.marginLeft + this.marginRight)) + 1);
        var row = Math.max(1, Math.round(top / (this.rowHeight + this.marginTop + this.marginBottom)) + 1);
        if (!this._isWithinBoundsX({ col: col, row: row }, { x: 1, y: 1 }))
            col = this._maxCols;
        if (!this._isWithinBoundsY({ col: col, row: row }, { x: 1, y: 1 }))
            row = this._maxRows;
        return { 'col': col, 'row': row };
    };
    NgGrid.prototype._hasGridCollision = function (pos, dims) {
        var positions = this._getCollisions(pos, dims);
        if (positions == null || positions.length == 0)
            return false;
        return positions.some(function (v) {
            return !(v === null);
        });
    };
    NgGrid.prototype._getCollisions = function (pos, dims) {
        var returns = [];
        for (var j = 0; j < dims.y; j++) {
            if (this._itemGrid[pos.row + j] != null) {
                for (var i = 0; i < dims.x; i++) {
                    if (this._itemGrid[pos.row + j][pos.col + i] != null) {
                        var item = this._itemGrid[pos.row + j][pos.col + i];
                        if (returns.indexOf(item) < 0)
                            returns.push(item);
                        var itemPos = item.getGridPosition();
                        var itemDims = item.getSize();
                        i = itemPos.col + itemDims.x - pos.col;
                    }
                }
            }
        }
        return returns;
    };
    NgGrid.prototype._fixGridCollisions = function (pos, dims, shouldSave) {
        if (shouldSave === void 0) { shouldSave = false; }
        while (this._hasGridCollision(pos, dims)) {
            var collisions = this._getCollisions(pos, dims);
            this._removeFromGrid(collisions[0]);
            var itemPos = collisions[0].getGridPosition();
            var itemDims = collisions[0].getSize();
            switch (this.cascade) {
                case 'up':
                case 'down':
                default:
                    var oldRow = itemPos.row;
                    itemPos.row = pos.row + dims.y;
                    if (!this._isWithinBoundsY(itemPos, itemDims)) {
                        itemPos.col = pos.col + dims.x;
                        itemPos.row = oldRow;
                    }
                    break;
                case 'left':
                case 'right':
                    var oldCol = itemPos.col;
                    itemPos.col = pos.col + dims.x;
                    if (!this._isWithinBoundsX(itemPos, itemDims)) {
                        itemPos.col = oldCol;
                        itemPos.row = pos.row + dims.y;
                    }
                    break;
            }
            if (shouldSave) {
                collisions[0].savePosition(itemPos);
            }
            else {
                collisions[0].setGridPosition(itemPos);
            }
            this._fixGridCollisions(itemPos, itemDims, shouldSave);
            this._addToGrid(collisions[0]);
            collisions[0].onCascadeEvent();
        }
    };
    NgGrid.prototype._limitGrid = function (maxCols) {
        var items = this._items.slice();
        items.sort(function (a, b) {
            var aPos = a.getSavedPosition();
            var bPos = b.getSavedPosition();
            if (aPos.row == bPos.row) {
                return aPos.col == bPos.col ? 0 : (aPos.col < bPos.col ? -1 : 1);
            }
            else {
                return aPos.row < bPos.row ? -1 : 1;
            }
        });
        var columnMax = {};
        var largestGap = {};
        for (var i = 1; i <= maxCols; i++) {
            columnMax[i] = 1;
            largestGap[i] = 1;
        }
        var curPos = { col: 1, row: 1 };
        var currentRow = 1;
        var willCascade = function (item, col) {
            for (var i = col; i < col + item.sizex; i++) {
                if (columnMax[i] == currentRow)
                    return true;
            }
            return false;
        };
        while (items.length > 0) {
            var columns = [];
            var newBlock = {
                start: 1,
                end: 1,
                length: 0,
            };
            for (var col = 1; col <= maxCols; col++) {
                if (columnMax[col] <= currentRow) {
                    if (newBlock.length == 0) {
                        newBlock.start = col;
                    }
                    newBlock.length++;
                    newBlock.end = col + 1;
                }
                else if (newBlock.length > 0) {
                    columns.push(newBlock);
                    newBlock = {
                        start: col,
                        end: col,
                        length: 0,
                    };
                }
            }
            if (newBlock.length > 0) {
                columns.push(newBlock);
            }
            var tempColumns = columns.map(function (block) { return block.length; });
            var currentItems = [];
            while (items.length > 0) {
                var item = items[0];
                if (item.row > currentRow)
                    break;
                var fits = false;
                for (var x in tempColumns) {
                    if (item.sizex <= tempColumns[x]) {
                        tempColumns[x] -= item.sizex;
                        fits = true;
                        break;
                    }
                    else if (item.sizex > tempColumns[x]) {
                        tempColumns[x] = 0;
                    }
                }
                if (fits) {
                    currentItems.push(items.shift());
                }
                else {
                    break;
                }
            }
            if (currentItems.length > 0) {
                var itemPositions = [];
                var lastPosition = maxCols;
                for (var i = currentItems.length - 1; i >= 0; i--) {
                    var maxPosition = 1;
                    for (var j = columns.length - 1; j >= 0; j--) {
                        if (columns[j].start > lastPosition)
                            continue;
                        if (columns[j].start > (maxCols - currentItems[i].sizex))
                            continue;
                        if (columns[j].length < currentItems[i].sizex)
                            continue;
                        if (lastPosition < columns[j].end && (lastPosition - columns[j].start) < currentItems[i].sizex)
                            continue;
                        maxPosition = (lastPosition < columns[j].end ? lastPosition : columns[j].end) - currentItems[i].sizex;
                        break;
                    }
                    itemPositions[i] = Math.min(maxPosition, currentItems[i].row == currentRow ? currentItems[i].col : 1);
                    lastPosition = itemPositions[i];
                }
                var minPosition = 1;
                var currentItem = 0;
                while (currentItems.length > 0) {
                    var item = currentItems.shift();
                    for (var j = 0; j < columns.length; j++) {
                        if (columns[j].length < item.sizex)
                            continue;
                        if (minPosition > columns[j].end)
                            continue;
                        if (minPosition > columns[j].start && (columns[j].end - minPosition) < item.sizex)
                            continue;
                        if (minPosition < columns[j].start)
                            minPosition = columns[j].start;
                        break;
                    }
                    item.setGridPosition({ col: Math.max(minPosition, itemPositions[currentItem]), row: currentRow });
                    minPosition = item.currentCol + item.sizex;
                    currentItem++;
                    for (var i = item.currentCol; i < item.currentCol + item.sizex; i++) {
                        columnMax[i] = item.currentRow + item.sizey;
                    }
                }
            }
            else if (currentItems.length === 0 && columns.length === 1 && columns[0].length >= maxCols) {
                var item = items.shift();
                item.setGridPosition({ col: 1, row: currentRow });
                for (var i = item.currentCol; i < item.currentCol + item.sizex; i++) {
                    columnMax[i] = item.currentRow + item.sizey;
                }
            }
            var newRow = 0;
            for (var x in columnMax) {
                if (columnMax[x] > currentRow && (newRow == 0 || columnMax[x] < newRow)) {
                    newRow = columnMax[x];
                }
            }
            currentRow = newRow <= currentRow ? currentRow + 1 : newRow;
        }
    };
    NgGrid.prototype._cascadeGrid = function (pos, dims, shouldSave) {
        if (shouldSave === void 0) { shouldSave = true; }
        if (this._destroyed)
            return;
        if (pos && !dims)
            throw new Error('Cannot cascade with only position and not dimensions');
        if (this.isDragging && this._draggingItem && !pos && !dims) {
            pos = this._draggingItem.getGridPosition();
            dims = this._draggingItem.getSize();
        }
        else if (this.isResizing && this._resizingItem && !pos && !dims) {
            pos = this._resizingItem.getGridPosition();
            dims = this._resizingItem.getSize();
        }
        switch (this.cascade) {
            case 'up':
            case 'down':
                var lowRow = [0];
                for (var i = 1; i <= this._curMaxCol; i++)
                    lowRow[i] = 1;
                for (var r = 1; r <= this._curMaxRow; r++) {
                    if (this._itemGrid[r] == undefined)
                        continue;
                    for (var c = 1; c <= this._curMaxCol; c++) {
                        if (this._itemGrid[r] == undefined)
                            break;
                        if (r < lowRow[c])
                            continue;
                        if (this._itemGrid[r][c] != null) {
                            var item = this._itemGrid[r][c];
                            if (item.isFixed)
                                continue;
                            var itemDims = item.getSize();
                            var itemPos = item.getGridPosition();
                            if (itemPos.col != c || itemPos.row != r)
                                continue; //	If this is not the element's start
                            var lowest = lowRow[c];
                            for (var i = 1; i < itemDims.x; i++) {
                                lowest = Math.max(lowRow[(c + i)], lowest);
                            }
                            if (pos && (c + itemDims.x) > pos.col && c < (pos.col + dims.x)) {
                                if ((r >= pos.row && r < (pos.row + dims.y)) ||
                                    ((itemDims.y > (pos.row - lowest)) &&
                                        (r >= (pos.row + dims.y) && lowest < (pos.row + dims.y)))) {
                                    lowest = Math.max(lowest, pos.row + dims.y); //	Set the lowest row to be below it
                                }
                            }
                            var newPos = { col: c, row: lowest };
                            if (lowest != itemPos.row && this._isWithinBoundsY(newPos, itemDims)) {
                                this._removeFromGrid(item);
                                if (shouldSave) {
                                    item.savePosition(newPos);
                                }
                                else {
                                    item.setGridPosition(newPos);
                                }
                                item.onCascadeEvent();
                                this._addToGrid(item);
                            }
                            for (var i = 0; i < itemDims.x; i++) {
                                lowRow[c + i] = lowest + itemDims.y; //	Update the lowest row to be below the item
                            }
                        }
                    }
                }
                break;
            case 'left':
            case 'right':
                var lowCol = [0];
                for (var i = 1; i <= this._curMaxRow; i++)
                    lowCol[i] = 1;
                for (var r = 1; r <= this._curMaxRow; r++) {
                    if (this._itemGrid[r] == undefined)
                        continue;
                    for (var c = 1; c <= this._curMaxCol; c++) {
                        if (this._itemGrid[r] == undefined)
                            break;
                        if (c < lowCol[r])
                            continue;
                        if (this._itemGrid[r][c] != null) {
                            var item = this._itemGrid[r][c];
                            var itemDims = item.getSize();
                            var itemPos = item.getGridPosition();
                            if (itemPos.col != c || itemPos.row != r)
                                continue; //	If this is not the element's start
                            var lowest = lowCol[r];
                            for (var i = 1; i < itemDims.y; i++) {
                                lowest = Math.max(lowCol[(r + i)], lowest);
                            }
                            if (pos && (r + itemDims.y) > pos.row && r < (pos.row + dims.y)) {
                                if ((c >= pos.col && c < (pos.col + dims.x)) ||
                                    ((itemDims.x > (pos.col - lowest)) &&
                                        (c >= (pos.col + dims.x) && lowest < (pos.col + dims.x)))) {
                                    lowest = Math.max(lowest, pos.col + dims.x); //	Set the lowest col to be below it
                                }
                            }
                            var newPos = { col: lowest, row: r };
                            if (lowest != itemPos.col && this._isWithinBoundsX(newPos, itemDims)) {
                                this._removeFromGrid(item);
                                if (shouldSave) {
                                    item.savePosition(newPos);
                                }
                                else {
                                    item.setGridPosition(newPos);
                                }
                                item.onCascadeEvent();
                                this._addToGrid(item);
                            }
                            for (var i = 0; i < itemDims.y; i++) {
                                lowCol[r + i] = lowest + itemDims.x; //	Update the lowest col to be below the item
                            }
                        }
                    }
                }
                break;
            default:
                break;
        }
    };
    NgGrid.prototype._fixGridPosition = function (pos, dims) {
        while (this._hasGridCollision(pos, dims) || !this._isWithinBounds(pos, dims)) {
            if (this._hasGridCollision(pos, dims)) {
                switch (this.cascade) {
                    case 'up':
                    case 'down':
                    default:
                        pos.row++;
                        break;
                    case 'left':
                    case 'right':
                        pos.col++;
                        break;
                }
            }
            if (!this._isWithinBoundsY(pos, dims)) {
                pos.col++;
                pos.row = 1;
            }
            if (!this._isWithinBoundsX(pos, dims)) {
                pos.row++;
                pos.col = 1;
            }
        }
        return pos;
    };
    NgGrid.prototype._isWithinBoundsX = function (pos, dims) {
        return (this._maxCols == 0 || (pos.col + dims.x - 1) <= this._maxCols);
    };
    NgGrid.prototype._isWithinBoundsY = function (pos, dims) {
        return (this._maxRows == 0 || (pos.row + dims.y - 1) <= this._maxRows);
    };
    NgGrid.prototype._isWithinBounds = function (pos, dims) {
        return this._isWithinBoundsX(pos, dims) && this._isWithinBoundsY(pos, dims);
    };
    NgGrid.prototype._addToGrid = function (item) {
        if (!this._enableCollisionDetection) {
            return;
        }
        var pos = item.getGridPosition();
        var dims = item.getSize();
        if (this._hasGridCollision(pos, dims)) {
            this._fixGridCollisions(pos, dims);
            pos = item.getGridPosition();
        }
        for (var j = 0; j < dims.y; j++) {
            if (this._itemGrid[pos.row + j] == null)
                this._itemGrid[pos.row + j] = {};
            for (var i = 0; i < dims.x; i++) {
                this._itemGrid[pos.row + j][pos.col + i] = item;
                this._updateSize(pos.col + dims.x - 1, pos.row + dims.y - 1);
            }
        }
    };
    NgGrid.prototype._removeFromGrid = function (item) {
        for (var y in this._itemGrid)
            for (var x in this._itemGrid[y])
                if (this._itemGrid[y][x] == item)
                    delete this._itemGrid[y][x];
    };
    NgGrid.prototype._updateSize = function (col, row) {
        if (this._destroyed)
            return;
        col = (col == undefined) ? this._getMaxCol() : col;
        row = (row == undefined) ? this._getMaxRow() : row;
        var maxCol = Math.max(this._curMaxCol, col);
        var maxRow = Math.max(this._curMaxRow, row);
        if (maxCol != this._curMaxCol || maxRow != this._curMaxRow) {
            this._curMaxCol = maxCol;
            this._curMaxRow = maxRow;
        }
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'width', '100%'); //(maxCol * (this.colWidth + this.marginLeft + this.marginRight))+'px');
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'height', (this._getMaxRow() * (this.rowHeight + this.marginTop + this.marginBottom)) + 'px');
    };
    NgGrid.prototype._getMaxRow = function () {
        return Math.max.apply(null, this._items.map(function (item) { return item.getGridPosition().row + item.getSize().y - 1; }));
    };
    NgGrid.prototype._getMaxCol = function () {
        return Math.max.apply(null, this._items.map(function (item) { return item.getGridPosition().col + item.getSize().x - 1; }));
    };
    NgGrid.prototype._getMousePosition = function (e) {
        if ((window.TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
            e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
        }
        var refPos = this._ngEl.nativeElement.getBoundingClientRect();
        var left = e.clientX - refPos.left;
        var top = e.clientY - refPos.top;
        if (this.cascade == 'down')
            top = refPos.top + refPos.height - e.clientY;
        if (this.cascade == 'right')
            left = refPos.left + refPos.width - e.clientX;
        if (this.isDragging && this._zoomOnDrag) {
            left *= 2;
            top *= 2;
        }
        return {
            left: left,
            top: top
        };
    };
    NgGrid.prototype._getAbsoluteMousePosition = function (e) {
        if ((window.TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
            e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
        }
        return {
            left: e.clientX,
            top: e.clientY
        };
    };
    NgGrid.prototype._getContainerColumns = function () {
        var maxWidth = this._ngEl.nativeElement.getBoundingClientRect().width;
        return Math.floor(maxWidth / (this.colWidth + this.marginLeft + this.marginRight));
    };
    NgGrid.prototype._getItemFromPosition = function (position) {
        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
            var item = _a[_i];
            var size = item.getDimensions();
            var pos = item.getPosition();
            if (pos && position.left > (pos.left + this.marginLeft) && position.left < (pos.left + this.marginLeft + size.width) &&
                position.top > (pos.top + this.marginTop) && position.top < (pos.top + this.marginTop + size.height)) {
                return item;
            }
        }
        return null;
    };
    NgGrid.prototype._createPlaceholder = function (item) {
        var pos = item.getGridPosition();
        var dims = item.getSize();
        var factory = this.componentFactoryResolver.resolveComponentFactory(NgGridPlaceholder_1.NgGridPlaceholder);
        var componentRef = item.containerRef.createComponent(factory);
        this._placeholderRef = componentRef;
        var placeholder = componentRef.instance;
        placeholder.registerGrid(this);
        placeholder.setCascadeMode(this.cascade);
        placeholder.setGridPosition({ col: pos.col, row: pos.row });
        placeholder.setSize({ x: dims.x, y: dims.y });
    };
    NgGrid.prototype._emitOnItemChange = function () {
        this.onItemChange.emit(this._items.map(function (item) { return item.getEventOutput(); }));
    };
    //	Default config
    NgGrid.CONST_DEFAULT_CONFIG = {
        margins: [10],
        draggable: true,
        resizable: true,
        max_cols: 0,
        max_rows: 0,
        visible_cols: 0,
        visible_rows: 0,
        col_width: 250,
        row_height: 250,
        cascade: 'up',
        min_width: 100,
        min_height: 100,
        fix_to_grid: false,
        auto_style: true,
        auto_resize: false,
        maintain_ratio: false,
        prefer_new: false,
        zoom_on_drag: false,
        enable_collision_detection: true,
        adjust_on_window_resize: true
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onDragStart", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onDrag", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onDragStop", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onResizeStart", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onResize", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onResizeStop", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onItemChange", void 0);
    NgGrid = __decorate([
        core_1.Directive({
            selector: '[ngGrid]',
            inputs: ['config: ngGrid'],
            host: {
                '(mousedown)': 'mouseDownEventHandler($event)',
                '(mousemove)': 'mouseMoveEventHandler($event)',
                '(mouseup)': 'mouseUpEventHandler($event)',
                '(touchstart)': 'mouseDownEventHandler($event)',
                '(touchmove)': 'mouseMoveEventHandler($event)',
                '(touchend)': 'mouseUpEventHandler($event)',
                '(window:resize)': 'resizeEventHandler($event)',
                '(document:mousemove)': 'mouseMoveEventHandler($event)',
                '(document:mouseup)': 'mouseUpEventHandler($event)'
            },
        }), 
        __metadata('design:paramtypes', [core_1.KeyValueDiffers, core_1.ElementRef, core_1.Renderer, core_1.ComponentFactoryResolver, core_1.ViewContainerRef])
    ], NgGrid);
    return NgGrid;
}());
exports.NgGrid = NgGrid;

//# sourceMappingURL=data:application/json;base64,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QUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNkLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztZQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUMzQixDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNiLENBQUM7SUFFTSxzQ0FBcUIsR0FBNUIsVUFBNkIsQ0FBTTtRQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNkLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUs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QkFFM0QsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0NBQUMsUUFBUSxDQUFDLENBQUMscUNBQXFDOzRCQUV6RixJQUFJLE1BQU0sR0FBVyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBRS9CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dDQUM3QyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQzs0QkFDNUMsQ0FBQzs0QkFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNqRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUMzQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUM7d0NBQ2pDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDN0QsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFH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T0FBTyxFQUFFLElBQUk7UUFDYixTQUFTLEVBQUUsR0FBRztRQUNkLFVBQVUsRUFBRSxHQUFHO1FBQ2YsV0FBVyxFQUFFLEtBQUs7UUFDbEIsVUFBVSxFQUFFLElBQUk7UUFDaEIsV0FBVyxFQUFFLEtBQUs7UUFDbEIsY0FBYyxFQUFFLEtBQUs7UUFDckIsVUFBVSxFQUFFLEtBQUs7UUFDakIsWUFBWSxFQUFFLEtBQUs7UUFDbkIsMEJBQTBCLEVBQUUsSUFBSTtRQUNoQyx1QkFBdUIsRUFBRSxJQUFJO0tBQzdCLENBQUM7SUFqRkY7UUFBQyxhQUFNLEVBQUU7OytDQUFBO0lBQ1Q7UUFBQyxhQUFNLEVBQUU7OzBDQUFBO0lBQ1Q7UUFBQyxhQUFNLEVBQUU7OzhDQUFBO0lBQ1Q7UUFBQyxhQUFNLEVBQUU7O2lEQUFBO0lBQ1Q7UUFBQyxhQUFNLEVBQUU7OzRDQUFBO0lBQ1Q7UUFBQyxhQUFNLEVBQUU7O2dEQUFBO0lBQ1Q7UUFBQyxhQUFNLEVBQUU7O2dEQUFBO0lBdkJWO1FBQUMsZ0JBQVMsQ0FBQztZQUNWLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLE1BQU0sRUFBRSxDQUFDLGdCQUFnQixDQUFDO1lBQzFCLElBQUksRUFBRTtnQkFDTCxhQUFhLEVBQUUsK0JBQStCO2dCQUM5QyxhQUFhLEVBQUUsK0JBQStCO2dCQUM5QyxXQUFXLEVBQUUsNkJBQTZCO2dCQUMxQyxjQUFjLEVBQUUsK0JBQStCO2dCQUMvQyxhQUFhLEVBQUUsK0JBQStCO2dCQUM5QyxZQUFZLEVBQUUsNkJBQTZCO2dCQUMzQyxpQkFBaUIsRUFBRSw0QkFBNEI7Z0JBQy9DLHNCQUFzQixFQUFFLCtCQUErQjtnQkFDdkQsb0JBQW9CLEVBQUUsNkJBQTZCO2FBQ25EO1NBQ0QsQ0FBQzs7Y0FBQTtJQWd5Q0YsYUFBQztBQUFELENBL3hDQSxBQSt4Q0MsSUFBQTtBQS94Q1ksY0FBTSxTQSt4Q2xCLENBQUEiLCJmaWxlIjoiZGlyZWN0aXZlcy9OZ0dyaWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgUmVuZGVyZXIsIEV2ZW50RW1pdHRlciwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBIb3N0LCBWaWV3RW5jYXBzdWxhdGlvbiwgVHlwZSwgQ29tcG9uZW50UmVmLCBLZXlWYWx1ZURpZmZlciwgS2V5VmFsdWVEaWZmZXJzLCBPbkluaXQsIE9uRGVzdHJveSwgRG9DaGVjaywgVmlld0NvbnRhaW5lclJlZiwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5nR3JpZENvbmZpZywgTmdHcmlkSXRlbUV2ZW50LCBOZ0dyaWRJdGVtUG9zaXRpb24sIE5nR3JpZEl0ZW1TaXplLCBOZ0dyaWRSYXdQb3NpdGlvbiwgTmdHcmlkSXRlbURpbWVuc2lvbnMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL0lOZ0dyaWQnO1xyXG5pbXBvcnQgeyBOZ0dyaWRJdGVtIH0gZnJvbSAnLi9OZ0dyaWRJdGVtJztcclxuaW1wb3J0IHsgTmdHcmlkUGxhY2Vob2xkZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL05nR3JpZFBsYWNlaG9sZGVyJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG5cdHNlbGVjdG9yOiAnW25nR3JpZF0nLFxyXG5cdGlucHV0czogWydjb25maWc6IG5nR3JpZCddLFxyXG5cdGhvc3Q6IHtcclxuXHRcdCcobW91c2Vkb3duKSc6ICdtb3VzZURvd25FdmVudEhhbmRsZXIoJGV2ZW50KScsXHJcblx0XHQnKG1vdXNlbW92ZSknOiAnbW91c2VNb3ZlRXZlbnRIYW5kbGVyKCRldmVudCknLFxyXG5cdFx0Jyhtb3VzZXVwKSc6ICdtb3VzZVVwRXZlbnRIYW5kbGVyKCRldmVudCknLFxyXG5cdFx0Jyh0b3VjaHN0YXJ0KSc6ICdtb3VzZURvd25FdmVudEhhbmRsZXIoJGV2ZW50KScsXHJcblx0XHQnKHRvdWNobW92ZSknOiAnbW91c2VNb3ZlRXZlbnRIYW5kbGVyKCRldmVudCknLFxyXG5cdFx0Jyh0b3VjaGVuZCknOiAnbW91c2VVcEV2ZW50SGFuZGxlcigkZXZlbnQpJyxcclxuXHRcdCcod2luZG93OnJlc2l6ZSknOiAncmVzaXplRXZlbnRIYW5kbGVyKCRldmVudCknLFxyXG5cdFx0Jyhkb2N1bWVudDptb3VzZW1vdmUpJzogJ21vdXNlTW92ZUV2ZW50SGFuZGxlcigkZXZlbnQpJyxcclxuXHRcdCcoZG9jdW1lbnQ6bW91c2V1cCknOiAnbW91c2VVcEV2ZW50SGFuZGxlcigkZXZlbnQpJ1xyXG5cdH0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ0dyaWQgaW1wbGVtZW50cyBPbkluaXQsIERvQ2hlY2ssIE9uRGVzdHJveSB7XHJcblx0Ly9cdEV2ZW50IEVtaXR0ZXJzXHJcblx0QE91dHB1dCgpIHB1YmxpYyBvbkRyYWdTdGFydDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25EcmFnOiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvbkRyYWdTdG9wOiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvblJlc2l6ZVN0YXJ0OiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvblJlc2l6ZTogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25SZXNpemVTdG9wOiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvbkl0ZW1DaGFuZ2U6IEV2ZW50RW1pdHRlcjxBcnJheTxOZ0dyaWRJdGVtRXZlbnQ+PiA9IG5ldyBFdmVudEVtaXR0ZXI8QXJyYXk8TmdHcmlkSXRlbUV2ZW50Pj4oKTtcclxuXHJcblx0Ly9cdFB1YmxpYyB2YXJpYWJsZXNcclxuXHRwdWJsaWMgY29sV2lkdGg6IG51bWJlciA9IDI1MDtcclxuXHRwdWJsaWMgcm93SGVpZ2h0OiBudW1iZXIgPSAyNTA7XHJcblx0cHVibGljIG1pbkNvbHM6IG51bWJlciA9IDE7XHJcblx0cHVibGljIG1pblJvd3M6IG51bWJlciA9IDE7XHJcblx0cHVibGljIG1hcmdpblRvcDogbnVtYmVyID0gMTA7XHJcblx0cHVibGljIG1hcmdpblJpZ2h0OiBudW1iZXIgPSAxMDtcclxuXHRwdWJsaWMgbWFyZ2luQm90dG9tOiBudW1iZXIgPSAxMDtcclxuXHRwdWJsaWMgbWFyZ2luTGVmdDogbnVtYmVyID0gMTA7XHJcblx0cHVibGljIGlzRHJhZ2dpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwdWJsaWMgaXNSZXNpemluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHB1YmxpYyBhdXRvU3R5bGU6IGJvb2xlYW4gPSB0cnVlO1xyXG5cdHB1YmxpYyByZXNpemVFbmFibGU6IGJvb2xlYW4gPSB0cnVlO1xyXG5cdHB1YmxpYyBkcmFnRW5hYmxlOiBib29sZWFuID0gdHJ1ZTtcclxuXHRwdWJsaWMgY2FzY2FkZTogc3RyaW5nID0gJ3VwJztcclxuXHRwdWJsaWMgbWluV2lkdGg6IG51bWJlciA9IDEwMDtcclxuXHRwdWJsaWMgbWluSGVpZ2h0OiBudW1iZXIgPSAxMDA7XHJcblxyXG5cdC8vXHRQcml2YXRlIHZhcmlhYmxlc1xyXG5cdHByaXZhdGUgX2l0ZW1zOiBBcnJheTxOZ0dyaWRJdGVtPiA9IFtdO1xyXG5cdHByaXZhdGUgX2RyYWdnaW5nSXRlbTogTmdHcmlkSXRlbSA9IG51bGw7XHJcblx0cHJpdmF0ZSBfcmVzaXppbmdJdGVtOiBOZ0dyaWRJdGVtID0gbnVsbDtcclxuXHRwcml2YXRlIF9yZXNpemVEaXJlY3Rpb246IHN0cmluZyA9IG51bGw7XHJcblx0cHJpdmF0ZSBfaXRlbUdyaWQ6IHsgW2tleTogbnVtYmVyXTogeyBba2V5OiBudW1iZXJdOiBOZ0dyaWRJdGVtIH0gfSA9IHt9Oy8veyAxOiB7IDE6IG51bGwgfSB9O1xyXG5cdHByaXZhdGUgX2NvbnRhaW5lcldpZHRoOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfY29udGFpbmVySGVpZ2h0OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfbWF4Q29sczogbnVtYmVyID0gMDtcclxuXHRwcml2YXRlIF9tYXhSb3dzOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX3Zpc2libGVDb2xzOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX3Zpc2libGVSb3dzOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX3NldFdpZHRoOiBudW1iZXIgPSAyNTA7XHJcblx0cHJpdmF0ZSBfc2V0SGVpZ2h0OiBudW1iZXIgPSAyNTA7XHJcblx0cHJpdmF0ZSBfcG9zT2Zmc2V0OiBOZ0dyaWRSYXdQb3NpdGlvbiA9IG51bGw7XHJcblx0cHJpdmF0ZSBfYWRkaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfcGxhY2Vob2xkZXJSZWY6IENvbXBvbmVudFJlZjxOZ0dyaWRQbGFjZWhvbGRlcj4gPSBudWxsO1xyXG5cdHByaXZhdGUgX2ZpeFRvR3JpZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX2F1dG9SZXNpemU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9kaWZmZXI6IEtleVZhbHVlRGlmZmVyO1xyXG5cdHByaXZhdGUgX2Rlc3Ryb3llZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX21haW50YWluUmF0aW86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9hc3BlY3RSYXRpbzogbnVtYmVyO1xyXG5cdHByaXZhdGUgX3ByZWZlck5ldzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX3pvb21PbkRyYWc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9saW1pdFRvU2NyZWVuOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfY3VyTWF4Um93OiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX2N1ck1heENvbDogbnVtYmVyID0gMDtcclxuXHRwcml2YXRlIF9kcmFnUmVhZHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9yZXNpemVSZWFkeTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX2VuYWJsZUNvbGxpc2lvbkRldGVjdGlvbjogYm9vbGVhbiA9IHRydWU7XHJcblx0cHJpdmF0ZSBfYWRqdXN0T25XaW5kb3dSZXNpemU6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuXHQvL1x0RGVmYXVsdCBjb25maWdcclxuXHRwcml2YXRlIHN0YXRpYyBDT05TVF9ERUZBVUxUX0NPTkZJRzogTmdHcmlkQ29uZmlnID0ge1xyXG5cdFx0bWFyZ2luczogWzEwXSxcclxuXHRcdGRyYWdnYWJsZTogdHJ1ZSxcclxuXHRcdHJlc2l6YWJsZTogdHJ1ZSxcclxuXHRcdG1heF9jb2xzOiAwLFxyXG5cdFx0bWF4X3Jvd3M6IDAsXHJcblx0XHR2aXNpYmxlX2NvbHM6IDAsXHJcblx0XHR2aXNpYmxlX3Jvd3M6IDAsXHJcblx0XHRjb2xfd2lkdGg6IDI1MCxcclxuXHRcdHJvd19oZWlnaHQ6IDI1MCxcclxuXHRcdGNhc2NhZGU6ICd1cCcsXHJcblx0XHRtaW5fd2lkdGg6IDEwMCxcclxuXHRcdG1pbl9oZWlnaHQ6IDEwMCxcclxuXHRcdGZpeF90b19ncmlkOiBmYWxzZSxcclxuXHRcdGF1dG9fc3R5bGU6IHRydWUsXHJcblx0XHRhdXRvX3Jlc2l6ZTogZmFsc2UsXHJcblx0XHRtYWludGFpbl9yYXRpbzogZmFsc2UsXHJcblx0XHRwcmVmZXJfbmV3OiBmYWxzZSxcclxuXHRcdHpvb21fb25fZHJhZzogZmFsc2UsXHJcblx0XHRlbmFibGVfY29sbGlzaW9uX2RldGVjdGlvbjogdHJ1ZSxcclxuXHRcdGFkanVzdF9vbl93aW5kb3dfcmVzaXplOiB0cnVlXHJcblx0fTtcclxuXHRwcml2YXRlIF9jb25maWcgPSBOZ0dyaWQuQ09OU1RfREVGQVVMVF9DT05GSUc7XHJcblxyXG5cdC8vXHRbbmctZ3JpZF0gYXR0cmlidXRlIGhhbmRsZXJcclxuXHRzZXQgY29uZmlnKHY6IE5nR3JpZENvbmZpZykge1xyXG5cdFx0dGhpcy5zZXRDb25maWcodik7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2RpZmZlciA9PSBudWxsICYmIHYgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLl9kaWZmZXIgPSB0aGlzLl9kaWZmZXJzLmZpbmQodGhpcy5fY29uZmlnKS5jcmVhdGUobnVsbCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvL1x0Q29uc3RydWN0b3JcclxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIF9kaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMsXHJcblx0XHRwcml2YXRlIF9uZ0VsOiBFbGVtZW50UmVmLFxyXG5cdFx0cHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyLFxyXG5cdFx0cHJpdmF0ZSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcclxuXHRcdHByaXZhdGUgX2NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikgeyB9XHJcblxyXG5cdC8vXHRQdWJsaWMgbWV0aG9kc1xyXG5cdHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcclxuXHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdncmlkJywgdHJ1ZSk7XHJcblx0XHRpZiAodGhpcy5hdXRvU3R5bGUpIHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xyXG5cdFx0dGhpcy5zZXRDb25maWcodGhpcy5fY29uZmlnKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0Q29uZmlnKGNvbmZpZzogTmdHcmlkQ29uZmlnKTogdm9pZCB7XHJcblx0XHR0aGlzLl9jb25maWcgPSBjb25maWc7XHJcblxyXG5cdFx0dmFyIG1heENvbFJvd0NoYW5nZWQgPSBmYWxzZTtcclxuXHRcdGZvciAodmFyIHggaW4gY29uZmlnKSB7XHJcblx0XHRcdHZhciB2YWwgPSBjb25maWdbeF07XHJcblx0XHRcdHZhciBpbnRWYWwgPSAhdmFsID8gMCA6IHBhcnNlSW50KHZhbCk7XHJcblxyXG5cdFx0XHRzd2l0Y2ggKHgpIHtcclxuXHRcdFx0XHRjYXNlICdtYXJnaW5zJzpcclxuXHRcdFx0XHRcdHRoaXMuc2V0TWFyZ2lucyh2YWwpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnY29sX3dpZHRoJzpcclxuXHRcdFx0XHRcdHRoaXMuY29sV2lkdGggPSBNYXRoLm1heChpbnRWYWwsIDEpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAncm93X2hlaWdodCc6XHJcblx0XHRcdFx0XHR0aGlzLnJvd0hlaWdodCA9IE1hdGgubWF4KGludFZhbCwgMSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdhdXRvX3N0eWxlJzpcclxuXHRcdFx0XHRcdHRoaXMuYXV0b1N0eWxlID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnYXV0b19yZXNpemUnOlxyXG5cdFx0XHRcdFx0dGhpcy5fYXV0b1Jlc2l6ZSA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2RyYWdnYWJsZSc6XHJcblx0XHRcdFx0XHR0aGlzLmRyYWdFbmFibGUgPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdyZXNpemFibGUnOlxyXG5cdFx0XHRcdFx0dGhpcy5yZXNpemVFbmFibGUgPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdtYXhfcm93cyc6XHJcblx0XHRcdFx0XHRtYXhDb2xSb3dDaGFuZ2VkID0gbWF4Q29sUm93Q2hhbmdlZCB8fCB0aGlzLl9tYXhSb3dzICE9IGludFZhbDtcclxuXHRcdFx0XHRcdHRoaXMuX21heFJvd3MgPSBpbnRWYWwgPCAwID8gMCA6IGludFZhbDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ21heF9jb2xzJzpcclxuXHRcdFx0XHRcdG1heENvbFJvd0NoYW5nZWQgPSBtYXhDb2xSb3dDaGFuZ2VkIHx8IHRoaXMuX21heENvbHMgIT0gaW50VmFsO1xyXG5cdFx0XHRcdFx0dGhpcy5fbWF4Q29scyA9IGludFZhbCA8IDAgPyAwIDogaW50VmFsO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAndmlzaWJsZV9yb3dzJzpcclxuXHRcdFx0XHRcdHRoaXMuX3Zpc2libGVSb3dzID0gTWF0aC5tYXgoaW50VmFsLCAwKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3Zpc2libGVfY29scyc6XHJcblx0XHRcdFx0XHR0aGlzLl92aXNpYmxlQ29scyA9IE1hdGgubWF4KGludFZhbCwgMCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdtaW5fcm93cyc6XHJcblx0XHRcdFx0XHR0aGlzLm1pblJvd3MgPSBNYXRoLm1heChpbnRWYWwsIDEpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnbWluX2NvbHMnOlxyXG5cdFx0XHRcdFx0dGhpcy5taW5Db2xzID0gTWF0aC5tYXgoaW50VmFsLCAxKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ21pbl9oZWlnaHQnOlxyXG5cdFx0XHRcdFx0dGhpcy5taW5IZWlnaHQgPSBNYXRoLm1heChpbnRWYWwsIDEpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnbWluX3dpZHRoJzpcclxuXHRcdFx0XHRcdHRoaXMubWluV2lkdGggPSBNYXRoLm1heChpbnRWYWwsIDEpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnem9vbV9vbl9kcmFnJzpcclxuXHRcdFx0XHRcdHRoaXMuX3pvb21PbkRyYWcgPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdjYXNjYWRlJzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmNhc2NhZGUgIT0gdmFsKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuY2FzY2FkZSA9IHZhbDtcclxuXHRcdFx0XHRcdFx0dGhpcy5fY2FzY2FkZUdyaWQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2ZpeF90b19ncmlkJzpcclxuXHRcdFx0XHRcdHRoaXMuX2ZpeFRvR3JpZCA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ21haW50YWluX3JhdGlvJzpcclxuXHRcdFx0XHRcdHRoaXMuX21haW50YWluUmF0aW8gPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdwcmVmZXJfbmV3JzpcclxuXHRcdFx0XHRcdHRoaXMuX3ByZWZlck5ldyA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2xpbWl0X3RvX3NjcmVlbic6XHJcblx0XHRcdFx0XHR0aGlzLl9saW1pdFRvU2NyZWVuID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdGNhc2UgJ2VuYWJsZV9jb2xsaXNpb25fZGV0ZWN0aW9uJzpcclxuXHRcdFx0XHRcdHRoaXMuX2VuYWJsZUNvbGxpc2lvbkRldGVjdGlvbiA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2FkanVzdF9vbl93aW5kb3dfcmVzaXplJzpcclxuXHRcdFx0XHRcdHRoaXMuX2FkanVzdE9uV2luZG93UmVzaXplID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fbWFpbnRhaW5SYXRpbykge1xyXG5cdFx0XHRpZiAodGhpcy5jb2xXaWR0aCAmJiB0aGlzLnJvd0hlaWdodCkge1xyXG5cdFx0XHRcdHRoaXMuX2FzcGVjdFJhdGlvID0gdGhpcy5jb2xXaWR0aCAvIHRoaXMucm93SGVpZ2h0O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuX21haW50YWluUmF0aW8gPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChtYXhDb2xSb3dDaGFuZ2VkKSB7XHJcblx0XHRcdGlmICh0aGlzLl9tYXhDb2xzID4gMCAmJiB0aGlzLl9tYXhSb3dzID4gMCkge1x0Ly9cdENhbid0IGhhdmUgYm90aCwgcHJpb3JpdGlzZSBvbiBjYXNjYWRlXHJcblx0XHRcdFx0c3dpdGNoICh0aGlzLmNhc2NhZGUpIHtcclxuXHRcdFx0XHRcdGNhc2UgJ2xlZnQnOlxyXG5cdFx0XHRcdFx0Y2FzZSAncmlnaHQnOlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9tYXhDb2xzID0gMDtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICd1cCc6XHJcblx0XHRcdFx0XHRjYXNlICdkb3duJzpcclxuXHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdHRoaXMuX21heFJvd3MgPSAwO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZvciAobGV0IGl0ZW0gb2YgdGhpcy5faXRlbXMpIHtcclxuXHRcdFx0XHR2YXIgcG9zID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdFx0XHR2YXIgZGltcyA9IGl0ZW0uZ2V0U2l6ZSgpO1xyXG5cclxuXHRcdFx0XHR0aGlzLl9yZW1vdmVGcm9tR3JpZChpdGVtKTtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuX21heENvbHMgPiAwICYmIGRpbXMueCA+IHRoaXMuX21heENvbHMpIHtcclxuXHRcdFx0XHRcdGRpbXMueCA9IHRoaXMuX21heENvbHM7XHJcblx0XHRcdFx0XHRpdGVtLnNldFNpemUoZGltcyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl9tYXhSb3dzID4gMCAmJiBkaW1zLnkgPiB0aGlzLl9tYXhSb3dzKSB7XHJcblx0XHRcdFx0XHRkaW1zLnkgPSB0aGlzLl9tYXhSb3dzO1xyXG5cdFx0XHRcdFx0aXRlbS5zZXRTaXplKGRpbXMpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuX2hhc0dyaWRDb2xsaXNpb24ocG9zLCBkaW1zKSB8fCAhdGhpcy5faXNXaXRoaW5Cb3VuZHMocG9zLCBkaW1zKSkge1xyXG5cdFx0XHRcdFx0dmFyIG5ld1Bvc2l0aW9uID0gdGhpcy5fZml4R3JpZFBvc2l0aW9uKHBvcywgZGltcyk7XHJcblx0XHRcdFx0XHRpdGVtLnNldEdyaWRQb3NpdGlvbihuZXdQb3NpdGlvbik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLl9hZGRUb0dyaWQoaXRlbSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX2Nhc2NhZGVHcmlkKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY2FsY3VsYXRlUm93SGVpZ2h0KCk7XHJcblx0XHR0aGlzLl9jYWxjdWxhdGVDb2xXaWR0aCgpO1xyXG5cclxuXHRcdHZhciBtYXhXaWR0aCA9IHRoaXMuX21heENvbHMgKiB0aGlzLmNvbFdpZHRoO1xyXG5cdFx0dmFyIG1heEhlaWdodCA9IHRoaXMuX21heFJvd3MgKiB0aGlzLnJvd0hlaWdodDtcclxuXHJcblx0XHRpZiAobWF4V2lkdGggPiAwICYmIHRoaXMubWluV2lkdGggPiBtYXhXaWR0aCkgdGhpcy5taW5XaWR0aCA9IDAuNzUgKiB0aGlzLmNvbFdpZHRoO1xyXG5cdFx0aWYgKG1heEhlaWdodCA+IDAgJiYgdGhpcy5taW5IZWlnaHQgPiBtYXhIZWlnaHQpIHRoaXMubWluSGVpZ2h0ID0gMC43NSAqIHRoaXMucm93SGVpZ2h0O1xyXG5cclxuXHRcdGlmICh0aGlzLm1pbldpZHRoID4gdGhpcy5jb2xXaWR0aCkgdGhpcy5taW5Db2xzID0gTWF0aC5tYXgodGhpcy5taW5Db2xzLCBNYXRoLmNlaWwodGhpcy5taW5XaWR0aCAvIHRoaXMuY29sV2lkdGgpKTtcclxuXHRcdGlmICh0aGlzLm1pbkhlaWdodCA+IHRoaXMucm93SGVpZ2h0KSB0aGlzLm1pblJvd3MgPSBNYXRoLm1heCh0aGlzLm1pblJvd3MsIE1hdGguY2VpbCh0aGlzLm1pbkhlaWdodCAvIHRoaXMucm93SGVpZ2h0KSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX21heENvbHMgPiAwICYmIHRoaXMubWluQ29scyA+IHRoaXMuX21heENvbHMpIHRoaXMubWluQ29scyA9IDE7XHJcblx0XHRpZiAodGhpcy5fbWF4Um93cyA+IDAgJiYgdGhpcy5taW5Sb3dzID4gdGhpcy5fbWF4Um93cykgdGhpcy5taW5Sb3dzID0gMTtcclxuXHJcblx0XHR0aGlzLl91cGRhdGVSYXRpbygpO1xyXG5cclxuXHRcdGZvciAobGV0IGl0ZW0gb2YgdGhpcy5faXRlbXMpIHtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblx0XHRcdGl0ZW0uc2V0Q2FzY2FkZU1vZGUodGhpcy5jYXNjYWRlKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl91cGRhdGVMaW1pdCgpO1xyXG5cclxuXHRcdGZvciAobGV0IGl0ZW0gb2YgdGhpcy5faXRlbXMpIHtcclxuXHRcdFx0aXRlbS5yZWNhbGN1bGF0ZVNlbGYoKTtcclxuXHRcdFx0dGhpcy5fYWRkVG9HcmlkKGl0ZW0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2Nhc2NhZGVHcmlkKCk7XHJcblx0XHR0aGlzLl91cGRhdGVTaXplKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0SXRlbVBvc2l0aW9uKGluZGV4OiBudW1iZXIpOiBOZ0dyaWRJdGVtUG9zaXRpb24ge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2l0ZW1zW2luZGV4XS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRJdGVtU2l6ZShpbmRleDogbnVtYmVyKTogTmdHcmlkSXRlbVNpemUge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2l0ZW1zW2luZGV4XS5nZXRTaXplKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgbmdEb0NoZWNrKCk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKHRoaXMuX2RpZmZlciAhPSBudWxsKSB7XHJcblx0XHRcdHZhciBjaGFuZ2VzID0gdGhpcy5fZGlmZmVyLmRpZmYodGhpcy5fY29uZmlnKTtcclxuXHJcblx0XHRcdGlmIChjaGFuZ2VzICE9IG51bGwpIHtcclxuXHRcdFx0XHR0aGlzLl9hcHBseUNoYW5nZXMoY2hhbmdlcyk7XHJcblxyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldE1hcmdpbnMobWFyZ2luczogQXJyYXk8c3RyaW5nPik6IHZvaWQge1xyXG5cdFx0dGhpcy5tYXJnaW5Ub3AgPSBNYXRoLm1heChwYXJzZUludChtYXJnaW5zWzBdKSwgMCk7XHJcblx0XHR0aGlzLm1hcmdpblJpZ2h0ID0gbWFyZ2lucy5sZW5ndGggPj0gMiA/IE1hdGgubWF4KHBhcnNlSW50KG1hcmdpbnNbMV0pLCAwKSA6IHRoaXMubWFyZ2luVG9wO1xyXG5cdFx0dGhpcy5tYXJnaW5Cb3R0b20gPSBtYXJnaW5zLmxlbmd0aCA+PSAzID8gTWF0aC5tYXgocGFyc2VJbnQobWFyZ2luc1syXSksIDApIDogdGhpcy5tYXJnaW5Ub3A7XHJcblx0XHR0aGlzLm1hcmdpbkJvdHRvbSA9IG1hcmdpbnMubGVuZ3RoID49IDMgPyBNYXRoLm1heChwYXJzZUludChtYXJnaW5zWzJdKSwgMCkgOiB0aGlzLm1hcmdpblRvcDtcclxuXHRcdHRoaXMubWFyZ2luTGVmdCA9IG1hcmdpbnMubGVuZ3RoID49IDQgPyBNYXRoLm1heChwYXJzZUludChtYXJnaW5zWzNdKSwgMCkgOiB0aGlzLm1hcmdpblJpZ2h0O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGVuYWJsZURyYWcoKTogdm9pZCB7XHJcblx0XHR0aGlzLmRyYWdFbmFibGUgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGRpc2FibGVEcmFnKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5kcmFnRW5hYmxlID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZW5hYmxlUmVzaXplKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5yZXNpemVFbmFibGUgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGRpc2FibGVSZXNpemUoKTogdm9pZCB7XHJcblx0XHR0aGlzLnJlc2l6ZUVuYWJsZSA9IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFkZEl0ZW0obmdJdGVtOiBOZ0dyaWRJdGVtKTogdm9pZCB7XHJcblx0XHRuZ0l0ZW0uc2V0Q2FzY2FkZU1vZGUodGhpcy5jYXNjYWRlKTtcclxuXHRcdGlmICghdGhpcy5fcHJlZmVyTmV3KSB7XHJcblx0XHRcdHZhciBuZXdQb3MgPSB0aGlzLl9maXhHcmlkUG9zaXRpb24obmdJdGVtLmdldEdyaWRQb3NpdGlvbigpLCBuZ0l0ZW0uZ2V0U2l6ZSgpKTtcclxuXHRcdFx0bmdJdGVtLnNhdmVQb3NpdGlvbihuZXdQb3MpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5faXRlbXMucHVzaChuZ0l0ZW0pO1xyXG5cdFx0dGhpcy5fYWRkVG9HcmlkKG5nSXRlbSk7XHJcblx0XHRuZ0l0ZW0ucmVjYWxjdWxhdGVTZWxmKCk7XHJcblx0XHRuZ0l0ZW0ub25DYXNjYWRlRXZlbnQoKTtcclxuXHRcdHRoaXMuX2VtaXRPbkl0ZW1DaGFuZ2UoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZW1vdmVJdGVtKG5nSXRlbTogTmdHcmlkSXRlbSk6IHZvaWQge1xyXG5cdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQobmdJdGVtKTtcclxuXHJcblx0XHRmb3IgKGxldCB4OiBudW1iZXIgPSAwOyB4IDwgdGhpcy5faXRlbXMubGVuZ3RoOyB4KyspIHtcclxuXHRcdFx0aWYgKHRoaXMuX2l0ZW1zW3hdID09IG5nSXRlbSkge1xyXG5cdFx0XHRcdHRoaXMuX2l0ZW1zLnNwbGljZSh4LCAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9kZXN0cm95ZWQpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9jYXNjYWRlR3JpZCgpO1xyXG5cdFx0dGhpcy5fdXBkYXRlU2l6ZSgpO1xyXG5cdFx0dGhpcy5faXRlbXMuZm9yRWFjaCgoaXRlbTogTmdHcmlkSXRlbSkgPT4gaXRlbS5yZWNhbGN1bGF0ZVNlbGYoKSk7XHJcblx0XHR0aGlzLl9lbWl0T25JdGVtQ2hhbmdlKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdXBkYXRlSXRlbShuZ0l0ZW06IE5nR3JpZEl0ZW0pOiB2b2lkIHtcclxuXHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKG5nSXRlbSk7XHJcblx0XHR0aGlzLl9hZGRUb0dyaWQobmdJdGVtKTtcclxuXHRcdHRoaXMuX2Nhc2NhZGVHcmlkKCk7XHJcblx0XHR0aGlzLl91cGRhdGVTaXplKCk7XHJcblx0XHRuZ0l0ZW0ub25DYXNjYWRlRXZlbnQoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB0cmlnZ2VyQ2FzY2FkZSgpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2Nhc2NhZGVHcmlkKG51bGwsIG51bGwsIGZhbHNlKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZXNpemVFdmVudEhhbmRsZXIoZTogYW55KTogdm9pZCB7XHJcblx0XHRpZighdGhpcy5fYWRqdXN0T25XaW5kb3dSZXNpemUpe1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY2FsY3VsYXRlQ29sV2lkdGgoKTtcclxuXHRcdHRoaXMuX2NhbGN1bGF0ZVJvd0hlaWdodCgpO1xyXG5cclxuXHRcdHRoaXMuX3VwZGF0ZVJhdGlvKCk7XHJcblxyXG5cdFx0Zm9yIChsZXQgaXRlbSBvZiB0aGlzLl9pdGVtcykge1xyXG5cdFx0XHR0aGlzLl9yZW1vdmVGcm9tR3JpZChpdGVtKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl91cGRhdGVMaW1pdCgpO1xyXG5cclxuXHRcdGZvciAobGV0IGl0ZW0gb2YgdGhpcy5faXRlbXMpIHtcclxuXHRcdFx0dGhpcy5fYWRkVG9HcmlkKGl0ZW0pO1xyXG5cdFx0XHRpdGVtLnJlY2FsY3VsYXRlU2VsZigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3VwZGF0ZVNpemUoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBtb3VzZURvd25FdmVudEhhbmRsZXIoZTogTW91c2VFdmVudCk6IGJvb2xlYW4ge1xyXG5cdFx0dmFyIG1vdXNlUG9zID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHRcdHZhciBpdGVtID0gdGhpcy5fZ2V0SXRlbUZyb21Qb3NpdGlvbihtb3VzZVBvcyk7XHJcblxyXG5cdFx0aWYgKGl0ZW0gIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAodGhpcy5yZXNpemVFbmFibGUgJiYgaXRlbS5jYW5SZXNpemUoZSkpIHtcclxuXHRcdFx0XHR0aGlzLl9yZXNpemVSZWFkeSA9IHRydWU7XHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5kcmFnRW5hYmxlICYmIGl0ZW0uY2FuRHJhZyhlKSkge1xyXG5cdFx0XHRcdHRoaXMuX2RyYWdSZWFkeSA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBtb3VzZVVwRXZlbnRIYW5kbGVyKGU6IGFueSk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKHRoaXMuaXNEcmFnZ2luZykge1xyXG5cdFx0XHR0aGlzLl9kcmFnU3RvcChlKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmlzUmVzaXppbmcpIHtcclxuXHRcdFx0dGhpcy5fcmVzaXplU3RvcChlKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLl9kcmFnUmVhZHkgfHwgdGhpcy5fcmVzaXplUmVhZHkpIHtcclxuXHRcdFx0dGhpcy5fZHJhZ1JlYWR5ID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuX3Jlc2l6ZVJlYWR5ID0gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgbW91c2VNb3ZlRXZlbnRIYW5kbGVyKGU6IGFueSk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKHRoaXMuX3Jlc2l6ZVJlYWR5KSB7XHJcblx0XHRcdHRoaXMuX3Jlc2l6ZVN0YXJ0KGUpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuX2RyYWdSZWFkeSkge1xyXG5cdFx0XHR0aGlzLl9kcmFnU3RhcnQoZSk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5pc0RyYWdnaW5nKSB7XHJcblx0XHRcdHRoaXMuX2RyYWcoZSk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5pc1Jlc2l6aW5nKSB7XHJcblx0XHRcdHRoaXMuX3Jlc2l6ZShlKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIG1vdXNlUG9zID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzLl9nZXRJdGVtRnJvbVBvc2l0aW9uKG1vdXNlUG9zKTtcclxuXHJcblx0XHRcdGlmIChpdGVtKSB7XHJcblx0XHRcdFx0aXRlbS5vbk1vdXNlTW92ZShlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0Ly9cdFByaXZhdGUgbWV0aG9kc1xyXG5cdHByaXZhdGUgX2NhbGN1bGF0ZUNvbFdpZHRoKCk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX2F1dG9SZXNpemUpIHtcclxuXHRcdFx0aWYgKHRoaXMuX21heENvbHMgPiAwIHx8IHRoaXMuX3Zpc2libGVDb2xzID4gMCkge1xyXG5cdFx0XHRcdHZhciBtYXhDb2xzID0gdGhpcy5fbWF4Q29scyA+IDAgPyB0aGlzLl9tYXhDb2xzIDogdGhpcy5fdmlzaWJsZUNvbHM7XHJcblx0XHRcdFx0dmFyIG1heFdpZHRoOiBudW1iZXIgPSB0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcblxyXG5cdFx0XHRcdHZhciBjb2xXaWR0aDogbnVtYmVyID0gTWF0aC5mbG9vcihtYXhXaWR0aCAvIG1heENvbHMpO1xyXG5cdFx0XHRcdGNvbFdpZHRoIC09ICh0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KTtcclxuXHRcdFx0XHRpZiAoY29sV2lkdGggPiAwKSB0aGlzLmNvbFdpZHRoID0gY29sV2lkdGg7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmNvbFdpZHRoIDwgdGhpcy5taW5XaWR0aCB8fCB0aGlzLm1pbkNvbHMgPiB0aGlzLl9jb25maWcubWluX2NvbHMpIHtcclxuXHRcdFx0XHRcdHRoaXMubWluQ29scyA9IE1hdGgubWF4KHRoaXMuX2NvbmZpZy5taW5fY29scywgTWF0aC5jZWlsKHRoaXMubWluV2lkdGggLyB0aGlzLmNvbFdpZHRoKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9jYWxjdWxhdGVSb3dIZWlnaHQoKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fYXV0b1Jlc2l6ZSkge1xyXG5cdFx0XHRpZiAodGhpcy5fbWF4Um93cyA+IDAgfHwgdGhpcy5fdmlzaWJsZVJvd3MgPiAwKSB7XHJcblx0XHRcdFx0dmFyIG1heFJvd3MgPSB0aGlzLl9tYXhSb3dzID4gMCA/IHRoaXMuX21heFJvd3MgOiB0aGlzLl92aXNpYmxlUm93cztcclxuXHRcdFx0XHR2YXIgbWF4SGVpZ2h0OiBudW1iZXIgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSB0aGlzLm1hcmdpblRvcCAtIHRoaXMubWFyZ2luQm90dG9tO1xyXG5cclxuXHRcdFx0XHR2YXIgcm93SGVpZ2h0OiBudW1iZXIgPSBNYXRoLm1heChNYXRoLmZsb29yKG1heEhlaWdodCAvIG1heFJvd3MpLCB0aGlzLm1pbkhlaWdodCk7XHJcblx0XHRcdFx0cm93SGVpZ2h0IC09ICh0aGlzLm1hcmdpblRvcCArIHRoaXMubWFyZ2luQm90dG9tKTtcclxuXHRcdFx0XHRpZiAocm93SGVpZ2h0ID4gMCkgdGhpcy5yb3dIZWlnaHQgPSByb3dIZWlnaHQ7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLnJvd0hlaWdodCA8IHRoaXMubWluSGVpZ2h0IHx8IHRoaXMubWluUm93cyA+IHRoaXMuX2NvbmZpZy5taW5fcm93cykge1xyXG5cdFx0XHRcdFx0dGhpcy5taW5Sb3dzID0gTWF0aC5tYXgodGhpcy5fY29uZmlnLm1pbl9yb3dzLCBNYXRoLmNlaWwodGhpcy5taW5IZWlnaHQgLyB0aGlzLnJvd0hlaWdodCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfdXBkYXRlUmF0aW8oKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fYXV0b1Jlc2l6ZSAmJiB0aGlzLl9tYWludGFpblJhdGlvKSB7XHJcblx0XHRcdGlmICh0aGlzLl9tYXhDb2xzID4gMCAmJiB0aGlzLl92aXNpYmxlUm93cyA8PSAwKSB7XHJcblx0XHRcdFx0dGhpcy5yb3dIZWlnaHQgPSB0aGlzLmNvbFdpZHRoIC8gdGhpcy5fYXNwZWN0UmF0aW87XHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5fbWF4Um93cyA+IDAgJiYgdGhpcy5fdmlzaWJsZUNvbHMgPD0gMCkge1xyXG5cdFx0XHRcdHRoaXMuY29sV2lkdGggPSB0aGlzLl9hc3BlY3RSYXRpbyAqIHRoaXMucm93SGVpZ2h0O1xyXG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuX21heENvbHMgPT0gMCAmJiB0aGlzLl9tYXhSb3dzID09IDApIHtcclxuXHRcdFx0XHRpZiAodGhpcy5fdmlzaWJsZUNvbHMgPiAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLnJvd0hlaWdodCA9IHRoaXMuY29sV2lkdGggLyB0aGlzLl9hc3BlY3RSYXRpbztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuX3Zpc2libGVSb3dzID4gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5jb2xXaWR0aCA9IHRoaXMuX2FzcGVjdFJhdGlvICogdGhpcy5yb3dIZWlnaHQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF91cGRhdGVMaW1pdCgpOiB2b2lkIHtcclxuXHRcdGlmICghdGhpcy5fYXV0b1Jlc2l6ZSAmJiB0aGlzLl9saW1pdFRvU2NyZWVuKSB7XHJcblx0XHRcdHRoaXMuX2xpbWl0R3JpZCh0aGlzLl9nZXRDb250YWluZXJDb2x1bW5zKCkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfYXBwbHlDaGFuZ2VzKGNoYW5nZXM6IGFueSk6IHZvaWQge1xyXG5cdFx0Y2hhbmdlcy5mb3JFYWNoQWRkZWRJdGVtKChyZWNvcmQ6IGFueSkgPT4geyB0aGlzLl9jb25maWdbcmVjb3JkLmtleV0gPSByZWNvcmQuY3VycmVudFZhbHVlOyB9KTtcclxuXHRcdGNoYW5nZXMuZm9yRWFjaENoYW5nZWRJdGVtKChyZWNvcmQ6IGFueSkgPT4geyB0aGlzLl9jb25maWdbcmVjb3JkLmtleV0gPSByZWNvcmQuY3VycmVudFZhbHVlOyB9KTtcclxuXHRcdGNoYW5nZXMuZm9yRWFjaFJlbW92ZWRJdGVtKChyZWNvcmQ6IGFueSkgPT4geyBkZWxldGUgdGhpcy5fY29uZmlnW3JlY29yZC5rZXldOyB9KTtcclxuXHJcblx0XHR0aGlzLnNldENvbmZpZyh0aGlzLl9jb25maWcpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfcmVzaXplU3RhcnQoZTogYW55KTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5yZXNpemVFbmFibGUpIHtcclxuXHRcdFx0dmFyIG1vdXNlUG9zID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzLl9nZXRJdGVtRnJvbVBvc2l0aW9uKG1vdXNlUG9zKTtcclxuXHJcblx0XHRcdGlmICghaXRlbSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aXRlbS5zdGFydE1vdmluZygpO1xyXG5cdFx0XHR0aGlzLl9yZXNpemluZ0l0ZW0gPSBpdGVtO1xyXG5cdFx0XHR0aGlzLl9yZXNpemVEaXJlY3Rpb24gPSBpdGVtLmNhblJlc2l6ZShlKTtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblx0XHRcdHRoaXMuX2NyZWF0ZVBsYWNlaG9sZGVyKGl0ZW0pO1xyXG5cdFx0XHR0aGlzLmlzUmVzaXppbmcgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLl9yZXNpemVSZWFkeSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0dGhpcy5vblJlc2l6ZVN0YXJ0LmVtaXQoaXRlbSk7XHJcblx0XHRcdGl0ZW0ub25SZXNpemVTdGFydEV2ZW50KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9kcmFnU3RhcnQoZTogYW55KTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5kcmFnRW5hYmxlKSB7XHJcblx0XHRcdHZhciBtb3VzZVBvcyA9IHRoaXMuX2dldE1vdXNlUG9zaXRpb24oZSk7XHJcblx0XHRcdHZhciBpdGVtID0gdGhpcy5fZ2V0SXRlbUZyb21Qb3NpdGlvbihtb3VzZVBvcyk7XHJcblx0XHRcdHZhciBpdGVtUG9zID0gaXRlbS5nZXRQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0aWYoIWl0ZW1Qb3MgfHwgIWl0ZW0pe1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHBPZmZzZXQgPSB7ICdsZWZ0JzogKG1vdXNlUG9zLmxlZnQgLSBpdGVtUG9zLmxlZnQpLCAndG9wJzogKG1vdXNlUG9zLnRvcCAtIGl0ZW1Qb3MudG9wKSB9XHJcblxyXG5cdFx0XHRpdGVtLnN0YXJ0TW92aW5nKCk7XHJcblx0XHRcdHRoaXMuX2RyYWdnaW5nSXRlbSA9IGl0ZW07XHJcblx0XHRcdHRoaXMuX3Bvc09mZnNldCA9IHBPZmZzZXQ7XHJcblx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGl0ZW0pO1xyXG5cdFx0XHR0aGlzLl9jcmVhdGVQbGFjZWhvbGRlcihpdGVtKTtcclxuXHRcdFx0dGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5fZHJhZ1JlYWR5ID0gZmFsc2U7XHJcblxyXG5cdFx0XHR0aGlzLm9uRHJhZ1N0YXJ0LmVtaXQoaXRlbSk7XHJcblx0XHRcdGl0ZW0ub25EcmFnU3RhcnRFdmVudCgpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuX3pvb21PbkRyYWcpIHtcclxuXHRcdFx0XHR0aGlzLl96b29tT3V0KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3pvb21PdXQoKTogdm9pZCB7XHJcblx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgJ3NjYWxlKDAuNSwgMC41KScpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfcmVzZXRab29tKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3RyYW5zZm9ybScsICcnKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2RyYWcoZTogYW55KTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5pc0RyYWdnaW5nKSB7XHJcblx0XHRcdGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKSB7XHJcblx0XHRcdFx0aWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5lbXB0eSkge1xyXG5cdFx0XHRcdFx0d2luZG93LmdldFNlbGVjdGlvbigpLmVtcHR5KCk7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKSB7XHJcblx0XHRcdFx0XHR3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKCg8YW55PmRvY3VtZW50KS5zZWxlY3Rpb24pIHtcclxuXHRcdFx0XHQoPGFueT5kb2N1bWVudCkuc2VsZWN0aW9uLmVtcHR5KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBtb3VzZVBvcyA9IHRoaXMuX2dldE1vdXNlUG9zaXRpb24oZSk7XHJcblx0XHRcdHZhciBuZXdMID0gKG1vdXNlUG9zLmxlZnQgLSB0aGlzLl9wb3NPZmZzZXQubGVmdCk7XHJcblx0XHRcdHZhciBuZXdUID0gKG1vdXNlUG9zLnRvcCAtIHRoaXMuX3Bvc09mZnNldC50b3ApO1xyXG5cclxuXHRcdFx0dmFyIGl0ZW1Qb3MgPSB0aGlzLl9kcmFnZ2luZ0l0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblx0XHRcdHZhciBncmlkUG9zID0gdGhpcy5fY2FsY3VsYXRlR3JpZFBvc2l0aW9uKG5ld0wsIG5ld1QpO1xyXG5cdFx0XHR2YXIgZGltcyA9IHRoaXMuX2RyYWdnaW5nSXRlbS5nZXRTaXplKCk7XHJcblxyXG5cdFx0XHRpZighaXRlbVBvcyl7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWChncmlkUG9zLCBkaW1zKSlcclxuXHRcdFx0XHRncmlkUG9zLmNvbCA9IHRoaXMuX21heENvbHMgLSAoZGltcy54IC0gMSk7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWShncmlkUG9zLCBkaW1zKSlcclxuXHRcdFx0XHRncmlkUG9zLnJvdyA9IHRoaXMuX21heFJvd3MgLSAoZGltcy55IC0gMSk7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuX2F1dG9SZXNpemUgJiYgdGhpcy5fbGltaXRUb1NjcmVlbikge1xyXG5cdFx0XHRcdGlmICgoZ3JpZFBvcy5jb2wgKyBkaW1zLnggLSAxKSA+IHRoaXMuX2dldENvbnRhaW5lckNvbHVtbnMoKSkge1xyXG5cdFx0XHRcdFx0Z3JpZFBvcy5jb2wgPSB0aGlzLl9nZXRDb250YWluZXJDb2x1bW5zKCkgLSAoZGltcy54IC0gMSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoZ3JpZFBvcy5jb2wgIT0gaXRlbVBvcy5jb2wgfHwgZ3JpZFBvcy5yb3cgIT0gaXRlbVBvcy5yb3cpIHtcclxuXHRcdFx0XHR0aGlzLl9kcmFnZ2luZ0l0ZW0uc2V0R3JpZFBvc2l0aW9uKGdyaWRQb3MsIHRoaXMuX2ZpeFRvR3JpZCk7XHJcblx0XHRcdFx0dGhpcy5fcGxhY2Vob2xkZXJSZWYuaW5zdGFuY2Uuc2V0R3JpZFBvc2l0aW9uKGdyaWRQb3MpO1xyXG5cclxuXHRcdFx0XHRpZiAoWyd1cCcsICdkb3duJywgJ2xlZnQnLCAncmlnaHQnXS5pbmRleE9mKHRoaXMuY2FzY2FkZSkgPj0gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5fZml4R3JpZENvbGxpc2lvbnMoZ3JpZFBvcywgZGltcywgdHJ1ZSk7XHJcblx0XHRcdFx0XHR0aGlzLl9jYXNjYWRlR3JpZChncmlkUG9zLCBkaW1zKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCF0aGlzLl9maXhUb0dyaWQpIHtcclxuXHRcdFx0XHR0aGlzLl9kcmFnZ2luZ0l0ZW0uc2V0UG9zaXRpb24obmV3TCwgbmV3VCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMub25EcmFnLmVtaXQodGhpcy5fZHJhZ2dpbmdJdGVtKTtcclxuXHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLm9uRHJhZ0V2ZW50KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9yZXNpemUoZTogYW55KTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5pc1Jlc2l6aW5nKSB7XHJcblx0XHRcdGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKSB7XHJcblx0XHRcdFx0aWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5lbXB0eSkge1xyXG5cdFx0XHRcdFx0d2luZG93LmdldFNlbGVjdGlvbigpLmVtcHR5KCk7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKSB7XHJcblx0XHRcdFx0XHR3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKCg8YW55PmRvY3VtZW50KS5zZWxlY3Rpb24pIHtcclxuXHRcdFx0XHQoPGFueT5kb2N1bWVudCkuc2VsZWN0aW9uLmVtcHR5KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBtb3VzZVBvcyA9IHRoaXMuX2dldE1vdXNlUG9zaXRpb24oZSk7XHJcblx0XHRcdHZhciBpdGVtUG9zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldFBvc2l0aW9uKCk7XHJcblx0XHRcdHZhciBpdGVtRGltcyA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXREaW1lbnNpb25zKCk7XHJcblxyXG5cdFx0XHRpZighaXRlbVBvcyl7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgbmV3VyA9IHRoaXMuX3Jlc2l6ZURpcmVjdGlvbiA9PSAnaGVpZ2h0JyA/IGl0ZW1EaW1zLndpZHRoIDogKG1vdXNlUG9zLmxlZnQgLSBpdGVtUG9zLmxlZnQgKyAxMCk7XHJcblx0XHRcdHZhciBuZXdIID0gdGhpcy5fcmVzaXplRGlyZWN0aW9uID09ICd3aWR0aCcgPyBpdGVtRGltcy5oZWlnaHQgOiAobW91c2VQb3MudG9wIC0gaXRlbVBvcy50b3AgKyAxMCk7XHJcblxyXG5cdFx0XHRpZiAobmV3VyA8IHRoaXMubWluV2lkdGgpXHJcblx0XHRcdFx0bmV3VyA9IHRoaXMubWluV2lkdGg7XHJcblx0XHRcdGlmIChuZXdIIDwgdGhpcy5taW5IZWlnaHQpXHJcblx0XHRcdFx0bmV3SCA9IHRoaXMubWluSGVpZ2h0O1xyXG5cdFx0XHRpZiAobmV3VyA8IHRoaXMuX3Jlc2l6aW5nSXRlbS5taW5XaWR0aClcclxuXHRcdFx0XHRuZXdXID0gdGhpcy5fcmVzaXppbmdJdGVtLm1pbldpZHRoO1xyXG5cdFx0XHRpZiAobmV3SCA8IHRoaXMuX3Jlc2l6aW5nSXRlbS5taW5IZWlnaHQpXHJcblx0XHRcdFx0bmV3SCA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5taW5IZWlnaHQ7XHJcblxyXG5cdFx0XHR2YXIgY2FsY1NpemUgPSB0aGlzLl9jYWxjdWxhdGVHcmlkU2l6ZShuZXdXLCBuZXdIKTtcclxuXHRcdFx0dmFyIGl0ZW1TaXplID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldFNpemUoKTtcclxuXHRcdFx0dmFyIGlHcmlkUG9zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1goaUdyaWRQb3MsIGNhbGNTaXplKSlcclxuXHRcdFx0XHRjYWxjU2l6ZS54ID0gKHRoaXMuX21heENvbHMgLSBpR3JpZFBvcy5jb2wpICsgMTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNZKGlHcmlkUG9zLCBjYWxjU2l6ZSkpXHJcblx0XHRcdFx0Y2FsY1NpemUueSA9ICh0aGlzLl9tYXhSb3dzIC0gaUdyaWRQb3Mucm93KSArIDE7XHJcblxyXG5cdFx0XHRjYWxjU2l6ZSA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5maXhSZXNpemUoY2FsY1NpemUpO1xyXG5cclxuXHRcdFx0aWYgKGNhbGNTaXplLnggIT0gaXRlbVNpemUueCB8fCBjYWxjU2l6ZS55ICE9IGl0ZW1TaXplLnkpIHtcclxuXHRcdFx0XHR0aGlzLl9yZXNpemluZ0l0ZW0uc2V0U2l6ZShjYWxjU2l6ZSwgZmFsc2UpO1xyXG5cdFx0XHRcdHRoaXMuX3BsYWNlaG9sZGVyUmVmLmluc3RhbmNlLnNldFNpemUoY2FsY1NpemUpO1xyXG5cclxuXHRcdFx0XHRpZiAoWyd1cCcsICdkb3duJywgJ2xlZnQnLCAncmlnaHQnXS5pbmRleE9mKHRoaXMuY2FzY2FkZSkgPj0gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5fZml4R3JpZENvbGxpc2lvbnMoaUdyaWRQb3MsIGNhbGNTaXplLCB0cnVlKTtcclxuXHRcdFx0XHRcdHRoaXMuX2Nhc2NhZGVHcmlkKGlHcmlkUG9zLCBjYWxjU2l6ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuX2ZpeFRvR3JpZClcclxuXHRcdFx0XHR0aGlzLl9yZXNpemluZ0l0ZW0uc2V0RGltZW5zaW9ucyhuZXdXLCBuZXdIKTtcclxuXHJcblx0XHRcdHZhciBiaWdHcmlkID0gdGhpcy5fbWF4R3JpZFNpemUoaXRlbVBvcy5sZWZ0ICsgbmV3VyArICgyICogZS5tb3ZlbWVudFgpLCBpdGVtUG9zLnRvcCArIG5ld0ggKyAoMiAqIGUubW92ZW1lbnRZKSk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fcmVzaXplRGlyZWN0aW9uID09ICdoZWlnaHQnKSBiaWdHcmlkLnggPSBpR3JpZFBvcy5jb2wgKyBpdGVtU2l6ZS54O1xyXG5cdFx0XHRpZiAodGhpcy5fcmVzaXplRGlyZWN0aW9uID09ICd3aWR0aCcpIGJpZ0dyaWQueSA9IGlHcmlkUG9zLnJvdyArIGl0ZW1TaXplLnk7XHJcblxyXG5cdFx0XHR0aGlzLm9uUmVzaXplLmVtaXQodGhpcy5fcmVzaXppbmdJdGVtKTtcclxuXHRcdFx0dGhpcy5fcmVzaXppbmdJdGVtLm9uUmVzaXplRXZlbnQoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2RyYWdTdG9wKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuaXNEcmFnZ2luZykge1xyXG5cdFx0XHR0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuXHJcblx0XHRcdHZhciBpdGVtUG9zID0gdGhpcy5fZHJhZ2dpbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLnNhdmVQb3NpdGlvbihpdGVtUG9zKTtcclxuXHRcdFx0dGhpcy5fYWRkVG9HcmlkKHRoaXMuX2RyYWdnaW5nSXRlbSk7XHJcblxyXG5cdFx0XHR0aGlzLl9jYXNjYWRlR3JpZCgpO1xyXG5cclxuXHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLnN0b3BNb3ZpbmcoKTtcclxuXHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLm9uRHJhZ1N0b3BFdmVudCgpO1xyXG5cdFx0XHR0aGlzLm9uRHJhZ1N0b3AuZW1pdCh0aGlzLl9kcmFnZ2luZ0l0ZW0pO1xyXG5cdFx0XHR0aGlzLl9kcmFnZ2luZ0l0ZW0gPSBudWxsO1xyXG5cdFx0XHR0aGlzLl9wb3NPZmZzZXQgPSBudWxsO1xyXG5cdFx0XHR0aGlzLl9wbGFjZWhvbGRlclJlZi5kZXN0cm95KCk7XHJcblxyXG5cdFx0XHR0aGlzLl9lbWl0T25JdGVtQ2hhbmdlKCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fem9vbU9uRHJhZykge1xyXG5cdFx0XHRcdHRoaXMuX3Jlc2V0Wm9vbSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9yZXNpemVTdG9wKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuaXNSZXNpemluZykge1xyXG5cdFx0XHR0aGlzLmlzUmVzaXppbmcgPSBmYWxzZTtcclxuXHJcblx0XHRcdHZhciBpdGVtRGltcyA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXRTaXplKCk7XHJcblxyXG5cdFx0XHR0aGlzLl9yZXNpemluZ0l0ZW0uc2V0U2l6ZShpdGVtRGltcyk7XHJcblx0XHRcdHRoaXMuX2FkZFRvR3JpZCh0aGlzLl9yZXNpemluZ0l0ZW0pO1xyXG5cclxuXHRcdFx0dGhpcy5fY2FzY2FkZUdyaWQoKTtcclxuXHJcblx0XHRcdHRoaXMuX3Jlc2l6aW5nSXRlbS5zdG9wTW92aW5nKCk7XHJcblx0XHRcdHRoaXMuX3Jlc2l6aW5nSXRlbS5vblJlc2l6ZVN0b3BFdmVudCgpO1xyXG5cdFx0XHR0aGlzLm9uUmVzaXplU3RvcC5lbWl0KHRoaXMuX3Jlc2l6aW5nSXRlbSk7XHJcblx0XHRcdHRoaXMuX3Jlc2l6aW5nSXRlbSA9IG51bGw7XHJcblx0XHRcdHRoaXMuX3Jlc2l6ZURpcmVjdGlvbiA9IG51bGw7XHJcblx0XHRcdHRoaXMuX3BsYWNlaG9sZGVyUmVmLmRlc3Ryb3koKTtcclxuXHJcblx0XHRcdHRoaXMuX2VtaXRPbkl0ZW1DaGFuZ2UoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX21heEdyaWRTaXplKHc6IG51bWJlciwgaDogbnVtYmVyKTogTmdHcmlkSXRlbVNpemUge1xyXG5cdFx0dmFyIHNpemV4ID0gTWF0aC5jZWlsKHcgLyAodGhpcy5jb2xXaWR0aCArIHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQpKTtcclxuXHRcdHZhciBzaXpleSA9IE1hdGguY2VpbChoIC8gKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpO1xyXG5cdFx0cmV0dXJuIHsgJ3gnOiBzaXpleCwgJ3knOiBzaXpleSB9O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfY2FsY3VsYXRlR3JpZFNpemUod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBOZ0dyaWRJdGVtU2l6ZSB7XHJcblx0XHR3aWR0aCArPSB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0O1xyXG5cdFx0aGVpZ2h0ICs9IHRoaXMubWFyZ2luVG9wICsgdGhpcy5tYXJnaW5Cb3R0b207XHJcblxyXG5cdFx0dmFyIHNpemV4ID0gTWF0aC5tYXgodGhpcy5taW5Db2xzLCBNYXRoLnJvdW5kKHdpZHRoIC8gKHRoaXMuY29sV2lkdGggKyB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KSkpO1xyXG5cdFx0dmFyIHNpemV5ID0gTWF0aC5tYXgodGhpcy5taW5Sb3dzLCBNYXRoLnJvdW5kKGhlaWdodCAvICh0aGlzLnJvd0hlaWdodCArIHRoaXMubWFyZ2luVG9wICsgdGhpcy5tYXJnaW5Cb3R0b20pKSk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1goeyBjb2w6IDEsIHJvdzogMSB9LCB7IHg6IHNpemV4LCB5OiBzaXpleSB9KSkgc2l6ZXggPSB0aGlzLl9tYXhDb2xzO1xyXG5cdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koeyBjb2w6IDEsIHJvdzogMSB9LCB7IHg6IHNpemV4LCB5OiBzaXpleSB9KSkgc2l6ZXkgPSB0aGlzLl9tYXhSb3dzO1xyXG5cclxuXHRcdHJldHVybiB7ICd4Jzogc2l6ZXgsICd5Jzogc2l6ZXkgfTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2NhbGN1bGF0ZUdyaWRQb3NpdGlvbihsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyKTogTmdHcmlkSXRlbVBvc2l0aW9uIHtcclxuXHRcdHZhciBjb2wgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGxlZnQgLyAodGhpcy5jb2xXaWR0aCArIHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQpKSArIDEpO1xyXG5cdFx0dmFyIHJvdyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQodG9wIC8gKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpICsgMSk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1goeyBjb2w6IGNvbCwgcm93OiByb3cgfSwgeyB4OiAxLCB5OiAxIH0pKSBjb2wgPSB0aGlzLl9tYXhDb2xzO1xyXG5cdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koeyBjb2w6IGNvbCwgcm93OiByb3cgfSwgeyB4OiAxLCB5OiAxIH0pKSByb3cgPSB0aGlzLl9tYXhSb3dzO1xyXG5cclxuXHRcdHJldHVybiB7ICdjb2wnOiBjb2wsICdyb3cnOiByb3cgfTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2hhc0dyaWRDb2xsaXNpb24ocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogYm9vbGVhbiB7XHJcblx0XHR2YXIgcG9zaXRpb25zID0gdGhpcy5fZ2V0Q29sbGlzaW9ucyhwb3MsIGRpbXMpO1xyXG5cclxuXHRcdGlmIChwb3NpdGlvbnMgPT0gbnVsbCB8fCBwb3NpdGlvbnMubGVuZ3RoID09IDApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRyZXR1cm4gcG9zaXRpb25zLnNvbWUoKHY6IE5nR3JpZEl0ZW0pID0+IHtcclxuXHRcdFx0cmV0dXJuICEodiA9PT0gbnVsbCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2dldENvbGxpc2lvbnMocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogQXJyYXk8TmdHcmlkSXRlbT4ge1xyXG5cdFx0Y29uc3QgcmV0dXJuczogQXJyYXk8TmdHcmlkSXRlbT4gPSBbXTtcclxuXHJcblx0XHRmb3IgKGxldCBqOiBudW1iZXIgPSAwOyBqIDwgZGltcy55OyBqKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3Bvcy5yb3cgKyBqXSAhPSBudWxsKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGRpbXMueDsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5faXRlbUdyaWRbcG9zLnJvdyArIGpdW3Bvcy5jb2wgKyBpXSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGl0ZW06IE5nR3JpZEl0ZW0gPSB0aGlzLl9pdGVtR3JpZFtwb3Mucm93ICsgal1bcG9zLmNvbCArIGldO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHJldHVybnMuaW5kZXhPZihpdGVtKSA8IDApXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJucy5wdXNoKGl0ZW0pO1xyXG5cclxuXHRcdFx0XHRcdFx0Y29uc3QgaXRlbVBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgaXRlbURpbXM6IE5nR3JpZEl0ZW1TaXplID0gaXRlbS5nZXRTaXplKCk7XHJcblxyXG5cdFx0XHRcdFx0XHRpID0gaXRlbVBvcy5jb2wgKyBpdGVtRGltcy54IC0gcG9zLmNvbDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcmV0dXJucztcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2ZpeEdyaWRDb2xsaXNpb25zKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSwgc2hvdWxkU2F2ZTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcblx0XHR3aGlsZSAodGhpcy5faGFzR3JpZENvbGxpc2lvbihwb3MsIGRpbXMpKSB7XHJcblx0XHRcdGNvbnN0IGNvbGxpc2lvbnM6IEFycmF5PE5nR3JpZEl0ZW0+ID0gdGhpcy5fZ2V0Q29sbGlzaW9ucyhwb3MsIGRpbXMpO1xyXG5cclxuXHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoY29sbGlzaW9uc1swXSk7XHJcblxyXG5cdFx0XHRjb25zdCBpdGVtUG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSBjb2xsaXNpb25zWzBdLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cdFx0XHRjb25zdCBpdGVtRGltczogTmdHcmlkSXRlbVNpemUgPSBjb2xsaXNpb25zWzBdLmdldFNpemUoKTtcclxuXHJcblx0XHRcdHN3aXRjaCAodGhpcy5jYXNjYWRlKSB7XHJcblx0XHRcdFx0Y2FzZSAndXAnOlxyXG5cdFx0XHRcdGNhc2UgJ2Rvd24nOlxyXG5cdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRjb25zdCBvbGRSb3c6IG51bWJlciA9IGl0ZW1Qb3Mucm93O1xyXG5cdFx0XHRcdFx0aXRlbVBvcy5yb3cgPSBwb3Mucm93ICsgZGltcy55O1xyXG5cclxuXHRcdFx0XHRcdGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNZKGl0ZW1Qb3MsIGl0ZW1EaW1zKSkge1xyXG5cdFx0XHRcdFx0XHRpdGVtUG9zLmNvbCA9IHBvcy5jb2wgKyBkaW1zLng7XHJcblx0XHRcdFx0XHRcdGl0ZW1Qb3Mucm93ID0gb2xkUm93O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnbGVmdCc6XHJcblx0XHRcdFx0Y2FzZSAncmlnaHQnOlxyXG5cdFx0XHRcdFx0Y29uc3Qgb2xkQ29sOiBudW1iZXIgPSBpdGVtUG9zLmNvbDtcclxuXHRcdFx0XHRcdGl0ZW1Qb3MuY29sID0gcG9zLmNvbCArIGRpbXMueDtcclxuXHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWChpdGVtUG9zLCBpdGVtRGltcykpIHtcclxuXHRcdFx0XHRcdFx0aXRlbVBvcy5jb2wgPSBvbGRDb2w7XHJcblx0XHRcdFx0XHRcdGl0ZW1Qb3Mucm93ID0gcG9zLnJvdyArIGRpbXMueTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoc2hvdWxkU2F2ZSkge1xyXG5cdFx0XHRcdGNvbGxpc2lvbnNbMF0uc2F2ZVBvc2l0aW9uKGl0ZW1Qb3MpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbGxpc2lvbnNbMF0uc2V0R3JpZFBvc2l0aW9uKGl0ZW1Qb3MpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLl9maXhHcmlkQ29sbGlzaW9ucyhpdGVtUG9zLCBpdGVtRGltcywgc2hvdWxkU2F2ZSk7XHJcblx0XHRcdHRoaXMuX2FkZFRvR3JpZChjb2xsaXNpb25zWzBdKTtcclxuXHRcdFx0Y29sbGlzaW9uc1swXS5vbkNhc2NhZGVFdmVudCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfbGltaXRHcmlkKG1heENvbHM6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0Y29uc3QgaXRlbXM6IEFycmF5PE5nR3JpZEl0ZW0+ID0gdGhpcy5faXRlbXMuc2xpY2UoKTtcclxuXHJcblx0XHRpdGVtcy5zb3J0KChhOiBOZ0dyaWRJdGVtLCBiOiBOZ0dyaWRJdGVtKSA9PiB7XHJcblx0XHRcdGxldCBhUG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSBhLmdldFNhdmVkUG9zaXRpb24oKTtcclxuXHRcdFx0bGV0IGJQb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGIuZ2V0U2F2ZWRQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0aWYgKGFQb3Mucm93ID09IGJQb3Mucm93KSB7XHJcblx0XHRcdFx0cmV0dXJuIGFQb3MuY29sID09IGJQb3MuY29sID8gMCA6IChhUG9zLmNvbCA8IGJQb3MuY29sID8gLTEgOiAxKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gYVBvcy5yb3cgPCBiUG9zLnJvdyA/IC0xIDogMTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Y29uc3QgY29sdW1uTWF4OiB7IFtjb2w6IG51bWJlcl06IG51bWJlciB9ID0ge307XHJcblx0XHRjb25zdCBsYXJnZXN0R2FwOiB7IFtjb2w6IG51bWJlcl06IG51bWJlciB9ID0ge307XHJcblxyXG5cdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMTsgaSA8PSBtYXhDb2xzOyBpKyspIHtcclxuXHRcdFx0Y29sdW1uTWF4W2ldID0gMTtcclxuXHRcdFx0bGFyZ2VzdEdhcFtpXSA9IDE7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgY3VyUG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSB7IGNvbDogMSwgcm93OiAxIH07XHJcblx0XHRsZXQgY3VycmVudFJvdzogbnVtYmVyID0gMTtcclxuXHJcblx0XHRjb25zdCB3aWxsQ2FzY2FkZTogKGl0ZW06IE5nR3JpZEl0ZW0sIGNvbDogbnVtYmVyKSA9PiBib29sZWFuID0gKGl0ZW06IE5nR3JpZEl0ZW0sIGNvbDogbnVtYmVyKSA9PiB7XHJcblx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IGNvbDsgaSA8IGNvbCArIGl0ZW0uc2l6ZXg7IGkrKykge1xyXG5cdFx0XHRcdGlmIChjb2x1bW5NYXhbaV0gPT0gY3VycmVudFJvdykgcmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH07XHJcblxyXG5cdFx0aW50ZXJmYWNlIEdyaWRCbG9jayB7XHJcblx0XHRcdHN0YXJ0OiBudW1iZXI7XHJcblx0XHRcdGVuZDogbnVtYmVyO1xyXG5cdFx0XHRsZW5ndGg6IG51bWJlcjtcclxuXHRcdH1cclxuXHJcblx0XHR3aGlsZSAoaXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRjb25zdCBjb2x1bW5zOiBBcnJheTxHcmlkQmxvY2s+ID0gW107XHJcblx0XHRcdGxldCBuZXdCbG9jazogR3JpZEJsb2NrID0ge1xyXG5cdFx0XHRcdHN0YXJ0OiAxLFxyXG5cdFx0XHRcdGVuZDogMSxcclxuXHRcdFx0XHRsZW5ndGg6IDAsXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRmb3IgKGxldCBjb2w6IG51bWJlciA9IDE7IGNvbCA8PSBtYXhDb2xzOyBjb2wrKykge1xyXG5cdFx0XHRcdGlmIChjb2x1bW5NYXhbY29sXSA8PSBjdXJyZW50Um93KSB7XHJcblx0XHRcdFx0XHRpZiAobmV3QmxvY2subGVuZ3RoID09IDApIHtcclxuXHRcdFx0XHRcdFx0bmV3QmxvY2suc3RhcnQgPSBjb2w7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0bmV3QmxvY2subGVuZ3RoKys7XHJcblx0XHRcdFx0XHRuZXdCbG9jay5lbmQgPSBjb2wgKyAxO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobmV3QmxvY2subGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0Y29sdW1ucy5wdXNoKG5ld0Jsb2NrKTtcclxuXHJcblx0XHRcdFx0XHRuZXdCbG9jayA9IHtcclxuXHRcdFx0XHRcdFx0c3RhcnQ6IGNvbCxcclxuXHRcdFx0XHRcdFx0ZW5kOiBjb2wsXHJcblx0XHRcdFx0XHRcdGxlbmd0aDogMCxcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAobmV3QmxvY2subGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGNvbHVtbnMucHVzaChuZXdCbG9jayk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCB0ZW1wQ29sdW1uczogQXJyYXk8bnVtYmVyPiA9IGNvbHVtbnMubWFwKChibG9jazogR3JpZEJsb2NrKSA9PiBibG9jay5sZW5ndGgpO1xyXG5cdFx0XHRjb25zdCBjdXJyZW50SXRlbXM6IEFycmF5PE5nR3JpZEl0ZW0+ID0gW107XHJcblxyXG5cdFx0XHR3aGlsZSAoaXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGNvbnN0IGl0ZW0gPSBpdGVtc1swXTtcclxuXHJcblx0XHRcdFx0aWYgKGl0ZW0ucm93ID4gY3VycmVudFJvdykgYnJlYWs7XHJcblxyXG5cdFx0XHRcdGxldCBmaXRzOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHRcdFx0Zm9yIChsZXQgeCBpbiB0ZW1wQ29sdW1ucykge1xyXG5cdFx0XHRcdFx0aWYgKGl0ZW0uc2l6ZXggPD0gdGVtcENvbHVtbnNbeF0pIHtcclxuXHRcdFx0XHRcdFx0dGVtcENvbHVtbnNbeF0gLT0gaXRlbS5zaXpleDtcclxuXHRcdFx0XHRcdFx0Zml0cyA9IHRydWU7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChpdGVtLnNpemV4ID4gdGVtcENvbHVtbnNbeF0pIHtcclxuXHRcdFx0XHRcdFx0dGVtcENvbHVtbnNbeF0gPSAwO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGZpdHMpIHtcclxuXHRcdFx0XHRcdGN1cnJlbnRJdGVtcy5wdXNoKGl0ZW1zLnNoaWZ0KCkpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChjdXJyZW50SXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGNvbnN0IGl0ZW1Qb3NpdGlvbnM6IEFycmF5PG51bWJlcj4gPSBbXTtcclxuXHRcdFx0XHRsZXQgbGFzdFBvc2l0aW9uOiBudW1iZXIgPSBtYXhDb2xzO1xyXG5cclxuXHRcdFx0XHRmb3IgKGxldCBpID0gY3VycmVudEl0ZW1zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcblx0XHRcdFx0XHRsZXQgbWF4UG9zaXRpb24gPSAxO1xyXG5cclxuXHRcdFx0XHRcdGZvciAobGV0IGogPSBjb2x1bW5zLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb2x1bW5zW2pdLnN0YXJ0ID4gbGFzdFBvc2l0aW9uKSBjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbHVtbnNbal0uc3RhcnQgPiAobWF4Q29scyAtIGN1cnJlbnRJdGVtc1tpXS5zaXpleCkpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHRpZiAoY29sdW1uc1tqXS5sZW5ndGggPCBjdXJyZW50SXRlbXNbaV0uc2l6ZXgpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHRpZiAobGFzdFBvc2l0aW9uIDwgY29sdW1uc1tqXS5lbmQgJiYgKGxhc3RQb3NpdGlvbiAtIGNvbHVtbnNbal0uc3RhcnQpIDwgY3VycmVudEl0ZW1zW2ldLnNpemV4KSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRcdG1heFBvc2l0aW9uID0gKGxhc3RQb3NpdGlvbiA8IGNvbHVtbnNbal0uZW5kID8gbGFzdFBvc2l0aW9uIDogY29sdW1uc1tqXS5lbmQpIC0gY3VycmVudEl0ZW1zW2ldLnNpemV4XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGl0ZW1Qb3NpdGlvbnNbaV0gPSBNYXRoLm1pbihtYXhQb3NpdGlvbiwgY3VycmVudEl0ZW1zW2ldLnJvdyA9PSBjdXJyZW50Um93ID8gY3VycmVudEl0ZW1zW2ldLmNvbCA6IDEpO1xyXG5cdFx0XHRcdFx0bGFzdFBvc2l0aW9uID0gaXRlbVBvc2l0aW9uc1tpXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBtaW5Qb3NpdGlvbjogbnVtYmVyID0gMTtcclxuXHRcdFx0XHRsZXQgY3VycmVudEl0ZW06IG51bWJlciA9IDA7XHJcblxyXG5cdFx0XHRcdHdoaWxlIChjdXJyZW50SXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0Y29uc3QgaXRlbTogTmdHcmlkSXRlbSA9IGN1cnJlbnRJdGVtcy5zaGlmdCgpO1xyXG5cclxuXHRcdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgY29sdW1ucy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdFx0XHRpZiAoY29sdW1uc1tqXS5sZW5ndGggPCBpdGVtLnNpemV4KSBjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0aWYgKG1pblBvc2l0aW9uID4gY29sdW1uc1tqXS5lbmQpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHRpZiAobWluUG9zaXRpb24gPiBjb2x1bW5zW2pdLnN0YXJ0ICYmIChjb2x1bW5zW2pdLmVuZCAtIG1pblBvc2l0aW9uKSA8IGl0ZW0uc2l6ZXgpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHRpZiAobWluUG9zaXRpb24gPCBjb2x1bW5zW2pdLnN0YXJ0KSBtaW5Qb3NpdGlvbiA9IGNvbHVtbnNbal0uc3RhcnQ7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGl0ZW0uc2V0R3JpZFBvc2l0aW9uKHsgY29sOiBNYXRoLm1heChtaW5Qb3NpdGlvbiwgaXRlbVBvc2l0aW9uc1tjdXJyZW50SXRlbV0pLCByb3c6IGN1cnJlbnRSb3cgfSk7XHJcblxyXG5cdFx0XHRcdFx0bWluUG9zaXRpb24gPSBpdGVtLmN1cnJlbnRDb2wgKyBpdGVtLnNpemV4O1xyXG5cdFx0XHRcdFx0Y3VycmVudEl0ZW0rKztcclxuXHJcblx0XHRcdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSBpdGVtLmN1cnJlbnRDb2w7IGkgPCBpdGVtLmN1cnJlbnRDb2wgKyBpdGVtLnNpemV4OyBpKyspIHtcclxuXHRcdFx0XHRcdFx0Y29sdW1uTWF4W2ldID0gaXRlbS5jdXJyZW50Um93ICsgaXRlbS5zaXpleTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSBpZiAoY3VycmVudEl0ZW1zLmxlbmd0aCA9PT0gMCAmJiBjb2x1bW5zLmxlbmd0aCA9PT0gMSAmJiBjb2x1bW5zWzBdLmxlbmd0aCA+PSBtYXhDb2xzKSB7XHQvL1x0T25seSBvbmUgYmxvY2ssIGJ1dCBubyBpdGVtcyBmaXQuIE1lYW5zIHRoZSBuZXh0IGl0ZW0gaXMgdG9vIGxhcmdlXHJcblx0XHRcdFx0Y29uc3QgaXRlbTogTmdHcmlkSXRlbSA9IGl0ZW1zLnNoaWZ0KCk7XHJcblxyXG5cdFx0XHRcdGl0ZW0uc2V0R3JpZFBvc2l0aW9uKHsgY29sOiAxLCByb3c6IGN1cnJlbnRSb3cgfSk7XHJcblxyXG5cdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IGl0ZW0uY3VycmVudENvbDsgaSA8IGl0ZW0uY3VycmVudENvbCArIGl0ZW0uc2l6ZXg7IGkrKykge1xyXG5cdFx0XHRcdFx0Y29sdW1uTWF4W2ldID0gaXRlbS5jdXJyZW50Um93ICsgaXRlbS5zaXpleTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBuZXdSb3c6IG51bWJlciA9IDA7XHJcblxyXG5cdFx0XHRmb3IgKGxldCB4IGluIGNvbHVtbk1heCkge1xyXG5cdFx0XHRcdGlmIChjb2x1bW5NYXhbeF0gPiBjdXJyZW50Um93ICYmIChuZXdSb3cgPT0gMCB8fCBjb2x1bW5NYXhbeF0gPCBuZXdSb3cpKSB7XHJcblx0XHRcdFx0XHRuZXdSb3cgPSBjb2x1bW5NYXhbeF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjdXJyZW50Um93ID0gbmV3Um93IDw9IGN1cnJlbnRSb3cgPyBjdXJyZW50Um93ICsgMSA6IG5ld1JvdztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2Nhc2NhZGVHcmlkKHBvcz86IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltcz86IE5nR3JpZEl0ZW1TaXplLCBzaG91bGRTYXZlOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX2Rlc3Ryb3llZCkgcmV0dXJuO1xyXG5cdFx0aWYgKHBvcyAmJiAhZGltcykgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FzY2FkZSB3aXRoIG9ubHkgcG9zaXRpb24gYW5kIG5vdCBkaW1lbnNpb25zJyk7XHJcblxyXG5cdFx0aWYgKHRoaXMuaXNEcmFnZ2luZyAmJiB0aGlzLl9kcmFnZ2luZ0l0ZW0gJiYgIXBvcyAmJiAhZGltcykge1xyXG5cdFx0XHRwb3MgPSB0aGlzLl9kcmFnZ2luZ0l0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblx0XHRcdGRpbXMgPSB0aGlzLl9kcmFnZ2luZ0l0ZW0uZ2V0U2l6ZSgpO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmlzUmVzaXppbmcgJiYgdGhpcy5fcmVzaXppbmdJdGVtICYmICFwb3MgJiYgIWRpbXMpIHtcclxuXHRcdFx0cG9zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cdFx0XHRkaW1zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldFNpemUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRzd2l0Y2ggKHRoaXMuY2FzY2FkZSkge1xyXG5cdFx0XHRjYXNlICd1cCc6XHJcblx0XHRcdGNhc2UgJ2Rvd24nOlxyXG5cdFx0XHRcdGNvbnN0IGxvd1JvdzogQXJyYXk8bnVtYmVyPiA9IFswXTtcclxuXHJcblx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMTsgaSA8PSB0aGlzLl9jdXJNYXhDb2w7IGkrKylcclxuXHRcdFx0XHRcdGxvd1Jvd1tpXSA9IDE7XHJcblxyXG5cdFx0XHRcdGZvciAobGV0IHI6IG51bWJlciA9IDE7IHIgPD0gdGhpcy5fY3VyTWF4Um93OyByKyspIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtyXSA9PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdGZvciAobGV0IGM6IG51bWJlciA9IDE7IGMgPD0gdGhpcy5fY3VyTWF4Q29sOyBjKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3JdID09IHVuZGVmaW5lZCkgYnJlYWs7XHJcblx0XHRcdFx0XHRcdGlmIChyIDwgbG93Um93W2NdKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtyXVtjXSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbTogTmdHcmlkSXRlbSA9IHRoaXMuX2l0ZW1HcmlkW3JdW2NdO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChpdGVtLmlzRml4ZWQpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRjb25zdCBpdGVtRGltczogTmdHcmlkSXRlbVNpemUgPSBpdGVtLmdldFNpemUoKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBpdGVtUG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSBpdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoaXRlbVBvcy5jb2wgIT0gYyB8fCBpdGVtUG9zLnJvdyAhPSByKSBjb250aW51ZTtcdC8vXHRJZiB0aGlzIGlzIG5vdCB0aGUgZWxlbWVudCdzIHN0YXJ0XHJcblxyXG5cdFx0XHRcdFx0XHRcdGxldCBsb3dlc3Q6IG51bWJlciA9IGxvd1Jvd1tjXTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMTsgaSA8IGl0ZW1EaW1zLng7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0bG93ZXN0ID0gTWF0aC5tYXgobG93Um93WyhjICsgaSldLCBsb3dlc3QpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKHBvcyAmJiAoYyArIGl0ZW1EaW1zLngpID4gcG9zLmNvbCAmJiBjIDwgKHBvcy5jb2wgKyBkaW1zLngpKSB7ICAgICAgICAgIC8vXHRJZiBvdXIgZWxlbWVudCBpcyBpbiBvbmUgb2YgdGhlIGl0ZW0ncyBjb2x1bW5zXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoKHIgPj0gcG9zLnJvdyAmJiByIDwgKHBvcy5yb3cgKyBkaW1zLnkpKSB8fCAgICAgICAgICAgICAgICAgICAgICAgICAvL1x0SWYgdGhpcyByb3cgaXMgb2NjdXBpZWQgYnkgb3VyIGVsZW1lbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0KChpdGVtRGltcy55ID4gKHBvcy5yb3cgLSBsb3dlc3QpKSAmJiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1x0T3IgdGhlIGl0ZW0gY2FuJ3QgZml0IGFib3ZlIG91ciBlbGVtZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KHIgPj0gKHBvcy5yb3cgKyBkaW1zLnkpICYmIGxvd2VzdCA8IChwb3Mucm93ICsgZGltcy55KSkpKSB7ICAgIC8vXHRcdEFuZCB0aGlzIHJvdyBpcyBiZWxvdyBvdXIgZWxlbWVudCwgYnV0IHdlIGhhdmVuJ3QgY2F1Z2h0IGl0XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxvd2VzdCA9IE1hdGgubWF4KGxvd2VzdCwgcG9zLnJvdyArIGRpbXMueSk7ICAgICAgICAgICAgICAgICAgICAgICAgLy9cdFNldCB0aGUgbG93ZXN0IHJvdyB0byBiZSBiZWxvdyBpdFxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgbmV3UG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSB7IGNvbDogYywgcm93OiBsb3dlc3QgfTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGxvd2VzdCAhPSBpdGVtUG9zLnJvdyAmJiB0aGlzLl9pc1dpdGhpbkJvdW5kc1kobmV3UG9zLCBpdGVtRGltcykpIHtcdC8vXHRJZiB0aGUgaXRlbSBpcyBub3QgYWxyZWFkeSBvbiB0aGlzIHJvdyBtb3ZlIGl0IHVwXHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9yZW1vdmVGcm9tR3JpZChpdGVtKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2hvdWxkU2F2ZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpdGVtLnNhdmVQb3NpdGlvbihuZXdQb3MpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5zZXRHcmlkUG9zaXRpb24obmV3UG9zKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRpdGVtLm9uQ2FzY2FkZUV2ZW50KCk7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9hZGRUb0dyaWQoaXRlbSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgaXRlbURpbXMueDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRsb3dSb3dbYyArIGldID0gbG93ZXN0ICsgaXRlbURpbXMueTtcdC8vXHRVcGRhdGUgdGhlIGxvd2VzdCByb3cgdG8gYmUgYmVsb3cgdGhlIGl0ZW1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2xlZnQnOlxyXG5cdFx0XHRjYXNlICdyaWdodCc6XHJcblx0XHRcdFx0Y29uc3QgbG93Q29sOiBBcnJheTxudW1iZXI+ID0gWzBdO1xyXG5cclxuXHRcdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSAxOyBpIDw9IHRoaXMuX2N1ck1heFJvdzsgaSsrKVxyXG5cdFx0XHRcdFx0bG93Q29sW2ldID0gMTtcclxuXHJcblx0XHRcdFx0Zm9yIChsZXQgcjogbnVtYmVyID0gMTsgciA8PSB0aGlzLl9jdXJNYXhSb3c7IHIrKykge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3JdID09IHVuZGVmaW5lZCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0Zm9yIChsZXQgYzogbnVtYmVyID0gMTsgYyA8PSB0aGlzLl9jdXJNYXhDb2w7IGMrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5faXRlbUdyaWRbcl0gPT0gdW5kZWZpbmVkKSBicmVhaztcclxuXHRcdFx0XHRcdFx0aWYgKGMgPCBsb3dDb2xbcl0pIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3JdW2NdICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBpdGVtOiBOZ0dyaWRJdGVtID0gdGhpcy5faXRlbUdyaWRbcl1bY107XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbURpbXM6IE5nR3JpZEl0ZW1TaXplID0gaXRlbS5nZXRTaXplKCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbVBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW1Qb3MuY29sICE9IGMgfHwgaXRlbVBvcy5yb3cgIT0gcikgY29udGludWU7XHQvL1x0SWYgdGhpcyBpcyBub3QgdGhlIGVsZW1lbnQncyBzdGFydFxyXG5cclxuXHRcdFx0XHRcdFx0XHRsZXQgbG93ZXN0OiBudW1iZXIgPSBsb3dDb2xbcl07XHJcblxyXG5cdFx0XHRcdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDE7IGkgPCBpdGVtRGltcy55OyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdGxvd2VzdCA9IE1hdGgubWF4KGxvd0NvbFsociArIGkpXSwgbG93ZXN0KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChwb3MgJiYgKHIgKyBpdGVtRGltcy55KSA+IHBvcy5yb3cgJiYgciA8IChwb3Mucm93ICsgZGltcy55KSkgeyAgICAgICAgICAvL1x0SWYgb3VyIGVsZW1lbnQgaXMgaW4gb25lIG9mIHRoZSBpdGVtJ3Mgcm93c1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKChjID49IHBvcy5jb2wgJiYgYyA8IChwb3MuY29sICsgZGltcy54KSkgfHwgICAgICAgICAgICAgICAgICAgICAgICAgLy9cdElmIHRoaXMgY29sIGlzIG9jY3VwaWVkIGJ5IG91ciBlbGVtZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdCgoaXRlbURpbXMueCA+IChwb3MuY29sIC0gbG93ZXN0KSkgJiYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cdE9yIHRoZSBpdGVtIGNhbid0IGZpdCBhYm92ZSBvdXIgZWxlbWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdChjID49IChwb3MuY29sICsgZGltcy54KSAmJiBsb3dlc3QgPCAocG9zLmNvbCArIGRpbXMueCkpKSkgeyAgICAvL1x0XHRBbmQgdGhpcyBjb2wgaXMgYmVsb3cgb3VyIGVsZW1lbnQsIGJ1dCB3ZSBoYXZlbid0IGNhdWdodCBpdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsb3dlc3QgPSBNYXRoLm1heChsb3dlc3QsIHBvcy5jb2wgKyBkaW1zLngpOyAgICAgICAgICAgICAgICAgICAgICAgIC8vXHRTZXQgdGhlIGxvd2VzdCBjb2wgdG8gYmUgYmVsb3cgaXRcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IG5ld1BvczogTmdHcmlkSXRlbVBvc2l0aW9uID0geyBjb2w6IGxvd2VzdCwgcm93OiByIH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChsb3dlc3QgIT0gaXRlbVBvcy5jb2wgJiYgdGhpcy5faXNXaXRoaW5Cb3VuZHNYKG5ld1BvcywgaXRlbURpbXMpKSB7XHQvL1x0SWYgdGhlIGl0ZW0gaXMgbm90IGFscmVhZHkgb24gdGhpcyBjb2wgbW92ZSBpdCB1cFxyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHNob3VsZFNhdmUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5zYXZlUG9zaXRpb24obmV3UG9zKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uc2V0R3JpZFBvc2l0aW9uKG5ld1Bvcyk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5vbkNhc2NhZGVFdmVudCgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fYWRkVG9HcmlkKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGl0ZW1EaW1zLnk7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0bG93Q29sW3IgKyBpXSA9IGxvd2VzdCArIGl0ZW1EaW1zLng7XHQvL1x0VXBkYXRlIHRoZSBsb3dlc3QgY29sIHRvIGJlIGJlbG93IHRoZSBpdGVtXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZml4R3JpZFBvc2l0aW9uKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSk6IE5nR3JpZEl0ZW1Qb3NpdGlvbiB7XHJcblx0XHR3aGlsZSAodGhpcy5faGFzR3JpZENvbGxpc2lvbihwb3MsIGRpbXMpIHx8ICF0aGlzLl9pc1dpdGhpbkJvdW5kcyhwb3MsIGRpbXMpKSB7XHJcblx0XHRcdGlmICh0aGlzLl9oYXNHcmlkQ29sbGlzaW9uKHBvcywgZGltcykpIHtcclxuXHRcdFx0XHRzd2l0Y2ggKHRoaXMuY2FzY2FkZSkge1xyXG5cdFx0XHRcdFx0Y2FzZSAndXAnOlxyXG5cdFx0XHRcdFx0Y2FzZSAnZG93bic6XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRwb3Mucm93Kys7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnbGVmdCc6XHJcblx0XHRcdFx0XHRjYXNlICdyaWdodCc6XHJcblx0XHRcdFx0XHRcdHBvcy5jb2wrKztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1kocG9zLCBkaW1zKSkge1xyXG5cdFx0XHRcdHBvcy5jb2wrKztcclxuXHRcdFx0XHRwb3Mucm93ID0gMTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWChwb3MsIGRpbXMpKSB7XHJcblx0XHRcdFx0cG9zLnJvdysrO1xyXG5cdFx0XHRcdHBvcy5jb2wgPSAxO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcG9zO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfaXNXaXRoaW5Cb3VuZHNYKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSkge1xyXG5cdFx0cmV0dXJuICh0aGlzLl9tYXhDb2xzID09IDAgfHwgKHBvcy5jb2wgKyBkaW1zLnggLSAxKSA8PSB0aGlzLl9tYXhDb2xzKTtcclxuXHR9XHJcblx0cHJpdmF0ZSBfaXNXaXRoaW5Cb3VuZHNZKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSkge1xyXG5cdFx0cmV0dXJuICh0aGlzLl9tYXhSb3dzID09IDAgfHwgKHBvcy5yb3cgKyBkaW1zLnkgLSAxKSA8PSB0aGlzLl9tYXhSb3dzKTtcclxuXHR9XHJcblx0cHJpdmF0ZSBfaXNXaXRoaW5Cb3VuZHMocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5faXNXaXRoaW5Cb3VuZHNYKHBvcywgZGltcykgJiYgdGhpcy5faXNXaXRoaW5Cb3VuZHNZKHBvcywgZGltcyk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9hZGRUb0dyaWQoaXRlbTogTmdHcmlkSXRlbSk6IHZvaWQge1xyXG5cdFx0aWYgKCF0aGlzLl9lbmFibGVDb2xsaXNpb25EZXRlY3Rpb24pIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblx0XHRjb25zdCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSA9IGl0ZW0uZ2V0U2l6ZSgpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9oYXNHcmlkQ29sbGlzaW9uKHBvcywgZGltcykpIHtcclxuXHRcdFx0dGhpcy5fZml4R3JpZENvbGxpc2lvbnMocG9zLCBkaW1zKTtcclxuXHRcdFx0cG9zID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGxldCBqOiBudW1iZXIgPSAwOyBqIDwgZGltcy55OyBqKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3Bvcy5yb3cgKyBqXSA9PSBudWxsKSB0aGlzLl9pdGVtR3JpZFtwb3Mucm93ICsgal0gPSB7fTtcclxuXHJcblx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBkaW1zLng7IGkrKykge1xyXG5cdFx0XHRcdHRoaXMuX2l0ZW1HcmlkW3Bvcy5yb3cgKyBqXVtwb3MuY29sICsgaV0gPSBpdGVtO1xyXG5cclxuXHRcdFx0XHR0aGlzLl91cGRhdGVTaXplKHBvcy5jb2wgKyBkaW1zLnggLSAxLCBwb3Mucm93ICsgZGltcy55IC0gMSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3JlbW92ZUZyb21HcmlkKGl0ZW06IE5nR3JpZEl0ZW0pOiB2b2lkIHtcclxuXHRcdGZvciAobGV0IHkgaW4gdGhpcy5faXRlbUdyaWQpXHJcblx0XHRcdGZvciAobGV0IHggaW4gdGhpcy5faXRlbUdyaWRbeV0pXHJcblx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3ldW3hdID09IGl0ZW0pXHJcblx0XHRcdFx0XHRkZWxldGUgdGhpcy5faXRlbUdyaWRbeV1beF07XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF91cGRhdGVTaXplKGNvbD86IG51bWJlciwgcm93PzogbnVtYmVyKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fZGVzdHJveWVkKSByZXR1cm47XHJcblx0XHRjb2wgPSAoY29sID09IHVuZGVmaW5lZCkgPyB0aGlzLl9nZXRNYXhDb2woKSA6IGNvbDtcclxuXHRcdHJvdyA9IChyb3cgPT0gdW5kZWZpbmVkKSA/IHRoaXMuX2dldE1heFJvdygpIDogcm93O1xyXG5cclxuXHRcdGxldCBtYXhDb2w6IG51bWJlciA9IE1hdGgubWF4KHRoaXMuX2N1ck1heENvbCwgY29sKTtcclxuXHRcdGxldCBtYXhSb3c6IG51bWJlciA9IE1hdGgubWF4KHRoaXMuX2N1ck1heFJvdywgcm93KTtcclxuXHJcblx0XHRpZiAobWF4Q29sICE9IHRoaXMuX2N1ck1heENvbCB8fCBtYXhSb3cgIT0gdGhpcy5fY3VyTWF4Um93KSB7XHJcblx0XHRcdHRoaXMuX2N1ck1heENvbCA9IG1heENvbDtcclxuXHRcdFx0dGhpcy5fY3VyTWF4Um93ID0gbWF4Um93O1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd3aWR0aCcsICcxMDAlJyk7Ly8obWF4Q29sICogKHRoaXMuY29sV2lkdGggKyB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KSkrJ3B4Jyk7XHJcblx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnaGVpZ2h0JywgKHRoaXMuX2dldE1heFJvdygpICogKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpICsgJ3B4Jyk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9nZXRNYXhSb3coKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCB0aGlzLl9pdGVtcy5tYXAoKGl0ZW06IE5nR3JpZEl0ZW0pID0+IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCkucm93ICsgaXRlbS5nZXRTaXplKCkueSAtIDEpKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2dldE1heENvbCgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIHRoaXMuX2l0ZW1zLm1hcCgoaXRlbTogTmdHcmlkSXRlbSkgPT4gaXRlbS5nZXRHcmlkUG9zaXRpb24oKS5jb2wgKyBpdGVtLmdldFNpemUoKS54IC0gMSkpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZ2V0TW91c2VQb3NpdGlvbihlOiBhbnkpOiBOZ0dyaWRSYXdQb3NpdGlvbiB7XHJcblx0XHRpZiAoKCg8YW55PndpbmRvdykuVG91Y2hFdmVudCAmJiBlIGluc3RhbmNlb2YgVG91Y2hFdmVudCkgfHwgKGUudG91Y2hlcyB8fCBlLmNoYW5nZWRUb3VjaGVzKSkge1xyXG5cdFx0XHRlID0gZS50b3VjaGVzLmxlbmd0aCA+IDAgPyBlLnRvdWNoZXNbMF0gOiBlLmNoYW5nZWRUb3VjaGVzWzBdO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHJlZlBvczogYW55ID0gdGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuXHRcdGxldCBsZWZ0OiBudW1iZXIgPSBlLmNsaWVudFggLSByZWZQb3MubGVmdDtcclxuXHRcdGxldCB0b3A6IG51bWJlciA9IGUuY2xpZW50WSAtIHJlZlBvcy50b3A7XHJcblxyXG5cdFx0aWYgKHRoaXMuY2FzY2FkZSA9PSAnZG93bicpIHRvcCA9IHJlZlBvcy50b3AgKyByZWZQb3MuaGVpZ2h0IC0gZS5jbGllbnRZO1xyXG5cdFx0aWYgKHRoaXMuY2FzY2FkZSA9PSAncmlnaHQnKSBsZWZ0ID0gcmVmUG9zLmxlZnQgKyByZWZQb3Mud2lkdGggLSBlLmNsaWVudFg7XHJcblxyXG5cdFx0aWYgKHRoaXMuaXNEcmFnZ2luZyAmJiB0aGlzLl96b29tT25EcmFnKSB7XHJcblx0XHRcdGxlZnQgKj0gMjtcclxuXHRcdFx0dG9wICo9IDI7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bGVmdDogbGVmdCxcclxuXHRcdFx0dG9wOiB0b3BcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9nZXRBYnNvbHV0ZU1vdXNlUG9zaXRpb24oZTogYW55KTogTmdHcmlkUmF3UG9zaXRpb24ge1xyXG5cdFx0aWYgKCgoPGFueT53aW5kb3cpLlRvdWNoRXZlbnQgJiYgZSBpbnN0YW5jZW9mIFRvdWNoRXZlbnQpIHx8IChlLnRvdWNoZXMgfHwgZS5jaGFuZ2VkVG91Y2hlcykpIHtcclxuXHRcdFx0ZSA9IGUudG91Y2hlcy5sZW5ndGggPiAwID8gZS50b3VjaGVzWzBdIDogZS5jaGFuZ2VkVG91Y2hlc1swXTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRsZWZ0OiBlLmNsaWVudFgsXHJcblx0XHRcdHRvcDogZS5jbGllbnRZXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZ2V0Q29udGFpbmVyQ29sdW1ucygpOiBudW1iZXIge1xyXG5cdFx0Y29uc3QgbWF4V2lkdGg6IG51bWJlciA9IHRoaXMuX25nRWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKG1heFdpZHRoIC8gKHRoaXMuY29sV2lkdGggKyB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9nZXRJdGVtRnJvbVBvc2l0aW9uKHBvc2l0aW9uOiBOZ0dyaWRSYXdQb3NpdGlvbik6IE5nR3JpZEl0ZW0ge1xyXG5cdFx0Zm9yIChsZXQgaXRlbSBvZiB0aGlzLl9pdGVtcykge1xyXG5cdFx0XHRjb25zdCBzaXplOiBOZ0dyaWRJdGVtRGltZW5zaW9ucyA9IGl0ZW0uZ2V0RGltZW5zaW9ucygpO1xyXG5cdFx0XHRjb25zdCBwb3M6IE5nR3JpZFJhd1Bvc2l0aW9uID0gaXRlbS5nZXRQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0aWYgKHBvcyAmJiBwb3NpdGlvbi5sZWZ0ID4gKHBvcy5sZWZ0ICsgdGhpcy5tYXJnaW5MZWZ0KSAmJiBwb3NpdGlvbi5sZWZ0IDwgKHBvcy5sZWZ0ICsgdGhpcy5tYXJnaW5MZWZ0ICsgc2l6ZS53aWR0aCkgJiZcclxuXHRcdFx0XHRwb3NpdGlvbi50b3AgPiAocG9zLnRvcCArIHRoaXMubWFyZ2luVG9wKSAmJiBwb3NpdGlvbi50b3AgPCAocG9zLnRvcCArIHRoaXMubWFyZ2luVG9wICsgc2l6ZS5oZWlnaHQpKSB7XHJcblx0XHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2NyZWF0ZVBsYWNlaG9sZGVyKGl0ZW06IE5nR3JpZEl0ZW0pOiB2b2lkIHtcclxuXHRcdGNvbnN0IHBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdGNvbnN0IGRpbXM6IE5nR3JpZEl0ZW1TaXplID0gaXRlbS5nZXRTaXplKCk7XHJcblxyXG5cdFx0Y29uc3QgZmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KE5nR3JpZFBsYWNlaG9sZGVyKTtcclxuXHRcdHZhciBjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxOZ0dyaWRQbGFjZWhvbGRlcj4gPSBpdGVtLmNvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoZmFjdG9yeSk7XHJcblx0XHR0aGlzLl9wbGFjZWhvbGRlclJlZiA9IGNvbXBvbmVudFJlZjtcclxuXHRcdGNvbnN0IHBsYWNlaG9sZGVyOiBOZ0dyaWRQbGFjZWhvbGRlciA9IGNvbXBvbmVudFJlZi5pbnN0YW5jZTtcclxuXHRcdHBsYWNlaG9sZGVyLnJlZ2lzdGVyR3JpZCh0aGlzKTtcclxuXHRcdHBsYWNlaG9sZGVyLnNldENhc2NhZGVNb2RlKHRoaXMuY2FzY2FkZSk7XHJcblx0XHRwbGFjZWhvbGRlci5zZXRHcmlkUG9zaXRpb24oeyBjb2w6IHBvcy5jb2wsIHJvdzogcG9zLnJvdyB9KTtcclxuXHRcdHBsYWNlaG9sZGVyLnNldFNpemUoeyB4OiBkaW1zLngsIHk6IGRpbXMueSB9KTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2VtaXRPbkl0ZW1DaGFuZ2UoKSB7XHJcblx0XHR0aGlzLm9uSXRlbUNoYW5nZS5lbWl0KHRoaXMuX2l0ZW1zLm1hcCgoaXRlbTogTmdHcmlkSXRlbSkgPT4gaXRlbS5nZXRFdmVudE91dHB1dCgpKSk7XHJcblx0fVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
