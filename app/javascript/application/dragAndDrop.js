const setUpDragAndDrop = () => {

  if (event.target.location.pathname === '/scroll3d') return;

  console.info("Loading Drag and Drop Module");

  const drag = {

    modalContent: document.querySelector("#modal-content"),
    currentDragElement: null,

    drag_start: function (event) {
      window.utils.dragAndDrop.currentDragElement = event.target;
      if (event.target.nodeName === "INPUT") return;
      var style = window.getComputedStyle(event.target, null);
      event.dataTransfer.setData("text/plain",
      (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
    }, 

    drag_over: function (event) { 
      event.preventDefault(); 
      return false; 
    }, 

    drop: function (event) { 
        var offset = event.dataTransfer.getData("text/plain").split(',');
        var dm = window.utils.dragAndDrop.currentDragElement;
        if (dm.classList.contains('notifications-container')){
          dm.style.bottom = 'unset';
          dm.style.right = 'unset';
        }
        dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
        dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
        event.preventDefault();
        window.utils.dragAndDrop.currentDragElement = null;
        return false;
    }
  }
  
  document.body.addEventListener('dragover', drag.drag_over,false); 
  document.body.addEventListener('drop', drag.drop,false); 
  window.utils.dragAndDrop = drag;
}

document.addEventListener("DOMContentLoaded", setUpDragAndDrop);