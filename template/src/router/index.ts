import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import ChatView from '../views/ChatView.vue';
import DashboardView from '../views/DashboardView.vue';
import DataTableView from '../views/DataTableView.vue';
import LandingView from '../views/LandingView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Landing',
    component: LandingView,
  },
  {
    path: '/data-table',
    name: 'DataTable',
    component: DataTableView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatView,
  },
  // Fallback for GAS to handle direct navigation or refresh
  {
    path: '/:pathMatch(.*)*',
    redirect: (to) => {
      // Get the path from the route params
      const pathMatch = to.params.pathMatch as string;

      // Handle URLs without leading slash (e.g., #data-table -> #/data-table)
      if (pathMatch && !pathMatch.startsWith('/')) {
        const cleanPath = '/' + pathMatch;
        const validPaths = ['/data-table', '/dashboard', '/chat'];

        if (validPaths.includes(cleanPath)) {
          return { path: cleanPath };
        }
      }

      // If no match, go to landing
      return { name: 'Landing' };
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(), // Use hash mode for GAS compatibility
  routes,
});

// Custom navigation helper for cleaner URLs
export function navigateToPage(pageName: string) {
  // Update the hash directly for cleaner URLs without leading slash
  const cleanRoutes: Record<string, string> = {
    'data-table': '/data-table',
    'dashboard': '/dashboard',
    'chat': '/chat',
    'home': '/',
    '': '/'
  };

  const routePath = cleanRoutes[pageName] || '/';
  router.push(routePath);

  // Update URL hash to show clean format (without leading slash for non-root)
  if (routePath !== '/') {
    window.history.replaceState(null, '', `#${pageName}`);
  }
}

// Handle initial load with clean URLs
router.afterEach((to) => {
  // Update URL to clean format after navigation
  if (to.path !== '/') {
    const cleanName = to.path.substring(1); // Remove leading slash
    window.history.replaceState(null, '', `#${cleanName}`);
  }
});

// This is a common pattern for GAS to ensure router works on direct load/refresh
// It might need to be called from your main.gs file or within a script tag in index.html
// For now, we'll rely on the fallback route and typical SPA loading.
// function loadPage(routeName?: string) {
//   const targetRoute = routeName || window.location.hash.substring(1) || '/';
//   if (router.currentRoute.value.path !== targetRoute) {
//     router.push(targetRoute);
//   }
// }
// (window as any).loadPage = loadPage;


export default router;
