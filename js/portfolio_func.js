/*
    @Author: Ashish Kuswaha
    @Date: 11/11/2023
    @Description: This file is used for the portfolio page.
*/

// create a typing effect on .content-right
const text =
  "Hey! My name is Ashish Kushwaha, a pre-final year student at JSS Academy of Technical Education Noida. In the digital realm, I craft powerful web applications,mastering the backend with Flask, FastAPI, and Django. I navigate the frontend landscape, sculpting interfaces with ReactJS. Beyond coding, I embrace the challenges of competitive programming, wielding the prowess of Data Structures and Algorithms. Venturing into the Machine Learning abyss, I decode patterns and algorithms to unravel the secrets of AI.";
const contentRight = document.querySelector(".content-right");
let index = 0;
function typing() {
  var content = contentRight.innerHTML;
  // remove last character
  content = content.substr(0, content.length - 1);
  if (index < text.length) {
    content += text.charAt(index);
    content += "█";
    contentRight.innerHTML = content;
    index++;
    setTimeout(typing, 20);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  // Simulate loading time (you can remove this in your actual implementation)
  setTimeout(function () {
    document.body.classList.remove("loading");
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".content-not-ready").style.display = "block";
    typing();
  }, 4000); // Adjust the timeout as needed
});

// handling of project menu click
document.querySelectorAll(".project-name-list-item").forEach((item) => {
  item.addEventListener("click", (event) => {
    const active = item.getAttribute("data-active") ?? "false";
    if (active == "false") {
      const target = item.getAttribute("data-project-id");
      document.querySelectorAll(".project-name-list-item").forEach((x) => {
        x.setAttribute("data-active", "false");
      });
      item.setAttribute("data-active", "true");
      //scroll to this menu and make it to center
      item.scrollIntoView({ behavior: "smooth", block: "center" });
      document.querySelectorAll(".project-detail").forEach((x) => {
        if (x.getAttribute("data-project-id") == target) {
          x.setAttribute("data-active", "true");
        } else {
          x.setAttribute("data-active", "false");
        }
      });
    }
  });
});

// handling of nav menu click
document.querySelectorAll(".navbar-item").forEach((item) => {
  item.addEventListener("click", (event) => {
    const target = item.getAttribute("data-target");
    console.log(target);
    const target_element = document.querySelector(
      "div[data-target='" + target + "']"
    );
    if (target_element) {
      target_element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});
