import { useState, useEffect } from 'react';

export function useNotification() {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const showNotification = (title, options) => {
    if (permission === 'granted') {
      new Notification(title, options);
    }
  };

  return {
    permission,
    requestPermission,
    showNotification
  };
}
