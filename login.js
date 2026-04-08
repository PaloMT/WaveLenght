const btnCreate = document.getElementById('btn-create');
const btnJoin = document.getElementById('btn-join');
const inputName = document.getElementById('playerName');
const inputRoom = document.getElementById('roomCode');

function checkName() {
    const name = inputName.value.trim();
    if (!name) {
        alert("¡Eh! Necesitas un apodo para jugar.");
        inputName.focus();
        return null;
    }
    return name;
}

btnCreate.addEventListener('click', () => {
    const playerName = checkName();
    if (playerName) {
        console.log(`Pidiendo al servidor crear sala para: ${playerName}`);
         btnCreate.innerText = "Creando...";
    }
});


btnJoin.addEventListener('click', () => {
    const playerName = checkName();
    if (playerName) {
        const roomCode = inputRoom.value.trim().toUpperCase();
        
        if (!roomCode) {
            alert("Introduce el código de la sala a la que quieres entrar.");
            inputRoom.focus();
            return;
        }

        console.log(`Jugador ${playerName} intentando unirse a ${roomCode}`);
        btnJoin.innerText = "Conectando...";
    }
});