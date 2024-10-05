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
export function route(location: string[][] | Record<string, string> | string | URLSearchParams): Route {
    const route = new URLSearchParams(location);
    let params = <Record<string, string>>{};

    let first = true;
    for (const [k, v] of route.entries()) {
        if (first && k.indexOf("?") >= 0)
            params[k.substring(k.indexOf("?")+1)] = v;
        else
            params[k] = v;
        
            first = false;
    }

    return {
        origin: route.get("origin")!,
        path: route.get("pathname")!,
        params,
        hash: route.get("hash")!
    };
}

export const RouteParams = <S extends { route: Route }>(state: S, params: Record<string, any>) => ({
    ...state,
    route: {
        ...state.route,
        params
    }
});