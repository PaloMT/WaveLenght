
from flask import Flask
from flask_socketio import SocketIO, join_room, emit
import random
import string

# Configuramos la aplicación
app = Flask(__name__)
app.config['SECRET_KEY'] = 'tu_secreto_super_seguro' # Necesario para Flask

# Activamos CORS para que tu web (frontend) pueda hablar con este servidor
socketio = SocketIO(app, cors_allowed_origins="*")

# --- NUESTRA "BASE DE DATOS" EN MEMORIA RAM ---
# Aquí guardaremos las salas. Tendrá esta forma:
# {'WAVE-A1B2': {'players': ['Paco', 'Maria'], 'state': 'lobby'}}
games = {}

def generar_codigo():
    """Genera un código aleatorio de 4 caracteres (Ej: 8XF2)"""
    letras = string.ascii_uppercase + string.digits
    return 'WAVE-' + ''.join(random.choices(letras, k=4))

# --- EVENTOS DE WEBSOCKET ---

@socketio.on('create_room')
def handle_create_room(data):
    player_name = data.get('player')
    room_code = generar_codigo()
    
    # 1. Creamos la sala en nuestra memoria
    games[room_code] = {
        'players': [player_name],
        'state': 'lobby'
    }
    
    # 2. Metemos al jugador en la "habitación" de SocketIO
    join_room(room_code)
    
    # 3. Le respondemos solo a él con su nuevo código
    emit('room_created', {'room': room_code})
    print(f"✅ Sala {room_code} creada por {player_name}")

@socketio.on('join_room')
def handle_join_room(data):
    player_name = data.get('player')
    room_code = data.get('room')
    
    # Comprobamos si la sala existe en nuestra "base de datos"
    if room_code in games:
        # Añadimos al jugador a la lista
        games[room_code]['players'].append(player_name)
        join_room(room_code)
        
        # Le confirmamos que ha entrado
        emit('join_success', {'room': room_code, 'players': games[room_code]['players']})
        
        # ¡Avisamos al RESTO de la sala de que alguien nuevo ha entrado!
        # Usamos broadcast=False para no enviárselo a él mismo, y room=room_code para limitar el alcance
        emit('player_joined', {'new_player': player_name, 'all_players': games[room_code]['players']}, room=room_code, include_self=False)
        print(f"👋 {player_name} se unió a {room_code}")
    else:
        # Si mete un código falso, le mandamos un error
        emit('error', {'message': 'La sala no existe o el código es incorrecto.'})

# --- ARRANQUE DEL SERVIDOR ---
if __name__ == '__main__':
    print("🚀 Servidor Python arrancando en http://localhost:5000...")
    socketio.run(app, debug=True)