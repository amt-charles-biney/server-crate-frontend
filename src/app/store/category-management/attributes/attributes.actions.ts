import { createAction, props } from "@ngrx/store";
import { BulkAttribute, StoreVariant, UploadResponse } from "../../../types";

export const uploadImage = createAction('[upload] upload image', props<{ form: FormData, id: string }>())

export const gotImage = createAction('[upload] got image url', props<{ url: string, id: string }>())

export const addAttributeToStore = createAction('[attribute] adding attribute to store', props<StoreVariant>())

export const addAttribute = createAction('[attribute] sending attribute to server', props<BulkAttribute>())

export const updateAttributesInStore = createAction('[attribute] update attribute', props<{ attributes: StoreVariant[]}>())
