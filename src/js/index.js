
function showPassword(){

    const img_eye = document.getElementById('olhinhos-azuis');
    const password = document.getElementById('password_login');

    if(password.type === 'password'){
        password.type = 'text';
        img_eye.src = '../src/img/eye.png';
    }
    else{
        password.type = 'password';
        img_eye.src = '../src/img/closed_eye.png';
    }
}

//mobile

document.getElementById("btn-login2").addEventListener("click", function(event) {
    const leftContainer = document.getElementById("left");
    const rightContainer = document.getElementById("right");
    const topBar = document.getElementsByClassName('top-bar')[0];
    const bottomBar = document.getElementsByClassName('bottom-bar')[0];

    topBar.classList.add('hidden');
    bottomBar.classList.add('hidden');
    leftContainer.classList.remove('hidden');
    rightContainer.classList.add('hidden');

    history.pushState({ page: "left" }, "left", "?left");
    
    setTimeout(() => {
        leftContainer.style.display = "flex";
        rightContainer.style.display = "none";
    }, 500); 
});

window.addEventListener("popstate", function(event) {
    console.log("Usuário clicou no botão voltar");
    const leftContainer = document.getElementById("left");
    const rightContainer = document.getElementById("right");

    if (event.state && event.state.page === "left") {
        leftContainer.classList.remove('hidden');
        rightContainer.classList.add('hidden');

        setTimeout(() => {
            leftContainer.style.display = "flex";
            rightContainer.style.display = "none";
        }, 500); 
    } else {
        leftContainer.classList.add('hidden');
        rightContainer.classList.remove('hidden');

        setTimeout(() => {
            leftContainer.style.display = "none";
            rightContainer.style.display = "flex";
        }, 500); 
    }
});


//login
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    login();
});

function login(){
    
    const email = document.getElementById('email_login').value;
    const password = document.getElementById('password_login').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => { 
        alert('Login efetuado com sucesso!');
        window.location.href = "./src/pages/main_screen.html";
    })
    .catch((error) => {
        console.error('Erro ao autenticar usuário:', error);
        console.error('Código de erro:', error.code);
        alert('Erro ao autenticar usuário: ' + error.message);
    });
}




