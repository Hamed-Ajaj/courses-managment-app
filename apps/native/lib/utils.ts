export const getStatusStyle = (status: string) => {
    switch (status) {
        case 'completed': return { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' };
        case 'in-progress': return { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' };
        case 'not-started': return { bg: 'bg-slate-100 dark:bg-slate-800/50', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700' };
        default: return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
    }
}

export const formatUrl = (url?: string) => {
    if (!url) return '';
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '');
}
