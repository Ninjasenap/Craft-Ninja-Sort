import { CraftBlock, CraftCodeBlock, CraftTextBlock, CraftTextRun, CraftUrlBlock } from "@craftdocs/craft-extension-api";
import { Def } from "../initApp";

export async function fetchCurrentPage(): Promise<CraftTextBlock>
{
    let result = await craft.dataApi.getCurrentPage();

    if (result.status !== "success") {
        throw new Error(result.message);
    }

    return result.data;
}

export async function getSelectedBlocks(): Promise<CraftBlock[]> 
{
    const result = await craft.editorApi.getSelection();

    if (result.status !== "success") {
        throw new Error(result.message);
    }

    return result.data;
}

export async function moveBlock(blockID: string, pageID: string, locatinIndex: number) {   
    const location = craft.location.indexLocation(pageID, locatinIndex);
    craft.dataApi.moveBlocks([blockID], location);
}

