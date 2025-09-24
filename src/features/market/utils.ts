import { CATEGORY_PRESET, type CategoryId } from "./constants";

export const getTitleByCategory = (cat: CategoryId) =>
    CATEGORY_PRESET.find(c => c.id === cat)?.label ?? "All";
