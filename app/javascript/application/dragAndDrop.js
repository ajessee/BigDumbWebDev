const setUpDragAndDrop = () => {

  console.log("Loading Drag and Drop Module");

  const drag = {

    modalContent: document.querySelector("#modal-content"),

    drag_start: function (event) {
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
        var dm = document.getElementById('modal-content');
        dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
        dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
        event.preventDefault();
        return false;
    }
  }
  
  drag.modalContent.setAttribute('draggable', 'true');
  drag.modalContent.addEventListener('dragstart', drag.drag_start,false);
  document.body.addEventListener('dragover', drag.drag_over,false); 
  document.body.addEventListener('drop', drag.drop,false); 

  

  window.utils.dragAndDrop = drag;
}

document.addEventListener("DOMContentLoaded", setUpDragAndDrop);