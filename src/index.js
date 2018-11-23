const bem = className => ({
    e(elements, modifiers = null) {
        let elClass = elements.split(' ').map(element => `${className}__${element}`).join(' ');

        if (modifiers) {
            elClass += ` ${bem(elClass).m(modifiers)}`;
        }

        return elClass;
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
        const baseClass = bem(this.props.className).e('notification');
        let elClassName = baseClass;

        if (this.modifier) {
            elClassName += ` ${bem(baseClass).m(this.modifier)}`;
        }

        this.element = createEl('article', { class: elClassName });

        const messageEl = createEl('article', { class: bem(baseClass).e('message') }, this.message);
        const actionsEl = createEl('footer', { class: bem(baseClass).e('actions') });
        const closeEl = createBtn(bem(baseClass).e('btn', 'close'), this.props.closeText, this.hide);

        if (this.action) {
            const actionEl = createBtn(bem(baseClass).e('btn', this.action.className), this.action.text, e => this.action.onClick(e, this.hide));

            actionsEl.appendChild(actionEl);
        }

        actionsEl.appendChild(closeEl);
        messageEl.appendChild(actionsEl);

        this.element.appendChild(messageEl);

        this.element.style.cssText = `transition: ${this.props.animationSpeed / 1000}s all; transform: translate3d(100%, 0, 0)`;
        this.container.appendChild(this.element);
    }

    attach() {
        this.element.addEventListener('mouseover', this.onMouseOver);
        this.element.addEventListener('mouseleave', this.onMouseLeave);
    }

    detach() {
        this.element.removeEventListener('mouseover', this.onMouseOver);
        this.element.removeEventListener('mouseleave', this.onMouseLeave);
    }

    onMouseOver = () => {
        this.element.classList.add('is-showing-actions');
        this.element.style.height = 'auto';

        setTimeout(() => {
            this.element.style.height = `${this.element.getBoundingClientRect().height}px`;
        }, 50);

        clearTimeout(this.timer);
    };

    onMouseLeave = () => {
        this.element.classList.remove('is-showing-actions');

        this.show();
    };

    show = () => {
        this.element.style.height = 'auto';

        setTimeout(() => {
            this.element.style.transform = 'translate3d(0, 0, 0)';
            this.element.style.height = `${this.element.getBoundingClientRect().height}px`;
        }, 50);

        this.timer = setTimeout(this.hide, this.props.ttl);
    };

    hide = () => {
        this.element.classList.add('is-hiding');
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

let instance = null;

class Notifications {
    constructor(props) {
        this.container = null;

        this.props = Object.assign({
            className: 'notifications',
            ttl: 5000,
            animationSpeed: 300,
            el: document.body,
            closeText: 'Close',
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

export default {
    create(props) {
        if (instance) {
            return;
        }

        instance = new Notifications(props);
    },

    add(...args) {
        instance.add(...args);
    },
};
