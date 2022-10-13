const btnToggleUser = document.querySelector(".btn-user");
btnToggleUser.addEventListener("click", event => {
  const btnModal = document.querySelector(".modal-loading");
  btnModal.classList.remove("hidden");
  event.preventDefault();
  setTimeout(() => {
    localStorage.removeItem("dados");
    window.location.replace("../index.html");
  }, 3000);
});

const verify = localStorage.getItem("dados");
const verifyParse = JSON.parse(verify);

const repos = async data => {
  const response = await fetch(
    `https://api.github.com/users/${data.login}/repos`
  )
    .then(response => response.json())
    .then(responseJson => responseJson);

  return response;
};

function renderHeader(data) {
  const divImg = document.querySelector(".div-image");
  const div = document.querySelector(".flex-column");
  const img = document.createElement("img");
  const h2 = document.createElement("h2");
  const small = document.createElement("small");
  const a = document.querySelector(".email-to");

  img.src = data.avatar_url;
  a.href = `mailto://${data.email}`;
  a.target = "_blank";
  img.alt = data.login;
  h2.innerText = data.name;
  small.innerText = data.bio;

  divImg.appendChild(img);
  div.append(h2, small);
}

renderHeader(verifyParse);

async function renderCards() {
  const ul = document.querySelector(".ul-main");

  const listRepository = await repos(verifyParse);
  listRepository.forEach(e => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const h3 = document.createElement("h3");
    const p = document.createElement("p");
    const divBtn = document.createElement("div");
    const btnRepo = document.createElement("button");
    const btnDemo = document.createElement("button");
    const ancoraRepo = document.createElement("a");
    const ancoraDemo = document.createElement("a");

    div.classList.add("container-li");
    divBtn.classList.add("buttons-flex");
    btnRepo.classList.add("btn-repo");
    btnDemo.classList.add("btn-demo");
    ancoraRepo.classList.add("link-repo");
    ancoraDemo.classList.add("link-demo");

    h3.innerText = e.name;
    p.innerText = e.description;
    ancoraRepo.href = e.svn_url;
    ancoraRepo.target = "_blank";
    ancoraRepo.innerText = "Repositório";
    ancoraDemo.href = e.homepage;
    ancoraDemo.target = "_blank";
    ancoraDemo.innerText = "Demo";

    btnRepo.appendChild(ancoraRepo);
    btnDemo.appendChild(ancoraDemo);
    divBtn.append(btnRepo, btnDemo);
    div.append(h3, p, divBtn);
    li.appendChild(div);
    ul.appendChild(li);
  });
}

renderCards();
