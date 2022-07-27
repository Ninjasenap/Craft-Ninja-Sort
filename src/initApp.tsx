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


export class Def {

	// Block Types
	static BLOCK_TYPE = {
		TEXT: "textBlock",
		URL: "urlBlock",
		IMAGE: "imageBlock",
		VIDEO: "videoBlock",
		FILE: "fileBlock",
		HORISONTAL_LINE: "horizontalLineBlock",
		CODE: "codeBlock",
		DRAWING: "drawingBlock"
	}


	//Text Style
	static TEXT_STYLE = {
		TITLE: "title",
		SUBTITLE: "subtitle",
		HEADING: "heading",
		STRONG: "strong",
		BODY: "body",
		CAPTION: "caption",
		CARD: "card",
		PAGE: "page",
	}


	// Locale
	static LOCALE = {
		ENGLISH: { text: "English", code: "en" },
		FRENCH: { text: "French", code: "fr" },
		GERMAN: { text: "German", code: "de" },
		SWEDISH: { text: "Swedish", code: "sv" },
	}


}

export class Settings {
	static DEBUG = true;
	static Locale = Def.LOCALE.ENGLISH;
}
