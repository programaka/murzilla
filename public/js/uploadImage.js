const uploadButton = document.querySelector(".browse-btn");
const fileInfo = document.querySelector(".file-info");
const realInput = document.getElementById("real-input");

uploadButton.addEventListener("click", () => {
  realInput.click();
});

realInput.addEventListener("change", () => {
  const name = realInput.value.split(/\\|\//).pop();
  fileInfo.innerHTML = name;
});