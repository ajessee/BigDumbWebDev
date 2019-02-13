const setUpNotifications = () => {

  console.log("notifications.js");

  const notifications = {

    mainBody: document.querySelector('#main-body-container'),

    notificationsArray: [],

    totalHeight: 0,

    updateExistingNotificationsY: function () {
      let self = this;
      if (this.notificationsArray.length > 1) {
        this.notificationsArray.forEach(function(notificationEl, index){
          if (index > 0) {
            let elOffsetHeight = notificationEl.offsetHeight;
            self.totalHeight += elOffsetHeight;
            notificationEl.style.transform = `translateY(-${self.totalHeight}px)`
          }
        })
      }
    },

    createNotificationElements: () => {
      let container = document.createElement('div');
      let title = document.createElement('h3');
      let message = document.createElement('p');
      container.setAttribute('class', 'notifications-container');
      title.setAttribute('class', 'notifications-title');
      message.setAttribute('class', 'notifications-message');
      container.appendChild(title);
      container.appendChild(message)
      let elementsObject = {
        container: container,
        title: title,
        message: message
      }
      return elementsObject;
    },

    openNotification: function (success, title, message, closeTime) {
      let elementsObject = this.createNotificationElements();
      let self = this;
      elementsObject.container.style.backgroundColor = success ? '#6cbf28' : '#fe3b19';
      elementsObject.title.innerHTML = title;
      elementsObject.message.innerHTML = message;
      this.notificationsArray.push(elementsObject.container);
      this.mainBody.appendChild(elementsObject.container);
      this.updateExistingNotificationsY();
      elementsObject.container.addEventListener("webkitAnimationEnd", function (e){
        self.animationDone(e, elementsObject.container)
      });
      elementsObject.container.style.webkitFilter = "blur(0)";
      elementsObject.container.classList.add('slide-in');
      elementsObject.container.classList.contains('slide-out') ? elementsObject.container.classList.remove('slide-out') : null;
      if (closeTime) {
        setTimeout(function() {
          self.closeNotification(elementsObject.container);
        }, closeTime);
      }
    },

    closeNotification: function(container) {
      container.classList.add('slide-out');
      container.classList.contains('slide-in') ? container.classList.remove('slide-in') : null;
    },

    animationDone: function(e, container) {
      let self = this;
      let elOffsetHeight = container.offsetHeight;
      if (e.animationName === "slideout") {
        container.remove();
        self.totalHeight -= elOffsetHeight;
      } 
    }
  }

  window.utils.notifications = notifications;
}
document.addEventListener("DOMContentLoaded", setUpNotifications);