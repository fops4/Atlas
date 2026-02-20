import { authService } from '../services/authService';

const SESSION_CHECK_INTERVAL = 30000; // 30 seconds
const EXPIRATION_WARNING_MS = 2 * 60 * 1000; // 2 minutes

class SessionManager {
    private timer: any = null;
    private onWarning: (timeLeft: number) => void = () => { };
    private onLogout: () => void = () => { };

    public start(
        callbacks: {
            onWarning: (timeLeft: number) => void,
            onLogout: () => void
        }
    ) {
        this.onWarning = callbacks.onWarning;
        this.onLogout = callbacks.onLogout;
        this.check();
        this.timer = setInterval(() => this.check(), SESSION_CHECK_INTERVAL);
    }

    public stop() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    private check() {
        const token = authService.getToken();
        if (!token) return;

        const decoded = authService.getDecodedToken(token);
        if (!decoded || !decoded.exp) return;

        const expirationTime = decoded.exp * 1000;
        const timeLeft = expirationTime - Date.now();

        if (timeLeft <= 0) {
            this.stop();
            this.onLogout();
        } else if (timeLeft <= EXPIRATION_WARNING_MS) {
            this.onWarning(timeLeft);
        }
    }
}

export const sessionManager = new SessionManager();
