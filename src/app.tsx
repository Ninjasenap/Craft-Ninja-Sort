import * as React from "react"
import AppPage from "./components/AppPage"


export interface AppProps {
}

interface AppState {
}

export class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);

    }


    render(): JSX.Element {
        return (
            <div id="app">
                <AppPage />
            </div>
        );
    }
}


