import { Link } from '@inertiajs/react';
import { ListItem } from '@material-tailwind/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    label = '',
    ...props
}) {
    return (
        <Link
            {...props}
            preserveState
        >
            <ListItem className={`focus:text-green-500 focus:bg-transparent ${active
                ? 'border-l-4 border-green-500 text-green-500 hover:text-green-500'
                : ''} ${className}`}>
                {children}
                <span className="mr-auto text-sm">
                    {label}
                </span>
            </ListItem>
        </Link>
    );
}
