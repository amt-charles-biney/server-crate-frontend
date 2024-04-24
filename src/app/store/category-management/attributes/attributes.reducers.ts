import { createFeature, createReducer, on } from '@ngrx/store';
import { Attribute, StoreVariant } from '../../../types';
import {
  addAttributeToStore,
  deleteAll,
  deleteMultipleAttributes,
  gotAttributes,
  gotImage,
  putBackAttributeOptionInStore,
  resetAttributeCreation,
  updateAttributesInStore,
} from './attributes.actions';
type AttributeCreation = {
  attributeImages: Map<string, string | null>;
  attributes: StoreVariant[];
};

const initialState: AttributeCreation = {
  attributeImages: new Map(),
  attributes: [],
};

export const attributeCreationFeature = createFeature({
  name: 'attributeCreation',
  reducer: createReducer(
    initialState,
    on(gotImage, (state, { url, id }) => {
      const newImageMap: Map<string, string | null> = new Map([
        ...Array.from(state.attributeImages.entries()),
        [id, url],
      ]);
      return {
        ...state,
        attributeImages: newImageMap,
      };
    }),
    on(addAttributeToStore, (state, props) => {
      const newAttribute: StoreVariant = {
        ...props,
      };
      const newImageMap: Map<string, string | null> = new Map([
        ...Array.from(state.attributeImages.entries()),
        [newAttribute.id, newAttribute.media],
      ]);

      return {
        ...state,
        attributes: [...state.attributes, newAttribute],
        attributeImages: newImageMap,
      };
    }),
    on(updateAttributesInStore, (state, props) => {
      const newState = props.attributes.map((attr) => {
        return {
          ...attr,
          media: state.attributeImages.get(attr.id)!,
          incompatibleAttributeOptions: attr.incompatibleAttributeOptions
            ? attr.incompatibleAttributeOptions
            : [],
        };
      });
      return {
        ...state,
        attributes: newState,
      };
    }),
    on(resetAttributeCreation, () => {
      return {
        attributeImages: new Map(),
        attributes: [],
      };
    })
  ),
});

const initialAttributes: Attribute[] = [];
export const attributesFeature = createFeature({
  name: 'attributes',
  reducer: createReducer(
    initialAttributes,
    on(gotAttributes, (_, { attributes }) => {
      return attributes;
    }),
    on(deleteMultipleAttributes, (state, { deleteList }) => {
      const newState = state.filter(
        (attribute) => !deleteList.includes(attribute.id)
      );
      return newState;
    }),
    on(deleteAll, () => {
      return [];
    }),
    on(putBackAttributeOptionInStore, (state, props) => {
      const newState = state.map((attribute) => {
        if (attribute.id === props.attribute.id) {
          const newAttributeOptions = [...attribute.attributeOptions, props];
          const newAttribute: Attribute = {
            ...attribute,
            attributeOptions: newAttributeOptions,
          };
          return newAttribute;
        }
        return attribute;
      });
      return newState;
    })
  ),
});

export const { selectAttributes, selectAttributeImages } =
  attributeCreationFeature;
export const { selectAttributesState } = attributesFeature;
