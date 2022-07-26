import * as React from "react"
import AppHeader from "./AppHeader"


export default class AppPage extends React.Component {

	// state to decide mode => rendering will be OK

	render (): JSX.Element{
		return (
            <>
			<AppHeader />
            <div id="app-page" className={"page"}>
                <button className="btn execute-btn">Ascending</button>
                {/* <button className="btn execute-btn">Descending</button> */}
                {/* <button className="btn execute-btn">Into Bullet List</button> */}
                {/* <button className="btn execute-btn">Into Numbered List</button> */}
                {/* <button className="btn execute-btn">! Sort table !</button> */}
            </div>
            </>
		);
	}

}