function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */


import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import on from '../../globals/js/misc/on';
import settings from '../../globals/js/settings';
import eventMatches from '../../globals/js/misc/event-matches';

var forEach =
/* #__PURE__ */
function () {
  return Array.prototype.forEach;
}();

var toArray = function toArray(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
};

var HeaderSubmenu =
/*#__PURE__*/
function (_mixin) {
  _inherits(HeaderSubmenu, _mixin);

  function HeaderSubmenu(element, options) {
    var _this;

    _classCallCheck(this, HeaderSubmenu);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HeaderSubmenu).call(this, element, options));

    _this._getAction = function (event) {
      var isFlyoutMenu = eventMatches(event, _this.options.selectorFlyoutMenu);

      if (isFlyoutMenu) {
        return _this.constructor.actions.DELEGATE_TO_FLYOUT_MENU;
      }

      switch (event.type) {
        case 'keydown':
          return {
            32: _this.constructor.actions.TOGGLE_SUBMENU_WITH_FOCUS,
            // space bar
            13: _this.constructor.actions.TOGGLE_SUBMENU_WITH_FOCUS,
            // enter
            27: _this.constructor.actions.CLOSE_SUBMENU // esc
            // possible arrow keys

          }[event.which];

        case 'click':
          return eventMatches(event, _this.options.selectorItem) ? _this.constructor.actions.CLOSE_SUBMENU : null;

        case 'blur':
        case 'focusout':
          {
            var isOfSelf = _this.element.contains(event.relatedTarget);

            return isOfSelf ? null : _this.constructor.actions.CLOSE_SUBMENU;
          }

        case 'mouseenter':
          return _this.constructor.actions.OPEN_SUBMENU;

        case 'mouseleave':
          return _this.constructor.actions.CLOSE_SUBMENU;

        default:
          return null;
      }
    };

    _this._getNewState = function (action) {
      var trigger = _this.element.querySelector(_this.options.selectorTrigger);

      var isExpanded = trigger.getAttribute(_this.options.attribExpanded) === 'true';

      switch (action) {
        case _this.constructor.actions.CLOSE_SUBMENU:
          return false;

        case _this.constructor.actions.OPEN_SUBMENU:
          return true;

        case _this.constructor.actions.TOGGLE_SUBMENU_WITH_FOCUS:
          return !isExpanded;

        default:
          return isExpanded;
      }
    };

    _this._setState = function (_ref) {
      var shouldBeExpanded = _ref.shouldBeExpanded,
          shouldFocusOnOpen = _ref.shouldFocusOnOpen;

      var trigger = _this.element.querySelector(_this.options.selectorTrigger);

      trigger.setAttribute(_this.options.attribExpanded, shouldBeExpanded);
      forEach.call(_this.element.querySelectorAll(_this.options.selectorItem), function (item) {
        item.tabIndex = shouldBeExpanded ? 0 : -1;
      }); // focus first submenu item

      if (shouldBeExpanded && shouldFocusOnOpen) {
        _this.element.querySelector(_this.options.selectorItem).focus();
      }
    };

    _this.getCurrentNavigation = function () {
      var focused = _this.element.ownerDocument.activeElement;
      return focused.nodeType === Node.ELEMENT_NODE && focused.matches(_this.options.selectorItem) ? focused : null;
    };

    _this.navigate = function (direction) {
      var items = toArray(_this.element.querySelectorAll(_this.options.selectorItem));

      var start = _this.getCurrentNavigation() || _this.element.querySelector(_this.options.selectorItemSelected);

      var getNextItem = function getNextItem(old) {
        var handleUnderflow = function handleUnderflow(index, length) {
          return index + (index >= 0 ? 0 : length);
        };

        var handleOverflow = function handleOverflow(index, length) {
          return index - (index < length ? 0 : length);
        }; // `items.indexOf(old)` may be -1 (Scenario of no previous focus)


        var index = Math.max(items.indexOf(old) + direction, -1);
        return items[handleUnderflow(handleOverflow(index, items.length), items.length)];
      };

      for (var current = getNextItem(start); current && current !== start; current = getNextItem(current)) {
        if (!current.matches(_this.options.selectorItemHidden) && !current.parentNode.matches(_this.options.selectorItemHidden) && !current.matches(_this.options.selectorItemSelected)) {
          current.focus();
          break;
        }
      }
    };

    _this._handleEvent = function (event) {
      var trigger = _this.element.querySelector(_this.options.selectorTrigger);

      if (!trigger) {
        return;
      }

      var action = _this._getAction(event);

      if (action) {
        var shouldBeExpanded = _this._getNewState(action);

        _this._setState({
          shouldBeExpanded: shouldBeExpanded
        });
      }
    };

    _this._handleKeyDown = function (event) {
      var trigger = _this.element.querySelector(_this.options.selectorTrigger);

      if (!trigger) {
        return;
      }

      var action = _this._getAction(event);

      if (event.which === 32) {
        event.preventDefault();
      }

      switch (action) {
        case _this.constructor.actions.DELEGATE_TO_FLYOUT_MENU:
          // currently we do not have a scenario that handles flyout menu
          // handleFlyoutMenu
          break;
        // currently we do not have a scenario that opens a submenu on keydown
        // case this.constructor.actions.OPEN_SUBMENU:

        case _this.constructor.actions.CLOSE_SUBMENU:
          {
            var shouldBeExpanded = _this._getNewState(action);

            _this._setState({
              shouldBeExpanded: shouldBeExpanded
            });

            break;
          }

        case _this.constructor.actions.TOGGLE_SUBMENU_WITH_FOCUS:
          {
            var _shouldBeExpanded = _this._getNewState(action);

            _this._setState({
              shouldBeExpanded: _shouldBeExpanded,
              shouldFocusOnOpen: true
            });

            break;
          }

        default:
          {
            var expanded = trigger.getAttribute(_this.options.attribExpanded) === 'true';

            if (expanded) {
              var direction = {
                38: _this.constructor.NAVIGATE.BACKWARD,
                40: _this.constructor.NAVIGATE.FORWARD
              }[event.which];

              switch (event.which) {
                case 35:
                  {
                    // end key
                    event.preventDefault(); // prevents key from scrolling page

                    var menuItems = _this.element.querySelectorAll(_this.options.selectorItem);

                    var lastMenuItem = menuItems[menuItems.length - 1];

                    if (lastMenuItem) {
                      lastMenuItem.focus();
                    }

                    break;
                  }

                case 36:
                  {
                    // home key
                    event.preventDefault(); // prevents key from scrolling page

                    var _this$element$querySe = _this.element.querySelectorAll(_this.options.selectorItem),
                        _this$element$querySe2 = _slicedToArray(_this$element$querySe, 1),
                        firstMenuItem = _this$element$querySe2[0];

                    if (firstMenuItem) {
                      firstMenuItem.focus();
                    }

                    break;
                  }

                case 38: // up arrow

                case 40:
                  // down arrow
                  _this.navigate(direction);

                  event.preventDefault(); // prevents keys from scrolling page

                  break;

                default:
                  break;
              }
            }

            break;
          }
      }
    };

    var hasFocusOut = 'onfocusout' in window;

    _this.manage(on(_this.element, hasFocusOut ? 'focusout' : 'blur', _this._handleEvent, !hasFocusOut));

    _this.manage(on(_this.element, 'mouseenter', _this._handleEvent));

    _this.manage(on(_this.element, 'mouseleave', _this._handleEvent));

    _this.manage(on(_this.element, 'click', _this._handleEvent));

    _this.manage(on(_this.element, 'keydown', _this._handleKeyDown));

    return _this;
  }
  /**
   * The map associating DOM element and HeaderSubmenu instance.
   * @member HeaderSubmenu.components
   * @type {WeakMap}
   */


  _createClass(HeaderSubmenu, null, [{
    key: "options",

    /**
     * The component options.
     * If `options` is specified in the constructor,
     * {@linkcode HeaderSubmenu.create .create()}, or
     * {@linkcode HeaderSubmenu.init .init()},
     * properties in this object are overriden for the instance being create and
     * how {@linkcode HeaderSubmenu.init .init()} works.
     * @member HeaderSubmenu.options
     * @type {object}
     * @property {string} selectorInit The data attribute to find side navs.
     */
    get: function get() {
      var prefix = settings.prefix;
      return {
        selectorInit: '[data-header-submenu]',
        selectorTrigger: ".".concat(prefix, "--header__menu-title"),
        selectorItem: ".".concat(prefix, "--header__menu .").concat(prefix, "--header__menu-item"),
        attribExpanded: 'aria-expanded'
      };
    }
    /**
     * Enum for navigating backward/forward.
     * @readonly
     * @member HeaderSubmenu.NAVIGATE
     * @type {object}
     * @property {number} BACKWARD Navigating backward.
     * @property {number} FORWARD Navigating forward.
     */

  }]);

  HeaderSubmenu.components = new WeakMap();
  HeaderSubmenu.actions = {
    CLOSE_SUBMENU: 'CLOSE_SUBMENU',
    OPEN_SUBMENU: 'OPEN_SUBMENU',
    TOGGLE_SUBMENU_WITH_FOCUS: 'TOGGLE_SUBMENU_WITH_FOCUS',
    DELEGATE_TO_FLYOUT_MENU: 'DELEGATE_TO_FLYOUT_MENU'
  };
  HeaderSubmenu.NAVIGATE = {
    BACKWARD: -1,
    FORWARD: 1
  };
  return HeaderSubmenu;
}(mixin(createComponent, initComponentBySearch, handles));

export { HeaderSubmenu as default };