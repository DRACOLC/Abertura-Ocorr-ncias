import os
import logging
import signal

# Configurar logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Criar a aplicação Flask
app = Flask(__name__)

# Variável para armazenar o thread do bot
bot_thread = None

# Função para iniciar o bot
def start_bot():
    try:
        from main import main
        main()
    except Exception as e:
        logger.error(f"Erro ao iniciar o bot: {e}")

# Inicia o bot em um thread separado
def start_bot_thread():
    global bot_thread
    if bot_thread is None or not bot_thread.is_alive():
        bot_thread = threading.Thread(target=start_bot)
        bot_thread.daemon = True
        bot_thread.start()
        logger.info("Bot iniciado em thread separado")
    else:
        logger.info("Bot já está em execução")

# Rota principal
@app.route('/')
def home():
    return "Bot está funcionando! Esta é a página de status."

# Rota de health check
@app.route('/health')
def health():
    global bot_thread
    if bot_thread is not None and bot_thread.is_alive():
        return jsonify({"status": "OK", "bot_running": True})
    else:
        # Tenta reiniciar o bot se estiver inativo
        start_bot_thread()
        return jsonify({"status": "WARNING", "message": "Bot reiniciado", "bot_running": True})

# Inicializar o bot quando o aplicativo Flask iniciar
with app.app_context():
    try:
        start_bot_thread()
        logger.info("Bot thread iniciado durante inicialização do Flask")
    except Exception as e:
        logger.error(f"Erro ao iniciar o bot thread: {e}")

if __name__ == '__main__':
    # Inicia o servidor Flask
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)
