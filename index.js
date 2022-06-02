document.addEventListener("DOMContentLoaded", async () => {
  // Task Bar Buttons
  const buttons = document.getElementsByClassName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons.item(i).addEventListener("click", (event) => {
      changeActiveButton(buttons.item(i), false);
    });
  }

  // Close Buttons
  const closeButtons = document.getElementsByClassName("close");
  for (let i = 0; i < closeButtons.length; i++) {
    closeButtons.item(i).addEventListener("click", (event) => {
      changeActiveButton(closeButtons.item(i), true);
    });
  }

  // Making Windows Draggable and Moving them to front on Click
  const windows = document.getElementsByClassName("container");
  for (let i = 0; i < windows.length; i++) {
    dragElement(windows.item(i));
    windows.item(i).addEventListener("click", (event) => {
      moveWindowToFront(windows.item(i).dataset.name);
    });
  }

  await getSongDetails();
  await getBlogs();

  setTimeout(() => {
    document.getElementById("content").style.display = "block";
    document.getElementById("loader").style.display = "none";
  }, 1000);

  // updating song details every 30 seconds
  setInterval(async () => {
    await getSongDetails();
  }, 30000);
});

// Clock Function
setInterval(() => {
  const clock = document.getElementById("clock");
  clock.innerHTML = new Date().toLocaleTimeString().toString();
}, 1000);

// Change Active Button
function changeActiveButton(button, resetWindow) {
  console.log(button);
  const window = document.querySelector(`[data-name=${button.dataset.name}]`);
  if (resetWindow === true) {
    window.style.left = "25vw";
    window.style.top = "10vh";
    window.style.zIndex = "";
    window.className = "container hide";
    const taskBarButton = document.querySelector(
      `.button[data-name=${button.dataset.name}]`
    );
    taskBarButton.className = "button";
  } else {
    if (
      button.className === "button" ||
      button.className === "button minimized"
    ) {
      button.className = "button active";
      window.className = "container";
      moveWindowToFront(button.dataset.name);
    } else if (button.className === "button active") {
      button.className = "button minimized";
      window.className = "container hide";
    }
  }
}

// Move the clicked window to front
function moveWindowToFront(windowName) {
  const windows = document.querySelectorAll(".container:not(.hide)");
  var zValues = [];
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
      console.log(
        windows.item(i).dataset.name,
        windows.item(i).style.zIndex,
        windowName
      );
    } else {
      windows.item(i).style.zIndex = Number(windows.item(i).style.zIndex) - 1;
    }
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
  fetch("https://anmoldoesleetcode.ishu2.repl.co/api/posts/blogs")
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
        li.innerHTML =
          blog.title + " - " + new Date(blog.date).toLocaleDateString();
        li.style = "color:blue; text-decoration:underline;";
        li.addEventListener("click", function () {
          showBlog(blog);
        });
        blogList.appendChild(li);

        // back button
        const backButton = document.createElement("a");
        backButton.style =
          "color:blue; text-decoration:underline; margin-left: 10px; margin-top:1px";
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
  await fetch("https://spotify-readme.ishu2.repl.co/nowPlaying/plainText")
    .then((res) => res.json())
    .then((resJSON) => {
      // updating Image
      const songImage = document.querySelectorAll(".social-link img")[2];
      const mobile_songImage = document.getElementById("mobile-song-image");

      songImage.src =
        "https://spotify-readme.ishu2.repl.co/nowPlaying/image?t=" +
        new Date().getMilliseconds();
      mobile_songImage.src =
        "https://spotify-readme.ishu2.repl.co/nowPlaying/image?t=" +
        new Date().getMilliseconds();

      // updating Text
      var songText = resJSON.name;
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
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  elmnt.getElementsByClassName("title-container")[0].onmousedown =
    dragMouseDown;

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
    var offsetLeft =
      elmnt.offsetLeft - pos1 > e.clientX
        ? elmnt.offsetLeft - e.clientY
        : elmnt.offsetLeft - pos1;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = offsetLeft + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
