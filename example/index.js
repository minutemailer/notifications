import Notifcations from '../src';

const notifications = new Notifcations();

setTimeout(() => {
    notifications.add('Hej', null, null, { closeBtn: '×' });
}, 1000);

setTimeout(() => {
    notifications.add('Hej');
}, 3000);
