type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    if (!this.isDevelopment && level === 'debug') {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context
    };

    // 개발 환경에서는 console에 출력
    if (this.isDevelopment) {
      const consoleMethod = level === 'debug' ? 'log' : level;
      console[consoleMethod](`[${level.toUpperCase()}] ${message}`, context || '');
    }

    // 프로덕션에서는 외부 로깅 서비스로 전송 (예: Sentry, LogRocket 등)
    if (!this.isDevelopment && (level === 'error' || level === 'warn')) {
      // TODO: 외부 로깅 서비스 연동
      this.sendToExternalService(entry);
    }
  }

  private sendToExternalService(entry: LogEntry) {
    // 실제 구현에서는 Sentry, LogRocket 등의 서비스로 전송
    // 현재는 로컬 스토리지에 저장 (예시)
    try {
      const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      logs.push(entry);
      localStorage.setItem('error_logs', JSON.stringify(logs.slice(-100))); // 최근 100개만 유지
    } catch {
      // 로깅 실패는 조용히 처리
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>) {
    this.log('error', message, context);
  }
}

export const logger = new Logger();