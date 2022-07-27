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


export function getBlockContentsAsString (block: CraftBlock): string
{
    let valueString: string = "";

    switch (block.type)
    {
        case Def.BLOCK_TYPE.TEXT:
            (block as CraftTextBlock).content.forEach((textRun: CraftTextRun) => {
                valueString += textRun.text;
            })
            break;
        
        case Def.BLOCK_TYPE.CODE:
            valueString = (block as CraftCodeBlock).code;
            break;
        
        case Def.BLOCK_TYPE.URL:
            if (typeof (block as CraftUrlBlock).title !== "undefined"){
                valueString = (block as CraftUrlBlock).title!;
            }
    }

    return valueString;
}