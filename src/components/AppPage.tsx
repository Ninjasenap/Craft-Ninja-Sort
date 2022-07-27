import * as React from "react"
import AppHeader from "./AppHeader"
import { sortBlocks } from "../stuff";

interface AppPageProps { }

/*

*/
export default class AppPage extends React.Component {

    // state to decide mode => rendering will be OK
    constructor(props: AppPageProps) {
        super(props)
    }

    /**
     * # Action to sort Craft block ascending.
     */
    async handleSortAscendingButtonClick() {
        sortBlocks(false);
    }

    /**
     * # Action to sort Craft block descending.
     */
    async handleSortDecendingButtonClick() {
        sortBlocks(true);
    }

    render(): JSX.Element {
        return (
            <>
                <AppHeader />
                <div id="app-page" className={"page"}>
                    <button className="btn execute-btn" onClick={() => { this.handleSortAscendingButtonClick() }}>
                        <b>Ascending</b><br />
                        <i>Preserves location</i>
                    </button>

                    {/* <button className="btn execute-btn" onClick={() => { this.handleSortDecendingButtonClick() }}>
                        <b>Descending</b><br />
                        <i>Preserves location</i>
                    </button> */}

                    {/* <button className="btn execute-btn">Into Bullet List</button> */}
                    {/* <button className="btn execute-btn">Into Numbered List</button> */}
                    {/* <button className="btn execute-btn">! Sort table !</button> */}
                </div>

            </>
        );
    }

}



