import sys
from pathlib import Path
from loguru import logger

def setup_logging():
    """Configures Loguru to handle both console and file logging."""
    
    # 1. Clear the default pre-configured handler
    logger.remove()

    # 2. Define custom message formats
    # Note: <green>, <level>, and <cyan> are Loguru specific color tags
    console_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
        "<level>{message}</level>"
    )
    
    file_format = "{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}"

    # 3. Add Console Handler (stdout)
    logger.add(
        sys.stdout,
        format=console_format,
        level="DEBUG",
        colorize=True
    )

    # 4. Add Rolling File Handler for standard application tracking
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    logger.add(
        log_dir / "app.log",
        format=file_format,
        level="INFO",
        rotation="10 MB",     # Creates a new file when the size hits 10MB
        retention="5 days",    # Keeps logs for 5 days before deleting
        compression="zip"     # Automatically compresses old log files
    )

    # 5. Add Structured JSON File Handler for automated log parsers
    logger.add(
        log_dir / "app_structured.json",
        level="INFO",
        serialize=True,       # Converts records automatically to JSON strings
        rotation="1 day"
    )

# Initialize configuration
setup_logging()


# DEMONSTRATION WORKFLOWS
def log_severity_levels():
    """Demonstrates all out-of-the-box severity levels."""
    logger.trace("Trace level: Used for deep code diagnostic steps.")
    logger.debug("Debug level: Used for general diagnostic data.")
    logger.info("Info level: Tracks normal operation events.")
    logger.success("Success level: Unique to Loguru, tracks successful ops.")
    logger.warning("Warning level: Indicates an unexpected, minor issue.")
    logger.error("Error level: Indicates a major system operational failure.")
    logger.critical("Critical level: Component/System breakdown alert.")


# Automated Exception Capture using the @logger.catch decorator
@logger.catch
def risky_calculation(x, y):
    """Automatically catches and logs exceptions with complete tracebacks."""
    logger.info(f"Attempting division with inputs x={x}, y={y}")
    return x / y


def contextual_logging():
    """Appends extra static variables to your output via bind()."""
    # Context variable is bound to this thread instance
    task_logger = logger.bind(user_id="user_123", session_id="abc_987")
    
    task_logger.info("User initiated a secure download.")
    task_logger.warning("Download speed dropping below thresholds.")


if __name__ == "__main__":
    logger.info("Initializing Loguru Demo Application...")
    
    log_severity_levels()
    contextual_logging()
    
    # This will safely catch the ZeroDivisionError and print/save a detailed traceback
    risky_calculation(10, 0)
    
    logger.success("Demo Application complete!")
