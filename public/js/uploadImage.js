const uploadButton = document.querySelector("#browse-btn");
const fileInfo = document.querySelector(".file-info");
const realInput = document.getElementById("real-input");

let recipeCroppie;

uploadButton.addEventListener("click", () => {
  realInput.click();
});

realInput.addEventListener("change", () => {
  const name = realInput.value.split(/\\|\//).pop();
  fileInfo.innerHTML = name;
  resetBtn.style.display = "none";
  cropBtn.style.display = "inline";
  rotateBtn.style.display = "inline";
  previewImg();
});

// displays the uploaded img
function previewImg() {
  var recImage = document.getElementById("recipe-img");
  if (recImage != null) {
    recImage.remove();
  }

  var imgPreview = document.querySelector(".img-preview");
  if (imgPreview != null) {
    imgPreview.remove();
  }

  if (recipeCroppie != null) {
    recipeCroppie.destroy();
    recipeCroppie = null;
  }

  var croppieArea = document.getElementById("croppie-area");
  var preview = document.createElement("img");
  preview.setAttribute("id", "recipe-img");
  preview.setAttribute("width", "800px");
  croppieArea.appendChild(preview);
  
  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();

  reader.addEventListener("load", function() {
    // result attr contains base64 encoded string
    preview.src = reader.result;
    
    // replace the img preview with the croppie tool
    croppify(preview.src);
  }, false);

  // read the contents of file and once it's done the loadend is triggered
  if (file) {
    reader.readAsDataURL(file);
  }
}

function croppify(src) {
  var cropImage = document.getElementById("croppie-area");
  var recImage = document.getElementById("recipe-img");
  recImage.remove();

  recipeCroppie = new Croppie(cropImage, {
    viewport: { width: 600, height: 600 },
    boundary: { width: 700, height: 700 },
    showZoomer: true,
    enableOrientation: true,
    enforceBoundary: true
  });

  recipeCroppie.bind({
    url: src, // it could be a url or base64 string
    orientation: 1
  });
}

var resetBtn = document.querySelector(".reset-btn");
var cropBtn = document.querySelector(".crop-btn");
var rotateBtn = document.querySelector(".rotate-btn");

resetBtn.addEventListener("click", function() {
  resetBtn.style.display = "none";
  cropBtn.style.display = "inline";
  rotateBtn.style.display = "inline";
  previewImg();
});

cropBtn.addEventListener("click", function() {
  // for some reason when I upload a diff image and click on crop, the click event
  // executes twice
  if (recipeCroppie == null) {
    return;
  }

  resetBtn.style.display = "inline";
  cropBtn.style.display = "none";
  rotateBtn.style.display = "none";

  recipeCroppie.result({
    type: "base64",
    size: "viewport",
    format: "png"

  }).then(function(base64) {
    var image = document.createElement("img");
    image.setAttribute("width", "100%");
    image.setAttribute("class", "img-preview");
    image.src = base64;

    if (recipeCroppie != null) {
      // destroy does not set it to null
      recipeCroppie.destroy();
      recipeCroppie = null;
    }

    var browseFilesSection = document.getElementsByClassName("input-container")[0];
    browseFilesSection.after(image);

    document.getElementById("cropped-img").setAttribute("value", base64);
  });
});

rotateBtn.addEventListener("click", function() {
  recipeCroppie.rotate(this.getAttribute("data-deg"));
});