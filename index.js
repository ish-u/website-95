document.addEventListener("DOMContentLoaded", async () => {
  // Canvas Initialization
  // ==========================================
  const canvas = document.getElementById("canvas");
  let strokeColor = "rgb(10,10,10)";
  let strokeWidth = 1;
  let secondStrokeColor = "rgb(255,255,255)";

  const ctx = canvas.getContext("2d");
  ctx.canvas.width = canvas.parentElement.clientWidth;
  ctx.canvas.height = canvas.parentElement.clientHeight;
  ctx.strokeStyle = "red";

  // const bounding = canvas.getBoundingClientRect();
  let mouseX = 0;
  let mouseY = 0;
  let isDrawing = false;

  canvas.addEventListener("mousedown", (e) => {
    const bounding = canvas.getBoundingClientRect();
    mouseX = e.clientX - bounding.left;
    mouseY = e.clientY - bounding.top;
    isDrawing = true;
  });

  canvas.addEventListener("mousemove", async (e) => {
    if (isDrawing) {
      const bounding = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      console.log(strokeWidth);
      ctx.moveTo(mouseX, mouseY);
      ctx.lineTo(e.clientX - bounding.left, e.clientY - bounding.top);
      ctx.stroke();
      mouseX = e.clientX - bounding.left;
      mouseY = e.clientY - bounding.top;
    }
  });

  canvas.addEventListener("mouseup", (_) => {
    isDrawing = false;
  });

  // Adding color
  const defaultColors = [
    "rgb(0,0,0)", // Black
    "rgb(128,128,128)", // Dark Gray
    "rgb(128,0,0)", // Dark Red
    "rgb(128,128,0)", // Pea Green
    "rgb(0,128,0)", // Dark Green
    "rgb(0,128,128)", // Slate
    "rgb(0,0,128)", // Dark Blue
    "rgb(128,0,128)", // Lavender
    "rgb(128,128,64)", //
    "rgb(0,64,64)", //
    "rgb(0,128,255)", //
    "rgb(0,64,128)", //
    "rgb(64,0,255)", //
    "rgb(128,64,0)", //

    "rgb(255,255,255)", // White
    "rgb(192,192,192)", // Light Gray
    "rgb(255,0,0)", // Bright Red
    "rgb(255,255,0)", // Yellow
    "rgb(0,255,0)", // Bright Green
    "rgb(0,255,255)", // Cyan
    "rgb(0,0,255)", // Bright Blue
    "rgb(255,0,255)", // Magenta
    "rgb(255,255,128)", //
    "rgb(0,255,128)", //
    "rgb(128,255,255)", //
    "rgb(128,128,255)", //
    "rgb(255,0,128)", //
    "rgb(255,128,64)",
  ].map((item) => {
    const color = document.createElement("div");
    color.classList.add("colors");
    color.style.background = item;
    color.addEventListener("click", () => {
      strokeColor = item;
      document.getElementById("color-one").style.background = strokeColor;
    });
    return color;
  });

  const colorList = document.getElementById("color-list");
  colorList.append(...defaultColors);

  // setting the colors of the color switcher
  document.getElementById("color-one").style.background = strokeColor;
  document.getElementById("color-two").style.background = secondStrokeColor;

  // color switcher
  document.getElementById("color-switcher").addEventListener("click", () => {
    const temp = strokeColor;
    strokeColor = secondStrokeColor;
    secondStrokeColor = temp;

    // setting the colors of the color switcher
    document.getElementById("color-one").style.background = strokeColor;
    document.getElementById("color-two").style.background = secondStrokeColor;
  });

  // stroke menu - for line width
  const strokeOptions = document.getElementsByClassName("stroke-option");
  for (let i = 0; i < strokeOptions.length; i++) {
    strokeOptions.item(i).addEventListener("click", () => {
      strokeWidth = i + 1;
      const strokeOptionsTemp = document.getElementsByClassName("stroke-option");
      for (let j = 0; j < strokeOptionsTemp.length; j++) {
        if (i === j) {
          strokeOptionsTemp.item(j).className = "stroke-option stroke-option-selected";
        } else {
          strokeOptionsTemp.item(j).className = "stroke-option";
        }
      }
    });
  }
  // ==========================================

  // Fetching Song Status and Blogs
  getSongDetails();
  getBlogs();

  setTimeout(() => {
    document.getElementById("content").style.display = "block";
    document.getElementById("loader").style.display = "none";
    // setting canvas height and width
    ctx.canvas.width = canvas.parentElement.clientWidth;
    ctx.canvas.height = canvas.parentElement.clientHeight;
    // document.getElementById("banner").style.display = "flex";
  }, 1000);

  // updating song details every 30 seconds
  setInterval(async () => {
    await getSongDetails();
  }, 30000);

  // Task Bar Buttons
  const buttons = document.getElementsByClassName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons.item(i).addEventListener("click", () => {
      changeActiveButton(buttons.item(i), false);
    });
  }

  // Close Buttons
  const closeButtons = document.getElementsByClassName("close");
  for (let i = 0; i < closeButtons.length; i++) {
    closeButtons.item(i).addEventListener("click", () => {
      changeActiveButton(closeButtons.item(i), true);
    });
  }

  // Making Windows Draggable and Moving them to front on Click
  const windows = document.getElementsByClassName("container");
  for (let i = 0; i < windows.length; i++) {
    dragElement(windows.item(i));
    windows.item(i).addEventListener("click", () => {
      moveWindowToFront(windows.item(i).dataset.name);
    });
  }

  // Start Button and Start Menu
  const startButton = document.getElementById("start-button");
  const startMenu = document.getElementsByClassName("start-menu")[0];
  startButton.addEventListener("click", () => {
    if (startMenu.className === "start-menu") {
      startMenu.className = "start-menu hide";
    } else {
      startMenu.className = "start-menu";
    }
  });

  const startMenuButton = document.getElementsByClassName("menu-button");
  for (let i = 0; i < startMenuButton.length; i++) {
    startMenuButton.item(i).addEventListener("click", () => {
      changeActiveButton(startMenuButton.item(i), false);
    });
  }
});

