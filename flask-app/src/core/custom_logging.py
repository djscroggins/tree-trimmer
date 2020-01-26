import logging


class Logger:
    def __init__(self, **kwargs):
        self._logger_name = kwargs.get('logger_name', 'logger')
        self._log_level = kwargs.get('log_level', logging.INFO)

    def get_logger(self) -> logging.Logger:
        logger = logging.getLogger(self._logger_name)
        logger.setLevel(self._log_level)
        handler = logging.StreamHandler()
        handler.setLevel(self._log_level)
        formatter = logging.Formatter(
            '%(levelname)s - %(asctime)s - %(module)s - (funcName)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger
