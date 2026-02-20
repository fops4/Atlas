export interface SecurityLog {
    timestamp: string;
    userId: string;
    action: string;
    resource: string;
    result: 'success' | 'failure';
    metadata?: any;
}

export const auditService = {
    /**
     * Log a security event
     */
    log: (log: Omit<SecurityLog, 'timestamp'>) => {
        const fullLog: SecurityLog = {
            ...log,
            timestamp: new Date().toISOString()
        };

        // In a real app, this would send to an API
        console.group(`🛡️ Security Audit: ${log.action}`);
        console.log(`User: ${log.userId}`);
        console.log(`Resource: ${log.resource}`);
        console.log(`Result: ${log.result.toUpperCase()}`);
        if (log.metadata) console.log('Metadata:', log.metadata);
        console.groupEnd();

        // Persist to local storage for local audit trail if offline
        const existingLogs = JSON.parse(localStorage.getItem('atlas_security_logs') || '[]');
        existingLogs.push(fullLog);
        localStorage.setItem('atlas_security_logs', JSON.stringify(existingLogs.slice(-100))); // Keep last 100
    },

    /**
     * Specifically log unauthorized access attempts
     */
    logUnauthorized: (userId: string, resource: string) => {
        auditService.log({
            userId,
            resource,
            action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
            result: 'failure'
        });
    }
};
