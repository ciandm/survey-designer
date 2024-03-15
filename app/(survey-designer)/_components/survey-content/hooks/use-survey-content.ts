import {useState} from 'react';
import {
  useDesignerStoreActions,
  useDesignerStoreFieldsList,
  useDesignerStoreScreens,
} from '@/survey-designer/_store/designer-store';
import {
  StoreScreen,
  StoreScreens,
} from '@/survey-designer/_store/designer-store.types';
import {ElementGroup} from '@/types/element';
import {FieldSchema, FieldType} from '@/types/field';
import {ScreenSchema, ScreenType} from '@/types/screen';
import {getStoreKeyForScreenType} from '@/utils/screen';
import {getIsFieldType, getIsScreenType} from '@/utils/survey';
import {UseDesignerElementReturn} from '../../designer/hooks/use-designer-element';

type UseSurveyContentProps = {
  element: FieldSchema | ScreenSchema | null;
  onSetSelectedElement: UseDesignerElementReturn['handleSetSelectedElement'];
};

export const useSurveyContent = ({
  onSetSelectedElement,
}: UseSurveyContentProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const storeActions = useDesignerStoreActions();
  const fields = useDesignerStoreFieldsList();
  const screens = useDesignerStoreScreens();

  const handleClickOption = (
    group: ElementGroup,
    type: FieldType | ScreenType,
  ) => {
    let id = '';
    if (group === 'Screens' && getIsScreenType(type)) {
      id = storeActions.screens.insertScreen({
        key: getStoreKeyForScreenType(type),
      }).id;
    } else {
      if (getIsFieldType(type)) {
        id = storeActions.fields.insertField({type}).id;
      }
    }
    setIsDialogOpen(false);
    onSetSelectedElement({
      id,
    });
  };

  const handleRemoveScreen = ({key}: {key: 'welcome' | 'thank_you'}) => {
    const id = screens[key].data[screens[key]._entities[0]].id;
    storeActions.screens.deleteScreen({id, key});
    switch (key) {
      case 'welcome':
        onSetSelectedElement({
          id: fields[0].id,
        });
        break;
      case 'thank_you':
        onSetSelectedElement({
          id: fields[fields.length - 1].id,
        });
        break;
    }
  };

  const handleDuplicateField = (duplicateId: string) => {
    const {id = ''} =
      storeActions.fields.duplicateField({id: duplicateId}) ?? {};
    onSetSelectedElement({
      id,
    });
  };

  const handleDeleteField = (removeId: string) => {
    const index = fields.findIndex((el) => el.id === removeId);
    const nextIndex = index === fields.length - 1 ? index - 1 : index + 1;
    storeActions.fields.deleteField({id: removeId});
    onSetSelectedElement({
      id: fields[nextIndex].id,
    });
  };

  const handleSelectScreen = ({key}: {key: keyof StoreScreens}) => {
    const id = screens[key].data[screens[key]._entities[0]].id;
    onSetSelectedElement({
      id,
    });
  };

  const handleSelectField = (id: string) => {
    onSetSelectedElement({
      id,
    });
  };

  return {
    dialog: {
      isOpen: isDialogOpen,
      setIsOpen: setIsDialogOpen,
    },
    handlers: {
      handleClickOption,
      handleRemoveScreen,
      handleDuplicateField,
      handleDeleteField,
      handleSelectScreen,
      handleSelectField,
    },
  };
};
