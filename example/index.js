import Notifcations from '../src';

Notifcations.create();

setTimeout(() => {
    Notifcations.add('This is a notification with a close btn.', null, null, { closeBtn: '×' });
}, 1000);

setTimeout(() => {
    Notifcations.add('Notifications without close btns can be closed by clicking on the notification IF the notification doesn\'t have a click handler');
}, 3000);

setTimeout(() => {
    Notifcations.add('Click me if you dare', {
        text: 'Click',
        className: 'success',
        onClick: (e, close) => {
            close();

            Notifcations.add('Hi there');
        },
    });
}, 3000);
