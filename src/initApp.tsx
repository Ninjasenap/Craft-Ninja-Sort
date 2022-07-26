import * as React from "react";
import { createRoot } from "react-dom/client";
import { App, AppProps } from "./app";


export default function initApp(): void {
    const root = createRoot(document.getElementById('react-root') as HTMLElement);
    const app: React.Component = new App({} as AppProps);

    initDarkModeListener();
    
    root.render(app.render());
}

function initDarkModeListener() {

	craft.env.setListener(
	    (env) => {
	        const isDarkMode: boolean = env.colorScheme == "dark";

	        if (isDarkMode) {
	            document.body.classList.add("dark");
	        }
	        else {
	            document.body.classList.remove("dark");
	        }
	    }
	);

}