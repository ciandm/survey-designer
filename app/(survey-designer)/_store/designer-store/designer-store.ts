import {useMemo} from 'react';
import {omitBy} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {createStore, StoreApi, useStore} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {FieldSchema} from '@/types/field';
import {ScreenSchema} from '@/types/screen';
import {SurveyWithParsedModelType} from '@/types/survey';
import {createContext} from '@/utils/context';
import {buildNewFieldHelper, buildNewScreenHelper} from '@/utils/survey';
import {SurveyDesignerStoreState} from './designer-store.types';
import {buildInitialState, fieldsObjectToList} from './designer-store.utils';

export const createDesignerStore = (
  initProps: Partial<SurveyWithParsedModelType> = {},
) => {
  const initialState = buildInitialState(initProps);

  return createStore<SurveyDesignerStoreState>()(
    immer((set) => ({
      ...initialState,
      actions: {
        survey: {
          updateTitle: (title) => {
            set((state) => {
              state.survey.title = title;
            });
          },
          updateDescription: (description) => {
            set((state) => {
              state.survey.description = description;
            });
          },
          setPublished: (isPublished) => {
            set((state) => {
              state.survey.isPublished = isPublished;
            });
          },
        },
        fields: {
          insertField: (field, index = -1) => {
            const newField = buildNewFieldHelper(field.type ?? 'short_text', {
              ...field,
            });

            set((state) => {
              if (index > -1) {
                state.elements.fields.data[newField.id] = newField;
                state.elements.fields._entities.splice(index, 0, newField.id);
              } else {
                state.elements.fields.data[newField.id] = newField;
                state.elements.fields._entities.push(newField.id);
              }

              state.elements.fields._length += 1;
            });

            return newField;
          },
          deleteField: ({id: removeId}) => {
            let next = '';
            set((state) => {
              const fieldToDelete = state.elements.fields.data[removeId];
              if (!fieldToDelete) return;

              delete state.elements.fields.data[removeId];
              state.elements.fields._entities =
                state.elements.fields._entities.filter((id) => id !== removeId);
            });
            return {next};
          },
          duplicateField: ({id: duplicateId}) => {
            let newField: FieldSchema | null = null;

            set((state) => {
              const {id, ...fieldToDuplicate} =
                state.elements.fields.data[duplicateId];
              const indexOfFieldToDuplicate =
                state.elements.fields._entities.indexOf(duplicateId);

              newField = buildNewFieldHelper(fieldToDuplicate.type, {
                ...fieldToDuplicate,
                text: fieldToDuplicate.text
                  ? `${fieldToDuplicate.text} (copy)`
                  : '',
              });

              state.elements.fields.data[newField.id] = newField;
              state.elements.fields._entities.splice(
                indexOfFieldToDuplicate + 1,
                0,
                newField.id,
              );

              state.elements.fields._length += 1;
            });
            return newField;
          },
          updateField: (id, field) => {
            let newField: FieldSchema | null = null;
            set((state) => {
              const fieldToUpdate = state.elements.fields.data[id];
              if (!fieldToUpdate) return;

              const passedField =
                typeof field === 'function' ? field(fieldToUpdate) : field;

              newField = {
                ...fieldToUpdate,
                ...passedField,
                properties: omitBy(
                  {
                    ...fieldToUpdate.properties,
                    ...passedField.properties,
                  },
                  (v) => v === null,
                ),
                validations: omitBy(
                  {
                    ...fieldToUpdate.validations,
                    ...passedField.validations,
                  },
                  (v) => v === null,
                ),
              };

              state.elements.fields.data[id] = newField;
            });

            return newField;
          },
          changeFieldType: ({id, type}) => {
            let newField: FieldSchema | null = null;
            set((state) => {
              const field = state.elements.fields.data[id];
              newField = buildNewFieldHelper(type, field);

              state.elements.fields.data[id] = newField;
            });

            return newField;
          },
          setFields: (fieldsOrFieldsFn) => {
            set((state) => {
              if (typeof fieldsOrFieldsFn === 'function') {
                state.elements.fields = fieldsOrFieldsFn(state.elements.fields);
                return;
              }

              state.elements.fields = fieldsOrFieldsFn;
            });
          },
        },
        choices: {
          insertChoice: (fieldId) => {
            set((state) => {
              const field = state.elements.fields.data[fieldId];
              if (!field) return;

              if (!field.properties.choices) return;

              field.properties.choices.push({
                id: uuidv4(),
                value: '',
              });
            });
          },
          updateChoice: (fieldId, choiceId, {value}) => {
            set((state) => {
              const choices =
                state.elements.fields.data[fieldId].properties.choices;

              if (!choices) return;

              const indexOfChoiceToUpdate = choices.findIndex(
                (c) => c.id === choiceId,
              );

              if (indexOfChoiceToUpdate === -1) return;

              choices[indexOfChoiceToUpdate] = {
                ...choices[indexOfChoiceToUpdate],
                value,
              };
            });
          },
          moveChoices: (fieldId, {newChoices}) => {
            set((state) => {
              const field = state.elements.fields.data[fieldId];
              if (!field) return;

              field.properties.choices = newChoices;
            });
          },
          deleteChoice: (fieldId, {choiceId}) => {
            set((state) => {
              const choices =
                state.elements.fields.data[fieldId].properties.choices;

              if (!choices) return;

              const indexOfChoiceToDelete = choices.findIndex(
                (c) => c.id === choiceId,
              );

              if (indexOfChoiceToDelete === -1) return;

              choices.splice(indexOfChoiceToDelete, 1);
            });
          },
          deleteChoices: (fieldId) => {
            set((state) => {
              const field = state.elements.fields.data[fieldId];
              if (!field) return;

              if (!field.properties.choices) return;

              field.properties.choices = [];
            });
          },
          duplicateChoice: (fieldId, {choiceId}) => {
            set((state) => {
              const field = state.elements.fields.data[fieldId];
              if (!field) return;

              if (!field.properties.choices) return;

              const choice = field.properties.choices.find(
                (c) => c.id === choiceId,
              );
              if (!choice) return;

              const index = field.properties.choices.indexOf(choice);

              field.properties.choices.splice(index, 0, {
                id: uuidv4(),
                value: `${choice.value} (copy)`,
              });
            });
          },
        },
        screens: {
          updateScreen: ({id, key}, screen) => {
            set((state) => {
              const screenToUpdate = state.elements.screens[key].data[id];
              if (!screenToUpdate) return;

              const passedScreen =
                typeof screen === 'function' ? screen(screenToUpdate) : screen;

              const newScreen: ScreenSchema = {
                ...screenToUpdate,
                ...passedScreen,
              };

              state.elements.screens[key].data[id] = newScreen;
            });
          },
          insertScreen: ({key}) => {
            const screen =
              key === 'welcome' ? 'welcome_screen' : 'thank_you_screen';
            let newScreen = buildNewScreenHelper(screen);
            set((state) => {
              state.elements.screens[key].data[newScreen.id] = newScreen;
              state.elements.screens[key]._entities.push(newScreen.id);
              state.elements.screens[key]._length += 1;
            });
            return newScreen;
          },
          deleteScreen: ({key, id}) => {
            set((state) => {
              delete state.elements.screens[key].data[id];
              state.elements.screens[key]._entities = state.elements.screens[
                key
              ]._entities.filter((i) => i !== id);
            });
          },
        },
      },
    })),
  );
};

export const useDesignerStoreSurvey = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.survey);
};

export const useDesignerStoreElements = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.elements);
};

export const useDesignerStoreFields = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.elements.fields);
};

export const useDesignerStoreFieldsList = () => {
  const fields = useDesignerStoreFields();

  return useMemo(() => fieldsObjectToList(fields), [fields]);
};

export const useDesignerStoreIsPublished = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.survey.isPublished);
};

export const useDesignerStoreScreens = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.elements.screens);
};

export const useDesignerStoreSurveyId = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.survey.id);
};

export const useDesignerStoreActions = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.actions);
};

const [SurveyDesignerStoreProvider, useDesignerContext] =
  createContext<StoreApi<SurveyDesignerStoreState>>();

export {SurveyDesignerStoreProvider};
