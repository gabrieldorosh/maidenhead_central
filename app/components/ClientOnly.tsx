/*
    This component is used to fix a hydration based issue.
    It is used to render the children only on the client side.
*/

'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
    children: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ 
    children 
}) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return null;
    }

    return (
        <>
            {children}
        </>
    );
}

export default ClientOnly;