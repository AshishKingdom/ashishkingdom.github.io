/*
    @Author: Ashish Kuswaha
    @Last Modified: 13/11/2023
    @Description: This file is used for the portfolio page.
*/

//preprocessing the achievement data
let temp_data = "";
achievements.forEach((achievement) => {
  temp_data += `<div class="achievement-info"><h3 class="achievement-title">${achievement.title}</h3><p class="achievement-description">${achievement.description}</p></div>`;
});
document.querySelector(".achievement").innerHTML = temp_data;

// preprocessing the skills data
temp_data = "";
skills_data.forEach((skill) => {
  temp_data += `<p><span class="skill-category">${skill.category} :</span>${skill.data}</p>`;
});
document.querySelector("div.skill-list").innerHTML = temp_data;

// preprocessing the timeline data
temp_data = "";
let count = 0;
timeline_data.forEach((timeline) => {
  if (count % 2 == 0) {
    temp_data += `<div class="timeline-block timeline-block-right">
    <div class="marker"></div>
    <div class="timeline-content">
      <h3>${timeline.timeRange}</h3>
      <span>${timeline.title}</span>
      <p>
        ${timeline.description}
      </p>
    </div>
  </div>`;
  } else {
    temp_data += `<div class="timeline-block timeline-block-left">
    <div class="marker"></div>
    <div class="timeline-content">
      <h3>${timeline.timeRange}</h3>
      <span>${timeline.title}</span>
      <p>
        ${timeline.description}
      </p>
    </div>
  </div>`;
  }
  count++;
});
document.querySelector(".timeline-container").innerHTML = temp_data;

// preprocessing the project data
temp_data = "";
let project_menu_data = "";
count = 0;
project_data.forEach((project) => {
  count++;
  project_menu_data += `<span class="project-name-list-item" data-project-id="${
    project.id
  }" data-active="${count == 1 ? "true" : "false"}">${project.name}</span>`;

  temp_data += `<div class="project-detail" data-project-id="${
    project.id
  }" data-active="${
    count == 1 ? "true" : "false"
  }"><div class="project-title">${project.title}</div>
  <div class="project-image"><img src="${project.image}" alt="${
    project.title + " " + project.description
  }" /></div>
  <div class="project-description">${project.description}</div>
  <div class="project-tech-stacks">
    ${project.techStacks
      .map((techStack) => {
        return `<span class="project-tech-stack">${techStack}</span>`;
      })
      .join("")}
  </div>
  <div class="project-links">
      ${
        project.link.github
          ? `<a href="${project.link.github}" class="project-link" alt="Github Link of Project : ${project.title}">Github</a>`
          : ""
      }
      ${
        project.link.youtube
          ? `<a href="${project.link.youtube}" class="project-link" alt="Youtube video link of Project : ${project.title}">Youtube</a>`
          : ""
      }
      ${
        project.link.live
          ? `<a href="${project.link.website}" class="project-link" alt="Live Deployment link of Project : ${project.title}">Live</a>`
          : ""
      }
  </div></div>`;
});
document.querySelector(
  ".project-container"
).innerHTML = `<div class="project-name-list-menu">${project_menu_data}</div>${temp_data}`;

window.addEventListener("load", function () {
  setTimeout(function () {
    document.body.classList.remove("loading");
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".content-not-ready").style.display = "block";
    document.getElementById("preloading-bg-imgs").innerHTML = "";
  }, 1000);
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
      target_element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// down arrow click
document
  .querySelector(".down-arrow-animation")
  .addEventListener("click", (event) => {
    const target = document.querySelector(".about-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
