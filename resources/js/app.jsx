import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { SidebarProvider } from './Contexts/SidebarContext';
import { ToastProvider } from './Contexts/ToastContext';
import { SecurityProvider } from './Contexts/SecurityContext';
import { ProgressProvider } from './Contexts/ProgressContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <SidebarProvider>
                <ToastProvider>
                    <SecurityProvider>
                        <ProgressProvider>
                            <App {...props} />
                        </ProgressProvider>
                    </SecurityProvider>
                </ToastProvider>
            </SidebarProvider>
        );
    },
    progress: {
        color: '#4caf50',
    },
});