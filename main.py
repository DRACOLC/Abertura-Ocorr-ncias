from keep_alive import keep_alive
import os
import logging
import bot_commands
from telegram.ext import Updater

# Configuração de logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

def main():
    """Start the bot."""
    # Inicia o servidor web para manter o bot ativo
    keep_alive()
    
    # Cria o updater e passa o token do bot
    updater = Updater(os.environ.get("TELEGRAM_BOT_TOKEN"))
    
    # Pega o dispatcher para registrar comandos
    dispatcher = updater.dispatcher
    
    # Registra todos os comandos
    bot_commands.register_commands(dispatcher)
    
    # Inicia o bot
    logger.info("Bot started polling...")
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
