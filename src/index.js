const bem = className => ({
    e(elements) {
        return elements.split(' ').map(element => `${className}__${element}`).join(' ');
    },

    m(modifiers) {
        return modifiers.split(' ').map(modifier => `${className}--${modifier}`).join(' ');
    },

    s(state) {
        return `is-${state}`;
    },
});

const createEl = (tagName, attrs = {}, content = null) => {
    const element = document.createElement(tagName);

    Object.entries(attrs).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    if (content) {
        element.innerHTML = content;
    }

    return element;
};

const createBtn = (className, text, onClick) => {
    const btn = createEl('button', { class: className }, text);

    btn.addEventListener('click', onClick);
    btn.setAttribute('type', 'button');

    return btn;
};

class Message {
    constructor(message, props) {
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

    build() {
        const elementBaseClassName = bem(this.props.className).e('notification');
        let elementClassName = elementBaseClassName;

        if (this.modifier) {
            elementClassName += ` ${bem(elementBaseClassName).m(this.modifier)}`;
        }

        this.element = createEl('article', { class: elementClassName });

        const messageEl = createEl('article', { class: bem(elementBaseClassName).e('message') }, this.message);

        if (this.props.closeBtn) {
            const closeEl = createBtn(bem(elementBaseClassName).e('close'), this.props.closeBtn, this.hide);

            this.element.appendChild(closeEl);
        }

        if (this.action) {
            const actionEl = createBtn(bem(elementBaseClassName).e('action'), this.action.text, this.action.onClick);

            this.element.appendChild(actionEl);
        }

        this.element.appendChild(messageEl);

        this.element.style.cssText = `transition: ${this.props.animationSpeed / 1000}s all; transform: translate3d(100%, 0, 0)`;
        this.container.appendChild(this.element);
    }

    attach() {
        this.element.addEventListener('mouseover', this.clearTimer);
        this.element.addEventListener('mouseleave', this.show);
    }

    detach() {
        this.element.removeEventListener('mouseover', this.clearTimer);
        this.element.removeEventListener('mouseleave', this.show);
    }

    clearTimer = () => {
        clearTimeout(this.timer);
    }

    show = () => {
        this.element.style.transform = 'translate3d(0, 0, 0)';
        this.element.style.height = `${this.element.getBoundingClientRect().height}px`;

        this.timer = setTimeout(this.hide, this.props.ttl);
    };

    hide = () => {
        this.element.style.transform = 'translate3d(100%, 0, 0)';
        this.detach();

        setTimeout(() => {
            this.element.style.height = '0px';
            this.element.style.paddingTop = '0px';
            this.element.style.paddingBottom = '0px';

            setTimeout(this.destroy, this.props.animationSpeed);
        }, this.props.animationSpeed);
    };

    destroy = () => {
        this.container.removeChild(this.element);
    };
}

export default class Notifications {
    constructor(props) {
        this.container = null;

        this.props = Object.assign({
            className: 'notifications',
            ttl: 5000,
            animationSpeed: 300,
            el: document.body,
            closeBtn: false,
        }, props);

        this.build();
    }

    build() {
        this.container = createEl('div', { class: bem(this.props.className).e('container') });
        this.props.el.appendChild(this.container);
    }

    add(message, action = null, modifier = null, props = {}) {
        const mergedProps = Object.assign({ container: this.container }, this.props, props);

        return new Message({
            message,
            action,
            modifier,
        }, mergedProps);
    }
}
