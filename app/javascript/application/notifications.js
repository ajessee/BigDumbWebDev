const setUpNotifications = () => {

  console.log("notifications.js");

  const notifications = {

    mainBody: document.querySelector('#main-body-container'),

    notificationsArray: [],

    getNotificationArrayHeight: function () {
      let accumulator = 0;
      this.notificationsArray.forEach(function(el, index){
        accumulator += el.offsetHeight;
        index > 0 ? accumulator += 10 : null;
      })
      return accumulator;
    },

    updateExistingNotificationsY: function (remove) {
      let self = this;
      if (this.notificationsArray.length > 1) {
        this.notificationsArray.forEach(function(el, index, arr){
          let elOffsetHeight = el.offsetHeight;
          let totalHeight = self.getNotificationArrayHeight();
          let amount = (totalHeight - elOffsetHeight);
          let operator = remove ? '' : '-' 
          if (index > 0 && !el.style.transform) {
            el.style.transform = `translateY(${operator}${amount}px)`
          }
          else if (remove) {
            let transY = parseInt(el.style.transform.match(/^.*?\([^\d]*(\d+)[^\d]*\).*$/)[1]);
            el.style.transform = `translateY(${operator}${(amount - transY - 10)}px)`

          }
        })
      }
      else if (this.notificationsArray.length > 0 && remove) {
        let notificationEl = this.notificationsArray[0];
        if (!notificationEl.classList.contains('slide-out')) {
          notificationEl.style.transform = `translateY(0px)`
        }
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
      if (e.animationName === "slideout") {
        container.remove();
        this.notificationsArray.forEach(function (el, index, arr) {
          if (el === container) {
            arr.splice(index, 1)
          }
        })
        this.updateExistingNotificationsY(true);
      } 
    }
  }

  window.utils.notifications = notifications;
}
document.addEventListener("DOMContentLoaded", setUpNotifications);