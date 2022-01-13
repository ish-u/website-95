document.addEventListener("DOMContentLoaded", () => {
  getBlogs();
  const buttons = document.getElementsByClassName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons.item(i).addEventListener("click", (event) => {
      changeActiveButton(buttons.item(i).dataset.name);
    });
  }
});

// Clock Function
setInterval(() => {
  const clock = document.getElementById("clock");
  clock.innerHTML = new Date().toLocaleTimeString().toString();
}, 1000);

// Chnage Active Button
function changeActiveButton(name) {
  const buttons = document.getElementsByClassName("button");
  const windows = document.getElementsByClassName("container");
  console.log;
  for (let i = 0; i < buttons.length; i++) {
    if (buttons.item(i).dataset.name == name) {
      buttons.item(i).className = "button active";
      windows.item(i).className = "container";
    } else {
      buttons.item(i).className = "button";
      windows.item(i).className = "container hide";
    }
  }
}

// show Blog
function showBlog(blog) {
  const blogList = document.getElementById("blog-list");
  blogList.className = "hide";
  const toShow = document.getElementById(blog._id);
  toShow.className = "content";
  const blogs = document.getElementById("blog-container");
  blogs.childNodes.forEach((blogPost) => {
    if (blogPost.id !== blog._id) {
      blogPost.className = "content hide";
    }
  });
}

// hide Blog and show blog list
function hideBlog() {
  const blogList = document.getElementById("blog-list");
  blogList.className = "";
  const blogs = document.getElementById("blog-container");
  blogs.childNodes.forEach((blogPost) => {
    blogPost.className = "content hide";
  });
}

// get blogs
function getBlogs() {
  fetch("https://anmoldoesleetcode.ishu2.repl.co/api/posts/blogs")
    .then((res) => res.json())
    .then((resJSON) => {
      const blogWindow = document.querySelector(`[data-name="blog"]`);
      resJSON.reverse();

      const blogContainer = document.createElement("div");
      blogContainer.id = "blog-container";
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
        blogElement.className = "content hide";
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