// Clock Function
setInterval(() => {
  const clock = document.getElementById("clock");
  clock.innerHTML = new Date().toLocaleTimeString().toString();
}, 1000);

// Change Active Button
function changeActiveButton(button, resetWindow) {
  const window = document.querySelector(`[data-name=${button.dataset.name}]`);
  const taskBarButton = document.querySelector(`.button[data-name=${button.dataset.name}]`);
  if (resetWindow === true) {
    window.style.left = "25vw";
    window.style.top = "10vh";
    window.style.zIndex = "";
    window.className = "container hide";
    if (taskBarButton) {
      taskBarButton.className = "button";
      taskBarButton.style.display = "none";
    }
  } else {
    if (button.className === "button" || button.className === "button minimized") {
      button.className = "button active";
      window.className = "container";
      // moveWindowToFront(button.dataset.name);
    } else if (button.className === "button active") {
      button.className = "button minimized";
      window.className = "container hide";
    } else if (button.className === "menu-button") {
      window.className = "container";
      taskBarButton.style.display = "flex";
      taskBarButton.className = "button active";
      moveWindowToFront(button.dataset.name);
    }
  }
}

// Move the clicked window to front
function moveWindowToFront(windowName) {
  console.log(windowName);
  const windows = document.querySelectorAll(".container:not(.hide)");
  let zValues = [];
  for (let i = 0; i < windows.length; i++) {
    if (windows.item(i).style.zIndex === "") {
      windows.item(i).style.zIndex = 1000;
    }
    zValues.push(Number(windows.item(i).style.zIndex));
  }
  // console.log(zValues);
  for (let i = 0; i < windows.length; i++) {
    if (windows.item(i).dataset.name === windowName) {
      windows.item(i).style.zIndex = 1000;
    } else {
      windows.item(i).style.zIndex = Number(windows.item(i).style.zIndex) - 1;
    }
  }

  // setting canvas dimensions if they are not there
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx.canvas.height || !ctx.canvas.width) {
    ctx.canvas.width = canvas.parentElement.clientWidth;
    ctx.canvas.height = canvas.parentElement.clientHeight;
  }
}

