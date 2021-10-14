export function validateNums(evt) {
  const theEvent = evt || window.event;

  // Handle paste
  let key;
  if (theEvent.type === "paste") {
    key = evt.clipboardData.getData("text/plain");
  } else {
    // Handle key press
    key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
  }
  const regex = /[0-9]|\./;
  if (!regex.test(key)) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
}
