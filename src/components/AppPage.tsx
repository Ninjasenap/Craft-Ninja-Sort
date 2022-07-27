import * as React from "react"
import { CraftBlock, CraftTextBlock } from "@craftdocs/craft-extension-api";
import { Def, Settings } from "../initApp";
import { getBlockContentsAsString, fetchCurrentPage, getSelectedBlocks } from "../helpers/getStuffFromDocument";
import AppHeader from "./AppHeader"

interface AppPageProps { }

/*

*/
export default class AppPage extends React.Component {

    state: { blockJSXElements: JSX.Element[], moves: number };

    // state to decide mode => rendering will be OK
    constructor(props: AppPageProps) {
        super(props)
        this.state = {
            blockJSXElements: [],
            moves: 0,
        };
    }

    async handleSortAscendingButtonClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        // get page and selected blocks
        const currentPage: CraftTextBlock = await fetchCurrentPage();
        const selectedBlocks: CraftBlock[] = await getSelectedBlocks();
        const pageId: string = currentPage.id;


        // if blocks were selected use them.
        // If no blocks were selected use all subblocks from the page.
        const blocks: CraftBlock[] =
            (
                selectedBlocks.length > 0 ?
                    selectedBlocks :
                    currentPage.subblocks
            )

        // Nothing to sort!
        if (blocks.length == 0) {
            return;
        }

        // Index all blocks in page so we know where to put them back after sorting.
        // {blockID : index}
        const pageIndex: Map<string, number> = new Map();
        currentPage.subblocks.forEach((block: CraftBlock, index: number) => {

            pageIndex.set(block.id, index);

        })


        // Store the original indexes to be able to replace after sort
        // {index : blockID}
        const blockIndex: Map<number, string> = new Map<number, string>();
        blocks.forEach((block: CraftBlock) => {
            const index = pageIndex.get(block.id);

            if (typeof index !== "undefined") {
                blockIndex.set(index!, block.id);
            }
        })

        console.log(blockIndex);
        console.log(pageIndex);

        // Sort the chosen blocks
        // blocks : [ CraftBlock[] ]
        blocks.sort((blockA: CraftBlock, blockB: CraftBlock) => {
            return (
                getBlockContentsAsString(blockA)
                    .localeCompare(
                        getBlockContentsAsString(blockB),
                        Settings.Locale.code)
            )
        });

        // Reindex the blocks
        if (blockIndex.size != blocks.length) {
            throw new Error("Number of selected blocks is different from size of sorted blocks.");
        }

        // blockIndex : {sorted index : blockID}
        // getting the blockID from the sorted blocks[]
        let i = 0;
        blockIndex.forEach((blockID: string, index: number) => {
            blockIndex.set(index, blocks[i].id);
            i++;
        });

        // // reorder them in the page
        // //  move each ID to corresponding location
        blockIndex.forEach((blockID: string, index: number) => {
            pageIndex.set(blockID, index);
        });

        let moves = 0;
        blockIndex.forEach((blockID: string, sortedIndex: number) => {
            
                this.moveBlockToLocation(pageId, sortedIndex, blockID);
                moves++;
            
        });

        // Success!

        /* 
            DEBUG STUFF!
            Will generate blocks as JSX elements for output in 
        */
        if (Settings.DEBUG) {
            console.log(blockIndex);
            console.log(pageIndex);

            const elements: JSX.Element[] = [];
            blocks.forEach((block: CraftBlock, index: number) => {
                elements.push(
                    < li key={block.id} >
                        <b>Index:</b> {index}<br />
                        <b>ID:</b>{block.id}<br />
                        <b>Content:</b> {getBlockContentsAsString(block)}
                    </li >);
            });

            this.setState({
                blockJSXElements: elements,
                moves: ( moves),
            });

        }


    }

    private moveBlockToLocation(pageId: string, index: number, blockID: string) {
        let location = craft.location.indexLocation(pageId, index);
        craft.dataApi.moveBlocks([blockID], location);
    }

    renderDebugStuff() {
        if (Settings.DEBUG)
            return (
                <>
                    <p>So far we've run {this.state.moves} times</p>
                    <ul id="debug">{this.state.blockJSXElements}</ul>
                </>
                
            )
    }
    render(): JSX.Element {
        return (
            <>
                <AppHeader />
                <div id="app-page" className={"page"}>
                    <button className="btn execute-btn" onClick={(e) => { this.handleSortAscendingButtonClick(e) }}>
                        Ascending
                    </button>

                    {/* <button className="btn execute-btn">Descending</button> */}
                    {/* <button className="btn execute-btn">Into Bullet List</button> */}
                    {/* <button className="btn execute-btn">Into Numbered List</button> */}
                    {/* <button className="btn execute-btn">! Sort table !</button> */}
                </div>

                {/* Debug stuff */}
                {this.renderDebugStuff()}
            </>
        );
    }

}