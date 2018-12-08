"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var bem = function bem(className) {
  return {
    e: function e(elements) {
      var modifiers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var elClass = elements.split(' ').map(function (element) {
        return "".concat(className, "__").concat(element);
      }).join(' ');

      if (modifiers) {
        elClass += " ".concat(bem(elClass).m(modifiers));
      }

      return elClass;
    },
    m: function m(modifiers) {
      return modifiers.split(' ').map(function (modifier) {
        return "".concat(className, "--").concat(modifier);
      }).join(' ');
    },
    s: function s(state) {
      return "is-".concat(state);
    }
  };
};

var createEl = function createEl(tagName) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var element = document.createElement(tagName);
  Object.entries(attrs).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    element.setAttribute(key, value);
  });

  if (content) {
    element.innerHTML = content;
  }

  return element;
};

var createBtn = function createBtn(className, text, onClick) {
  var btn = createEl('button', {
    class: className
  }, text);
  btn.addEventListener('click', onClick);
  btn.setAttribute('type', 'button');
  return btn;
};

var Message =
/*#__PURE__*/
function () {
  function Message(message, props) {
    var _this = this;

    _classCallCheck(this, Message);

    _defineProperty(this, "onMouseOver", function () {
      _this.element.classList.add('is-showing-actions');

      _this.element.style.height = 'auto';
      setTimeout(function () {
        _this.element.style.height = "".concat(_this.element.getBoundingClientRect().height, "px");
      }, 50);
      clearTimeout(_this.timer);
    });

    _defineProperty(this, "onMouseLeave", function () {
      _this.element.classList.remove('is-showing-actions');

      _this.show();
    });

    _defineProperty(this, "show", function () {
      _this.element.style.height = 'auto';
      setTimeout(function () {
        _this.element.style.transform = 'translate3d(0, 0, 0)';
        _this.element.style.height = "".concat(_this.element.getBoundingClientRect().height, "px");
      }, 50);
      _this.timer = setTimeout(_this.hide, _this.props.ttl);
    });

    _defineProperty(this, "hide", function () {
      _this.element.classList.add('is-hiding');

      _this.element.style.transform = 'translate3d(100%, 0, 0)';

      _this.detach();

      setTimeout(function () {
        _this.element.style.height = '0px';
        _this.element.style.paddingTop = '0px';
        _this.element.style.paddingBottom = '0px';
        setTimeout(_this.destroy, _this.props.animationSpeed);
      }, _this.props.animationSpeed);
    });

    _defineProperty(this, "destroy", function () {
      _this.container.removeChild(_this.element);
    });

    this.message = message.message;
    this.action = message.action;
    this.modifier = message.modifier;
    this.props = props;
    this.container = this.props.container;
    this.timer = null;
    this.element = null;
    this.build();
    this.attach();
    setTimeout(this.show, 20);
  }

  _createClass(Message, [{
    key: "build",
    value: function build() {
      var _this2 = this;

      var baseClass = bem(this.props.className).e('notification');
      var elClassName = baseClass;

      if (this.modifier) {
        elClassName += " ".concat(bem(baseClass).m(this.modifier));
      }

      this.element = createEl('article', {
        class: elClassName
      });
      var messageEl = createEl('article', {
        class: bem(baseClass).e('message')
      }, this.message);
      var actionsEl = createEl('footer', {
        class: bem(baseClass).e('actions')
      });
      var closeEl = createBtn(bem(baseClass).e('btn', 'close'), this.props.closeText, this.hide);

      if (this.action) {
        var actionEl = createBtn(bem(baseClass).e('btn', this.action.className), this.action.text, function (e) {
          return _this2.action.onClick(e, _this2.hide);
        });
        actionsEl.appendChild(actionEl);
      }

      actionsEl.appendChild(closeEl);
      messageEl.appendChild(actionsEl);
      this.element.appendChild(messageEl);
      this.element.style.cssText = "transition: ".concat(this.props.animationSpeed / 1000, "s all; transform: translate3d(100%, 0, 0)");
      this.container.appendChild(this.element);
    }
  }, {
    key: "attach",
    value: function attach() {
      this.element.addEventListener('mouseover', this.onMouseOver);
      this.element.addEventListener('mouseleave', this.onMouseLeave);
    }
  }, {
    key: "detach",
    value: function detach() {
      this.element.removeEventListener('mouseover', this.onMouseOver);
      this.element.removeEventListener('mouseleave', this.onMouseLeave);
    }
  }]);

  return Message;
}();

var instance = null;

var Notifications =
/*#__PURE__*/
function () {
  function Notifications(props) {
    _classCallCheck(this, Notifications);

    this.container = null;
    this.props = Object.assign({
      className: 'notifications',
      ttl: 5000,
      animationSpeed: 300,
      el: document.body,
      closeText: 'Close'
    }, props);
    this.build();
  }

  _createClass(Notifications, [{
    key: "build",
    value: function build() {
      this.container = createEl('div', {
        class: this.props.className
      });
      this.props.el.appendChild(this.container);
    }
  }, {
    key: "add",
    value: function add(message) {
      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var modifier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var props = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var mergedProps = Object.assign({
        container: this.container
      }, this.props, props);
      return new Message({
        message: message,
        action: action,
        modifier: modifier
      }, mergedProps);
    }
  }]);

  return Notifications;
}();

var _default = {
  create: function create(props) {
    if (instance) {
      return;
    }

    instance = new Notifications(props);
  },
  add: function add() {
    var _instance;

    (_instance = instance).add.apply(_instance, arguments);
  }
};
exports.default = _default;