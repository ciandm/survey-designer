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
  useSurveyElements,
  useSurveyStoreActions,
} from '@/survey-designer/_store/survey-designer-store';
import {ElementSchema} from '@/types/element';
import {useDesignerHandlers} from '../designer/designer.context';

type ActionBarProps = {
  element: ElementSchema;
};

export const ActionBar = ({element}: ActionBarProps) => {
  const elements = useSurveyElements();
  const {handleRemoveElement, handleDuplicateElement, handleSettingsClick} =
    useDesignerHandlers();
  const {updateElement, setElements} = useSurveyStoreActions();

  const index = elements.findIndex((el) => el.id === element.id);

  const handleClickMoveDown = () => {
    setElements((elements) => arrayMove(elements, index, index + 1));
  };

  const handleClickMoveUp = () => {
    setElements((elements) => arrayMove(elements, index, index - 1));
  };

  const isFirstElement =
    elements.length === 1 ? true : elements[0].id === element.id;
  const isLastELement = elements.length === index + 1;

  return (
    <footer className="sticky bottom-8 mx-auto mt-auto w-full max-w-md rounded-lg border bg-white px-5 py-1.5 shadow-2xl">
      <div className="flex">
        <div className="flex flex-1 items-center justify-between">
          <div className="hidden items-center space-x-2 sm:flex">
            <Switch
              id="required"
              checked={element.validations.required}
              onCheckedChange={(checked) =>
                updateElement({
                  id: element.id,
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
                disabled={elements.length === 1 || isLastELement}
                onClick={handleClickMoveDown}
              >
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={elements.length === 1 || isFirstElement}
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
                  handleDuplicateElement(element.id);
                }}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
              <Button
                disabled={elements.length === 1}
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveElement(element.id);
                }}
              >
                <Trash2Icon className=" h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
