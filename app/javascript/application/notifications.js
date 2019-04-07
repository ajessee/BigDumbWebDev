// Notifications module that allows for disappearing onscreen notifications
const setUpNotifications = () => {

  console.log("Loading Notifications Module");

  const notifications = {

    mainBody: document.querySelector('#main-body-container'),

    notificationsArray: [],

    getNotificationArrayHeight: function () {
      let accumulator = 0;
      this.notificationsArray.forEach(function (el, index) {
        accumulator += el.offsetHeight;
        index > 0 ? accumulator += 10 : null;
      })
      return accumulator;
    },

    updateNotificationsY: function (remove) {
      let self = this;
      if (this.notificationsArray.length === 1) {
        let el = this.notificationsArray[0];
        let elOffsetHeight = el.offsetHeight;
        let totalHeight = self.getNotificationArrayHeight();
        // removing last notification on screen, check to see element has been Y adjusted and that slide-out animation hasn't happened yet (if its in progress, no need to adjust Y position)
        // no op if it is the only notification on screen, we don't have to adjust the Y position
        if (remove && el.style.transform && !el.classList.contains('slide-out')) {
          // get existing Y adjustment, this number will always be negative
          let transY = parseInt(el.style.transform.match(/^.*?\([^\d]*(\d+)[^\d]*\).*$/)[1]);
          let amount = (elOffsetHeight - transY);
          el.style.transition = `transform 0.2s ease`
          el.style.transform = `translateY(${(amount)}px)`
        }
      } else if (this.notificationsArray.length > 1) {
        this.notificationsArray.forEach(function (el, index, arr) {
          let elOffsetHeight = el.offsetHeight;
          let totalHeight = self.getNotificationArrayHeight();
          let amount;
          // we are adding a notification and it hasn't been Y adjusted yet
          if (!remove && !el.style.transform && index !== 0) {
            el.style.transform = `translateY(-${totalHeight - elOffsetHeight}px)`
          } else if (remove && el.style.transform) {
            // deleting a notification that has been Y adjusted
            let transY2 = parseInt(el.style.transform.match(/^.*?\([^\d]*(\d+)[^\d]*\).*$/)[1]);
            el.style.transition = `transform 0.2s ease`
            el.style.transform = `translateY(-${(transY2 - elOffsetHeight)}px)`
          }
        })
      }
    },

    createNotificationElements: function () {
      let container = document.createElement('div');
      let title = document.createElement('h3');
      let message = document.createElement('p');
      let closeButton = document.createElement('button');
      let closeButtonIcon = document.createElement('i');
      let self = this;
      container.setAttribute('class', 'notifications-container');
      container.setAttribute('draggable', 'true');
      container.addEventListener('dragstart', window.utils.dragAndDrop.drag_start, false);
      title.setAttribute('class', 'notifications-title');
      message.setAttribute('class', 'notifications-message');
      closeButton.setAttribute('title', 'Close');
      closeButton.setAttribute('class', 'close-notification');
      closeButtonIcon.setAttribute('class', 'fas fa-times fa-2x');
      closeButtonIcon.setAttribute('aria-hidden', 'true');
      closeButton.appendChild(closeButtonIcon);
      container.appendChild(title);
      container.appendChild(message);
      let elementsObject = {
        container: container,
        title: title,
        message: message,
        closeButton: closeButton
      }
      return elementsObject;
    },

    openNotification: function (type, title, message, closeTime, closeButton) {
      // create notification element
      let elementsObject = this.createNotificationElements();
      let self = this;
      // set color, title, message
      switch (type) {
        case 'success':
          elementsObject.container.style.backgroundColor = '#6cbf28';
          break;
        case 'failure':
          elementsObject.container.style.backgroundColor = '#fe3b19';
          break;
        case 'alert':
          elementsObject.container.style.backgroundColor = '#ffff00';
          break;
        default:
          elementsObject.container.style.backgroundColor = '#6cbf28';
      }

      elementsObject.title.innerHTML = title;
      elementsObject.message.innerHTML = message;
      if (closeButton) {
        elementsObject.container.appendChild(elementsObject.closeButton);
        elementsObject.closeButton.addEventListener("click", function (e) {
          self.closeNotification(elementsObject.container, true);
        });
      }
      // add to notifications array
      this.notificationsArray.push(elementsObject.container);
      // add to main body
      this.mainBody.appendChild(elementsObject.container);
      // remove blur
      elementsObject.container.style.webkitFilter = "blur(0)";
      // update position
      this.updateNotificationsY();
      // add event listener
      elementsObject.container.addEventListener("webkitAnimationEnd", function (e) {
        self.animationDone(e, elementsObject.container)
      });
      // add slide-in class to bring notification into view and remove slide-out class if its still there.
      elementsObject.container.classList.add('slide-in');
      elementsObject.container.classList.contains('slide-out') ? elementsObject.container.classList.remove('slide-out') : null;
      // if we want to close it automatically, set timer for that
      if (closeTime) {
        setTimeout(function () {
          self.closeNotification(elementsObject.container);
        }, closeTime);
      }
    },

    closeNotification: function (container, immediate) {
      if (immediate) {
        this.removeNotification(container);
      } else {
        // add slide-out class to start animation to dismiss notification
        container.classList.add('slide-out');
        container.classList.contains('slide-in') ? container.classList.remove('slide-in') : null;
      }
    },

    closeAllNotifications: function () {
      let self = this;
      this.notificationsArray.forEach(function (el) {
        self.closeNotification(el);
      })
    },

    removeNotification: function (container) {
      container.remove();
      // remove the notification from the notification array
      this.notificationsArray.forEach(function (el, index, arr) {
        if (el === container) {
          arr.splice(index, 1)
        }
      })
    },

    animationDone: function (e, container) {
      // callback for the slideout animation done event listener
      if (e.animationName === "slideout") {
        // remove the container from the DOM
        this.removeNotification(container);
        // update the position of all the notifications on screen
        this.updateNotificationsY(true);
      }
    },

    // We're making an AJAX call to the server to see if there are any pending notifications to display. 
    checkNotifications: function () {
      let self = this;
      fetch('/notifications')
        .then(function (response) {
          return response.text();
        })
        .then(function(text) {
          let notification = JSON.parse(text);
          if (notification.newMessage.present) {
            self.openNotification(notification.newMessage.type, notification.newMessage.title, notification.newMessage.message, 6000, true);
          } else if (notification.location) {
            self.openNotification('alert', 'Here you go', 'This is the page you were trying to get to before you logged in.', 6000, true);
          }
        })
    }
  }

  window.utils.notifications = notifications;
  window.utils.notifications.checkNotifications();

}
document.addEventListener("DOMContentLoaded", setUpNotifications);