// show Blog
function showBlog(blog) {
  const blogList = document.getElementById("blog-list");
  blogList.className = "hide";
  const toShow = document.getElementById(blog._id);
  toShow.className = "";
  const blogs = document.getElementById("blog-container");
  blogs.className = "content";
  blogs.childNodes.forEach((blogPost) => {
    if (blogPost.id !== blog._id) {
      blogPost.className = "hide";
    }
  });
}

// hide Blog and show blog list
function hideBlog() {
  const blogList = document.getElementById("blog-list");
  blogList.className = "";
  const blogs = document.getElementById("blog-container");
  blogs.className = "content hide";
  blogs.childNodes.forEach((blogPost) => {
    blogPost.className = "hide";
  });
}

// get blogs
async function getBlogs() {
  await fetch("https://anmoldoesleetcode.ishu2.repl.co/api/posts/blogs")
    .then((res) => res.json())
    .then((resJSON) => {
      const blogWindow = document.querySelector(`[data-name="blog"]`);
      resJSON.reverse();

      blogWindow.style.justifyContent = "flex-start";
      const blogContainer = document.createElement("div");
      blogContainer.id = "blog-container";
      blogContainer.className = "content hide";
      const blogList = document.createElement("ul");
      blogList.id = "blog-list";

      resJSON.forEach((blog) => {
        // creating blogList 'li' elements
        const li = document.createElement("li");
        li.innerHTML = blog.title + " - " + new Date(blog.date).toLocaleDateString();
        li.style = "color:blue; text-decoration:underline;";
        li.addEventListener("click", function () {
          showBlog(blog);
        });
        blogList.appendChild(li);

        // back button
        const backButton = document.createElement("a");
        backButton.style = "color:blue; text-decoration:underline; margin-left: 10px; margin-top:1px";
        backButton.innerHTML = "go back";
        backButton.addEventListener("click", function () {
          hideBlog();
        });

        // blog element
        const blogElement = document.createElement("div");
        blogElement.className = "hide";
        blogElement.style.overflowX = "hidden";
        blogElement.id = blog._id.toString();
        const heading = document.createElement("h1");
        const content = document.createElement("div");
        content.style.padding = "0px 5px";
        heading.innerHTML = blog.title;
        content.innerHTML += marked.parse(blog.body, { gfm: true });
        blogElement.appendChild(backButton);
        blogElement.appendChild(heading);
        blogElement.appendChild(content);
        blogContainer.appendChild(blogElement);
      });

      // appendig=ng blogList and blogConatiner to blogWindow
      blogWindow.appendChild(blogList);
      blogWindow.appendChild(blogContainer);
    })
    .catch((err) => console.log(err));
}

// get song details
async function getSongDetails() {
  const songName = document.getElementById("song-name");
  const mobileSongName = document.getElementById("mobile-song-name");
  mobileSongName.innerText = "Loading";
  songName.innerText = "Loading";

  await fetch("https://spotify-readme.ishu2.repl.co/nowPlaying/plainText")
    .then((res) => res.json())
    .then((resJSON) => {
      // updating Image
      const songImage = document.querySelectorAll(".social-link img")[3];
      const mobile_songImage = document.getElementById("mobile-song-image");

      songImage.src = "https://spotify-readme.ishu2.repl.co/nowPlaying/image?t=" + new Date().getMilliseconds();
      mobile_songImage.src = "https://spotify-readme.ishu2.repl.co/nowPlaying/image?t=" + new Date().getMilliseconds();

      // updating Text
      let songText = resJSON.name;
      songText += " ";
      resJSON.artists.forEach((artist) => {
        songText += " - " + artist;
      });
      const songName = document.getElementById("song-name");
      const mobileSongName = document.getElementById("mobile-song-name");
      mobileSongName.innerText = songText;
      songName.innerText = songText;
    });
}

// Taken From w3Schools - https://www.w3schools.com/howto/howto_js_draggable.asp
function dragElement(elmnt) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  elmnt.getElementsByClassName("title-container")[0].onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    moveWindowToFront(elmnt.dataset.name);

    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    let offsetLeft = elmnt.offsetLeft - pos1 > e.clientX ? elmnt.offsetLeft - e.clientY : elmnt.offsetLeft - pos1;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = offsetLeft + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
