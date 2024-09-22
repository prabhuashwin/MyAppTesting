import React from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumb from './common/Breadcrumb'; // Import the Breadcrumb component

const Layout = ({ children }) => {
    const location = useLocation();

    // Map the routes to breadcrumb titles and additional crumbs
    const getBreadcrumbDetails = (pathname) => {
        switch (pathname) {
            case '/':
                return { title: 'Home' };
            case '/about':
                return { title: 'About' };
            case '/contact':
                return { title: 'Contact' };
            case '/qndata':
                return { title: 'Quality Notification', additionalCrumbs: [{ path: '/qndata', name: 'Quality Notification' }] };
            case '/components':
                return { title: 'Components', additionalCrumbs: [{ path: '/components', name: 'List Of Values (LOV)' }] };
            case '/programs':
                return { title: 'Programs', additionalCrumbs: [{ path: '/programs', name: 'List Of Values (LOV)' }] };
            case '/plantdata':
                return { title: 'Plant Details', additionalCrumbs: [{ path: '/plantdata', name: 'Plant Details' }] };
            case '/analyst':
                return { title: 'Delegate Analyst', additionalCrumbs: [{ path: '/analyst', name: 'Delegate Analyst' }] };
            case '/review':
                return { title: 'Delegate Reviewer', additionalCrumbs: [{ path: '/review', name: 'Delegate Reviewer' }] };
            default:
                return { title: '' };
        }
    };

    const { title, additionalCrumbs } = getBreadcrumbDetails(location.pathname);

    return (
        <div>
            <Breadcrumb title={title} additionalCrumbs={additionalCrumbs} />
            <h1>{title}</h1>
            {children}
        </div>
    );
};

export default Layout;
