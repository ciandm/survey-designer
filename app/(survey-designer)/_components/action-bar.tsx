import {arrayMove} from '@dnd-kit/sortable';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  Settings,
  Trash2Icon,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Switch} from '@/components/ui/switch';
import {
  useSurveyFields,
  useSurveyStoreActions,
} from '@/survey-designer/_store/survey-designer-store';
import {FieldSchema} from '@/types/field';
import {UseDesignerReturn} from './designer/use-designer';

type ActionBarProps = {
  field: FieldSchema;
} & Pick<
  UseDesignerReturn['handlers'],
  'handleRemoveElement' | 'handleDuplicateElement' | 'handleSettingsClick'
>;

export const ActionBar = ({
  field,
  handleDuplicateElement,
  handleRemoveElement,
  handleSettingsClick,
}: ActionBarProps) => {
  const fields = useSurveyFields();
  const {updateField, setFields} = useSurveyStoreActions();

  const index = fields.findIndex((el) => el.id === field?.id);

  const handleClickMoveDown = () => {
    setFields((fields) => arrayMove(fields, index, index + 1));
  };

  const handleClickMoveUp = () => {
    setFields((fields) => arrayMove(fields, index, index - 1));
  };

  const isFirstElement =
    fields.length === 1 ? true : fields[0].id === field?.id;
  const isLastELement = fields.length === index + 1;

  return (
    <div className="sticky bottom-8 mx-auto mt-auto block max-w-md rounded-lg border bg-white px-5 py-1.5 shadow-2xl lg:hidden">
      <div className="flex">
        <div className="flex flex-1 items-center justify-between">
          <div className="mr-4 hidden items-center space-x-2 sm:flex">
            <Switch
              id="required"
              checked={field?.validations.required}
              onCheckedChange={(checked) =>
                updateField({
                  id: field?.id,
                  validations: {
                    required: checked,
                  },
                })
              }
            />
            <Label htmlFor="required">Required</Label>
          </div>
          <div className="flex flex-1 gap-4 text-muted-foreground">
            <div className="mr-auto flex gap-2 sm:ml-auto sm:mr-0">
              <Button
                variant="ghost"
                size="icon"
                disabled={fields.length === 1 || isLastELement}
                onClick={handleClickMoveDown}
              >
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={fields.length === 1 || isFirstElement}
                onClick={handleClickMoveUp}
              >
                <span className="sr-only">Move up</span>
                <ChevronUpIcon className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              className="flex lg:hidden"
              size="icon"
              onClick={handleSettingsClick}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <div className="space-x-2 border-l pl-4 lg:ml-auto lg:border-l-0 lg:pl-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicateElement(field?.id ?? '');
                }}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
              <Button
                disabled={fields.length === 1}
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveElement(field?.id ?? '');
                }}
              >
                <Trash2Icon className=" h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const useActionBar = () => {
  const storeActions = useSurveyStoreActions();

  const handleRequiredChange = (id: string, required: boolean) => {
    storeActions.updateField({
      id,
      validations: {
        required,
      },
    });
  };
};
