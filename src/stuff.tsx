import { CraftBlock, CraftCodeBlock, CraftTextBlock, CraftTextRun, CraftUrlBlock, IndexLocation } from "@craftdocs/craft-extension-api";
import { Def, Settings } from "./initApp";
import { fetchCurrentPage, getSelectedBlocks, moveBlock } from "./helpers/getStuffToAndFromCraft";



/**
 * # Main function to hanlde sort action.
 * 
 * 
 * @param reverse Set to true if sort should be in reverse order
 * @returns false if there is nothing to sort, otherwise true.
 */
export async function sortBlocks(reverse: boolean = false): Promise<boolean> {

    const currentPage: CraftTextBlock = await fetchCurrentPage();
    const pageId: string = currentPage.id;

    const blocksToSort: CraftBlock[] = await getWorkingBlocks(currentPage);

    // Nothing to sort!
    if (blocksToSort.length == 0) {
        return false;
    }

    // Store the original indexes to be able to replace after sort
    const blockIndex: Map<number, string> = getBlockIndex(blocksToSort, currentPage);

    // Sort the chosen blocks!
    const sortedBlocks = (reverse ?
        sortBlocksDescending(blocksToSort)
        : sortBlocksAscending(blocksToSort));

    // The block index must be reindexed to match the new order after sort.
    const updatedBlockIndex = reindexBlocks(blockIndex, sortedBlocks);

    moveIndividualBlocks(updatedBlockIndex, pageId);

    return true;
}


/**
 * Generate a map with blocks page index location.
 *
 * @param craftBlocks - the blocks to find location index for.
 * @param currentPage - currently selected page to find index locations in.
 * @returns the map with the indexed blocks: { location index: block id }
 */
function getBlockIndex(craftBlocks: CraftBlock[], currentPage: CraftTextBlock): Map<number, string> {

    // pageIndex - { blockID : index }
    const pageIndex: Map<string, number> = new Map();
    currentPage.subblocks.forEach((block: CraftBlock, index: number) => {
        pageIndex.set(block.id, index);
    });

    // blockIndex - { index : blockID}
    const blockIndex: Map<number, string> = new Map<number, string>();
    craftBlocks.forEach((block: CraftBlock) => {
        const index = pageIndex.get(block.id);

        if (typeof index !== "undefined") {
            blockIndex.set(index!, block.id);
        }
    });

    return blockIndex;
}
/**
 * # Get the blocks to work on.
 *
 * If a selection is made the selected blocks will be returned.
 * If no selection is made the subblocks of current page will be returned.
 *
 * @param currentPage The currently selected page.
 * @returns the chosen blocks
 */

async function getWorkingBlocks(currentPage: CraftTextBlock) {
    const selectedBlocks: CraftBlock[] = await getSelectedBlocks();
    const blocks: CraftBlock[] = (
        selectedBlocks.length > 0 ?
            selectedBlocks :
            currentPage.subblocks
    );
    return blocks;
}
/**
 * # Sorts Craft block array in ascending order
 *
 * Because of how sort works the array will be mutated. A reference will be returned.
 *
 * @param blocks The blocks to sort !Will be mutated!
 * @returns the sorted blocks
 */

export function sortBlocksAscending(blocks: CraftBlock[]) {

    return blocks.sort((blockA: CraftBlock, blockB: CraftBlock) => {
        return (
            getBlockContentsAsString(blockA)
                .localeCompare(
                    getBlockContentsAsString(blockB),
                    Settings.Locale.code)
        );
    });
}
/**
 * # Sorts Craft block array in descending order
 *
 * Because of how sort works the array will be mutated. A reference will be returned.
 *
 * @param blocks The blocks to sort !Will be mutated!
 * @returns the sorted blocks
 */

export function sortBlocksDescending(blocks: CraftBlock[]) {

    return blocks.sort((blockA: CraftBlock, blockB: CraftBlock) => {
        return (
            getBlockContentsAsString(blockB)
                .localeCompare(
                    getBlockContentsAsString(blockA),
                    Settings.Locale.code)
        );
    });

}
/**
 * # Reindex an index of blocks to match the order of a CraftBlock array;
 *
 * Index is preserved while the block id is updated in the map.
 *
 * @param blockIndex The block index to alter.
 * @param reorderedBlocks The reordered craft blocks.
 * @returns a new block index map.
 */

function reindexBlocks(blockIndex: Map<number, string>, reorderedBlocks: CraftBlock[]) {
    if (blockIndex.size != reorderedBlocks.length) {
        throw new Error("Number of selected blocks is different from size of sorted blocks.");
    }

    const reindexedBlocks: Map<number, string> = new Map<number, string>();

    let i = 0;
    blockIndex.forEach((blockID: string, index: number) => {
        reindexedBlocks.set(index, reorderedBlocks[i].id);
        i++;
    });

    return reindexedBlocks;
}

/**
 * # Move the blocks while preserving locations
 *
 * The move is done individually on each block. Location is decided from the block index
 * and selected block comes from the block ID at that index.
 *
 * @param blockIndex Map of index and block ID
 * @param pageId the selected page to move blocks in.
 * @returns true when done
 */
function moveIndividualBlocks(blockIndex: Map<number, string>, pageID: string) {

    // 
    let location: IndexLocation;
    blockIndex.forEach((blockID: string, index: number) => {
        moveBlock(blockID, pageID, index);
    });

    return true;
}


/**
 * # Extract the value from the block where applicable
 *
 * Will test for type of block and return the value of that block as a string.
 *
 * ! Depending on the type of block result will differ somewhat
 *
 * Textblock: the text property
 * Code block: the code property
 * URL block: the title property
 *
 * @param block The block to extract a string from
 * @returns the extracted value as a string
 */

export function getBlockContentsAsString(block: CraftBlock): string {
    let valueString: string = "";

    switch (block.type) {
        case Def.BLOCK_TYPE.TEXT:
            (block as CraftTextBlock).content.forEach((textRun: CraftTextRun) => {
                valueString += textRun.text;
            });
            break;

        case Def.BLOCK_TYPE.CODE:
            valueString = (block as CraftCodeBlock).code;
            break;

        case Def.BLOCK_TYPE.URL:
            if (typeof (block as CraftUrlBlock).title !== "undefined") {
                valueString = (block as CraftUrlBlock).title!;
            }
    }

    return valueString;
}
