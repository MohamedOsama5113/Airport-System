export interface VerificationLog {
    id: number;
    travelerName: string;
    passportNumber: string;
    nationality: string;
    status: 'Allowed' | 'Banned' | 'Unknown';
    timestamp: string;
    duration: string;
    operator: string;
    terminal: string;
    confidence: number;
    personId?: string;
    predictedLabel?: string;
    message?: string;
    isBanned?: boolean;
}

const INITIAL_LOGS: VerificationLog[] = [
    {
        id: 1,
        travelerName: 'Ahmed Hassan',
        passportNumber: 'EG123456',
        nationality: 'Egyptian',
        status: 'Allowed',
        timestamp: '8 March 2026, 14:32:15',
        duration: '2.3s',
        operator: 'Admin',
        terminal: 'Terminal 1',
        confidence: 98.5,
    },
    {
        id: 2,
        travelerName: 'Sarah Johnson',
        passportNumber: 'US789012',
        nationality: 'American',
        status: 'Allowed',
        timestamp: '8 March 2026, 14:27:42',
        duration: '1.9s',
        operator: 'Admin',
        terminal: 'Terminal 1',
        confidence: 99.2,
    },
    {
        id: 3,
        travelerName: 'Mohammed Ali',
        passportNumber: 'SA345678',
        nationality: 'Saudi',
        status: 'Banned',
        timestamp: '8 March 2026, 14:24:08',
        duration: '3.1s',
        operator: 'Admin',
        terminal: 'Terminal 1',
        confidence: 45.3,
    },
    {
        id: 4,
        travelerName: 'Emily Chen',
        passportNumber: 'CN901234',
        nationality: 'Chinese',
        status: 'Allowed',
        timestamp: '8 March 2026, 14:20:33',
        duration: '2.1s',
        operator: 'Admin',
        terminal: 'Terminal 1',
        confidence: 97.8,
    },
    {
        id: 5,
        travelerName: 'Omar Ibrahim',
        passportNumber: 'AE567890',
        nationality: 'Emirati',
        status: 'Allowed',
        timestamp: '8 March 2026, 14:17:56',
        duration: '2.4s',
        operator: 'Admin',
        terminal: 'Terminal 1',
        confidence: 98.1,
    },
    {
        id: 6,
        travelerName: 'Maria Garcia',
        passportNumber: 'ES246801',
        nationality: 'Spanish',
        status: 'Banned',
        timestamp: '8 March 2026, 14:15:22',
        duration: '2.8s',
        operator: 'Admin',
        terminal: 'Terminal 1',
        confidence: 52.7,
    },
    {
        id: 7,
        travelerName: 'John Smith',
        passportNumber: 'GB135790',
        nationality: 'British',
        status: 'Allowed',
        timestamp: '8 March 2026, 14:12:45',
        duration: '2.0s',
        operator: 'Admin',
        terminal: 'Terminal 1',
        confidence: 96.4,
    },
    {
        id: 8,
        travelerName: 'Fatima Al-Rashid',
        passportNumber: 'KW864209',
        nationality: 'Kuwaiti',
        status: 'Allowed',
        timestamp: '8 March 2026, 14:09:18',
        duration: '2.2s',
        operator: 'Admin',
        terminal: 'Terminal 1',
        confidence: 99.0,
    },
];

const normalizeStatus = (status: string): VerificationLog['status'] => {
    if (status === 'Allowed' || status === 'Banned' || status === 'Unknown') {
        return status;
    }
    if (status === 'success') {
        return 'Allowed';
    }
    if (status === 'failed') {
        return 'Banned';
    }
    return 'Unknown';
};

export const getLogs = (): VerificationLog[] => {
    const stored = localStorage.getItem('verification_logs');
    if (!stored) {
        localStorage.setItem('verification_logs', JSON.stringify(INITIAL_LOGS));
        return INITIAL_LOGS;
    }
    const parsed = JSON.parse(stored) as Array<VerificationLog & { status: string }>;
    return parsed.map((log) => ({
        ...log,
        status: normalizeStatus(log.status),
    }));
};

export const addLog = (log: Omit<VerificationLog, 'id'>) => {
    const logs = getLogs();
    const newLog = { ...log, id: Math.max(...logs.map(l => l.id), 0) + 1 };
    const updatedLogs = [newLog, ...logs];
    localStorage.setItem('verification_logs', JSON.stringify(updatedLogs));
    return newLog;
};

export const getStats = () => {
    const logs = getLogs();
    return {
        total: logs.length,
        success: logs.filter(l => l.status === 'Allowed').length,
        rejected: logs.filter(l => l.status === 'Banned').length,
    };
};

export interface ActionLog {
    id: number;
    timestamp: string;
    user: string;
    action: string;
    details: string;
}

const INITIAL_ACTION_LOGS: ActionLog[] = [
    {
        id: 1,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: 'Admin User',
        action: 'Login',
        details: 'System login successful',
    },
    {
        id: 2,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        user: 'Admin User',
        action: 'Settings Update',
        details: 'Changed security level to High',
    },
    {
        id: 3,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        user: 'Admin User',
        action: 'Login',
        details: 'System login successful',
    },
];

export const getActionLogs = (): ActionLog[] => {
    const stored = localStorage.getItem('action_logs');
    if (!stored) {
        localStorage.setItem('action_logs', JSON.stringify(INITIAL_ACTION_LOGS));
        return INITIAL_ACTION_LOGS;
    }
    return JSON.parse(stored);
};

export const addActionLog = (log: Omit<ActionLog, 'id' | 'timestamp'>) => {
    const logs = getActionLogs();
    const newLog = {
        ...log,
        id: Math.max(...logs.map(l => l.id), 0) + 1,
        timestamp: new Date().toISOString()
    };
    const updatedLogs = [newLog, ...logs];
    localStorage.setItem('action_logs', JSON.stringify(updatedLogs));
    return newLog;
};
