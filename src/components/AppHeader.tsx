import * as React from "react"

export default class AppHeader extends React.Component {

	// Probably very static unless it will differ between pages,
	// this no need to concern about re-rendering.
	
	render (): JSX.Element {
		return (
			<div id="app-header">
				<h1>Ninja Sorter</h1>
			</div>
		);
	}

}