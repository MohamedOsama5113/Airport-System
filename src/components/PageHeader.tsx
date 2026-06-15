import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
    actions?: ReactNode;
    iconContainerClassName?: string;
}

export function PageHeader({
    title,
    subtitle,
    icon,
    actions,
    iconContainerClassName = 'bg-linear-to-br from-blue-600 to-blue-500',
}: PageHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${iconContainerClassName}`}>
                        {icon}
                    </div>
                    <div>
                        <h1 className="text-3xl text-gray-900 dark:text-slate-100">{title}</h1>
                        <p className="text-gray-600 dark:text-slate-400">{subtitle}</p>
                    </div>
                </div>

                {actions ? <div>{actions}</div> : null}
            </div>
        </div>
    );
}