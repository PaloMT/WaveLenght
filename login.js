// 1. Nos conectamos al servidor de Python
const socket = io('http://localhost:5000');

const btnCreate = document.getElementById('btn-create');
const btnJoin = document.getElementById('btn-join');
const inputName = document.getElementById('playerName');
const inputRoom = document.getElementById('roomCode');

function checkName() {
    const name = inputName.value.trim();
    if (!name) {
        alert("¡Eh! Necesitas un apodo para jugar.");
        return null;
    }
    return name;
}

// 2. Evento para Crear Sala
btnCreate.addEventListener('click', () => {
    const playerName = checkName();
    if (playerName) {
        btnCreate.innerText = "Creando...";
        socket.emit('create_room', { player: playerName });
    }
});
btnJoin.addEventListener('click', () => {
    const playerName = checkName();
    if (playerName) {
        const roomCode = inputRoom.value.trim().toUpperCase();
        if (!roomCode) return alert("Introduce un código.");
        
        btnJoin.innerText = "Conectando...";
        // Mandamos el mensaje a Python
        socket.emit('join_room', { player: playerName, room: roomCode });
    }
});

// --- RESPUESTAS DEL SERVIDOR PYTHON ---

socket.on('room_created', (data) => {
    alert(`¡Sala creada con éxito! Tu código es: ${data.room}`);
    // Aquí es donde ocultaremos la pantalla de login y mostraremos el Lobby
});

socket.on('join_success', (data) => {
    alert(`Has entrado a la sala ${data.room}. Jugadores: ${data.players.join(', ')}`);
});

socket.on('player_joined', (data) => {
    alert(`¡${data.new_player} ha entrado en la sala!`);
});

socket.on('error', (data) => {
    alert(`Error: ${data.message}`);
    btnJoin.innerText = "Entrar 🚀"; // Restauramos el botón
});