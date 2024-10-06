
export type Route = {
    origin: string,
    path: string,
    params: Record<string, any>,
    hash: string
};

/**
 * uses URLSearchParams to extract query parameters 
 * and convert the window.location url into a nicely usable object
 */
export function route(location: Location): Route {
    const route = new URLSearchParams(location as any);
    let params: Record<string, string> = {};
    
    let q = location.search;
    if (q?.length > 0) {
        q = q.substring(1);
        const list = q.split("&").map(kv => { const [k, v] = kv.split("="); return [k, v] ; });
        for (const [k, v] of list) {
            params[k] = v;
        }
    }

    return {
        origin: route.get("origin")!,
        path: route.get("pathname")!,
        params,
        hash: route.get("hash")!,
    };
}

export const RouteParams = (state: any, params: Record<string, any>) => ({
    ...state,
    route: {
        ...state.route,
        params
    }
});