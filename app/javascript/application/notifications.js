const setUpNotifications = () => {

  console.log("notifications.js");

  const notifications = {

    notificationsContainer: document.querySelector("#notifications-container"),
    notificationsTitle: document.querySelector("#notifications-title"),
    notificationsMessage: document.querySelector("#notifications-message"),

    openNotification: (success, title, message, closeTime) => {
      let container = utils.notifications.notificationsContainer;
      let titleContainer = utils.notifications.notificationsTitle;
      let messageContainer = utils.notifications.notificationsMessage;
      container.style.display = 'block';
      container.style.backgroundColor = success ? '#6cbf28' : '#fe3b19';
      titleContainer.innerHTML = title;
      messageContainer.innerHTML = message;
      container.classList.add('slide-in');
      container.classList.contains('slide-out') ? container.classList.remove('slide-out') : null;
      if (closeTime) {
        setTimeout(utils.notifications.closeNotification, closeTime);
      }
    },

    closeNotification: () => {
      let container = utils.notifications.notificationsContainer;
      container.classList.add('slide-out');
      container.classList.contains('slide-in') ? container.classList.remove('slide-in') : null;
    },

    animationDone: (e) => {
      if (e.animationName === "slidein") {

      } else if (e.animationName === "slideout") {
        utils.notifications.notificationsContainer.style.display = 'none';
      }
    }

  }

  notifications.notificationsContainer.addEventListener("webkitAnimationEnd", notifications.animationDone);

  window.utils.notifications = notifications;
}

document.addEventListener("DOMContentLoaded", setUpNotifications);