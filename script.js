const form = document.querySelector(".form-principal");
const input = document.querySelector("#username");
const btnSubmit = document.querySelector(".btn-submit");

function checkInputs(input) {
  let filled = true;

  if (input.value === "") {
    filled = false;
  }
  return filled;
}

input.addEventListener("keyup", function () {
  if (checkInputs(input)) {
    btnSubmit.disabled = false;
    btnSubmit.style.background = "rgba(214, 51, 108, 1)";
    btnSubmit.style.color = "rgba(255, 255, 255, 1)";
    btnSubmit.style.cursor = "pointer";
  } else {
    btnSubmit.disabled = true;
    btnSubmit.style.background = "rgba(214, 51, 108, 0.4)";
    btnSubmit.style.color = "rgba(255, 255, 255, 0.35)";
    btnSubmit.style.cursor = "default";
  }
});

const data = async input => {
  const response = await fetch(`https://api.github.com/users/${input}`)
    .then(response => {
        console.log(response)
      const btn = document.querySelector(".btn-submit");
      btn.innerHTML = `<img src='./assets/spinner.png' class='spinner-img'>`;

      if (response.status == 200) {
        setTimeout(() => {
          btn.innerText = "Ver Perfil do Github";
          window.location.replace("./profiles/index.html");
        }, 2000);
      } else {
        localStorage.removeItem("dados");
        const msg = document.querySelector(".msg-error");
        msg.remove();
        setTimeout(() => {
          btn.innerText = "Ver Perfil do Github";
          renderError();
        }, 2000);
      }
      
      return response.json();
    })
    .then(responseJson => responseJson)
    .catch(err => renderError(err));

  return response;
};

function renderError() {
  const res = document.querySelector(".res-error");
  const msg = document.createElement("small");
  const inputError = document.querySelector("#username");

  inputError.style.border = "1px solid rgba(214, 51, 108, 1)";

  msg.innerHTML = "";
  msg.innerText = "Usuario não encontrado";
  msg.classList.add("msg-error");

  res.appendChild(msg);
}

function removeError() {
  input.addEventListener("keyup", () => {
    const msgError = document.querySelector(".msg-error");
    msgError.remove();
  });
}

removeError();

function renderImages(data) {
  const div = document.querySelector(".align-image");
  if (data.length < 3) {
    data.forEach(e => {
      const img = document.createElement("img");
      img.src = e.avatar_url;
      img.id = e.login;
      img.classList.add("remove");
      div.appendChild(img);
    });
  } else {
    for (let i = data.length - 1; i > data.length - 4; i--) {
      const img = document.createElement("img");
      img.src = data[i].avatar_url;
      img.id = data[i].login;
      img.classList.add("remove");
      div.appendChild(img);
    }
  }
}

let historyArr = [];
const newHistoryArr = [...new Set(historyArr)];
const modifyHistoryArr = JSON.stringify(newHistoryArr);

async function validateInput() {
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const verifyInput = input.value;
    const modifyApi = await data(verifyInput);
    console.log(modifyApi)
    const modify = JSON.stringify(await data(verifyInput));
    const modifyParse = JSON.parse(modify);
    if (!modifyApi.message) {
      historyArr.push(modifyParse);
      const resHistorico = [...historyArr];
      const transformHist = JSON.stringify(resHistorico);
      localStorage.setItem("dados", modify);
      localStorage.setItem("historico", transformHist);

      const reserve = localStorage.getItem("historico");
      const reserveParse = JSON.parse(reserve);
      const newReserveParse = [...new Set(reserveParse)];

      const removeImgs = document.querySelectorAll(".remove");
      removeImgs.forEach(e => {
        e.remove();
      });
      function renderImages(data) {
        const div = document.querySelector(".align-image");
        if (data.length < 3) {
          data.forEach(e => {
            const img = document.createElement("img");
            img.src = e.avatar_url;
            img.alt = e.login;
            img.id = e.login;
            img.classList.add("remove");
            div.appendChild(img);
          });
        } else {
          for (let i = data.length - 1; i > data.length - 4; i--) {
            const img = document.createElement("img");
            img.src = data[i].avatar_url;
            img.alt = data[i].login;
            img.id = data[i].login;
            img.classList.add("remove");
            div.appendChild(img);
          }
        }
      }

      renderImages(newReserveParse);
    }
  });
}

validateInput();

const reserve = localStorage.getItem("historico");
const reserveParse = JSON.parse(reserve);
const newReserveParse = [...new Set(reserveParse)];
if (newReserveParse.length > 0) {
  const removeImgs = document.querySelectorAll(".remove");
  removeImgs.forEach(e => {
    e.remove();
  });
  historyArr = [];
  historyArr = [...reserveParse];

  renderImages(newReserveParse);
}

let arrImage = [];
const imgProfiles = document.querySelectorAll(".remove");
imgProfiles.forEach(e => {
  newReserveParse.forEach(ev => {
    e.addEventListener("click", event => {
      const modal = document.querySelector(".modal-loading");
      modal.classList.remove("hidden");
      if (event.target.id == ev.login) {
        setTimeout(() => {
          const converseEv = JSON.stringify(ev);
          localStorage.removeItem("dados");

          localStorage.setItem("dados", converseEv);
          window.location.replace("./profiles/index.html");
        }, 2000);
      }
    });
  });
});

