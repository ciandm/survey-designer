import {useState} from 'react';
import {arrayMove} from '@dnd-kit/sortable';
import {ScrollArea} from '@radix-ui/react-scroll-area';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  Settings,
  Trash2Icon,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Drawer, DrawerContent} from '@/components/ui/drawer';
import {Label} from '@/components/ui/label';
import {Switch} from '@/components/ui/switch';
import {
  useDesignerStoreActions,
  useDesignerStoreFields,
} from '@/survey-designer/_store/designer-store/designer-store';
import {FieldSchema} from '@/types/field';
import {UseElementControllerReturn} from './designer/use-element-controller';
import {FieldSettings} from './field-settings/field-settings';

type ActionBarProps = {
  field: FieldSchema;
  onSetSelectedElement: UseElementControllerReturn['handleSetSelectedElement'];
};

export const ActionBar = ({field, onSetSelectedElement}: ActionBarProps) => {
  const fields = useDesignerStoreFields();
  const storeActions = useDesignerStoreActions();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleClickMoveDown = () => {
    storeActions.fields.setFields(({_entities, ...rest}) => {
      const index = _entities.indexOf(field.id);
      const newOrder = arrayMove(_entities, index, index + 1);
      return {
        ...rest,
        _entities: newOrder,
      };
    });
  };

  const handleClickMoveUp = () => {
    storeActions.fields.setFields(({_entities, ...rest}) => {
      const index = _entities.indexOf(field.id);
      const newOrder = arrayMove(_entities, index, index - 1);
      return {
        ...rest,
        _entities: newOrder,
      };
    });
  };

  const handleRequiredChange = (required: boolean) => {
    storeActions.fields.updateField(field.id, () => ({
      validations: {
        required,
      },
    }));
  };

  const handleDuplicateField = (duplicateId: string) => {
    const {id = ''} =
      storeActions.fields.duplicateField({id: duplicateId}) ?? {};
    onSetSelectedElement({id});
  };

  const handleRemoveField = (id: string) => {
    const index = fields._entities.indexOf(id);
    const nextId = fields._entities[index + 1] ?? fields._entities[index - 1];
    storeActions.fields.deleteField({id});
    onSetSelectedElement({id: nextId});
  };

  const isFirstElement = fields._entities[0] === field.id;
  const isLastELement = fields._entities[fields._length] === field.id;

  return (
    <div className="sticky p-4">
      <div className="mx-auto block w-full max-w-lg rounded-lg border bg-white px-5 py-1.5 shadow-2xl lg:hidden">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between">
            <div className="mr-4 flex items-center space-x-2">
              <Switch
                id="required"
                checked={field?.validations.required}
                onCheckedChange={handleRequiredChange}
              />
              <Label htmlFor="required">Required</Label>
            </div>
            <div className="flex flex-1 gap-4 text-muted-foreground">
              <div className="mr-auto flex gap-2 sm:ml-auto sm:mr-0">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={
                    Object.keys(fields.data).length === 1 || isFirstElement
                  }
                  onClick={handleClickMoveUp}
                >
                  <span className="sr-only">Move up</span>
                  <ChevronUpIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={
                    Object.keys(fields.data).length === 1 || isLastELement
                  }
                  onClick={handleClickMoveDown}
                >
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                className="flex lg:hidden"
                size="icon"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <div className="space-x-2 border-l pl-4 lg:ml-auto lg:border-l-0 lg:pl-0">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicateField(field?.id ?? '');
                  }}
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
                <Button
                  disabled={Object.keys(fields.data).length === 1}
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveField(field?.id ?? '');
                  }}
                >
                  <Trash2Icon className=" h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        direction="bottom"
        shouldScaleBackground={false}
      >
        <DrawerContent className="flex max-h-[90%] flex-col">
          <ScrollArea className="overflow-y-auto px-4 py-6">
            <div className="mx-auto max-w-lg">
              <FieldSettings field={field} />
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
