import Notifcations from '../src';

const notifications = new Notifcations();

setTimeout(() => {
    notifications.add('Hej');
}, 1000);

setTimeout(() => {
    notifications.add('Hej');
}, 3000);
