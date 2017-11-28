const LOG_STYLES = {
    RESET: "\x1b[0m%s\x1b[0m",
    BRIGHT: "\x1b[1m%s\x1b[0m",
    DIM: "\x1b[2m%s\x1b[0m",
    UNDERSCORE: "\x1b[4m%s\x1b[0m",
    BLINK: "\x1b[5m%s\x1b[0m",
    REVERSE: "\x1b[7m%s\x1b[0m",
    HIDDEN: "\x1b[8m%s\x1b[0m",
    
    FG_BLACK: "\x1b[30m%s\x1b[0m",
    FG_RED :"\x1b[31m%s\x1b[0m",
    FG_GREEN :"\x1b[32m%s\x1b[0m",
    FG_YELLOW: "\x1b[33m%s\x1b[0m",
    FG_BLUE: "\x1b[34m%s\x1b[0m",
    FG_MAGNETA: "\x1b[35m%s\x1b[0m",
    FG_CYAN: "\x1b[36m%s\x1b[0m",
    FG_WHITE: "\x1b[37m%s\x1b[0m",
    
    BG_BLACK: "\x1b[40m%s\x1b[0m",
    BG_RED: "\x1b[41m%s\x1b[0m",
    BG_GREEN: "\x1b[42m%s\x1b[0m",
    BG_YELLOW: "\x1b[43m%s\x1b[0m",
    BG_BLUE: "\x1b[44m%s\x1b[0m",
    BG_MAGNETA: "\x1b[45m%s\x1b[0m",
    BG_CYAN: "\x1b[46m%s\x1b[0m",
    BG_WHITE: "\x1b[47m%s\x1b[0m"
}

module.exports = LOG_STYLES