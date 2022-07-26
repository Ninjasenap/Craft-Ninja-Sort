import { CraftBlock } from "@craftdocs/craft-extension-api";

export async function fetchPage(): Promise<CraftBlock> {
    let result = await craft.dataApi.getCurrentPage();

    if (result.status !== "success") {
        throw new Error(result.message);
    }

    return result.data;
}
