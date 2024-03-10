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
import {useElementCrud} from '@/survey-designer/_hooks/use-element-crud';
import {
  useDesignerActions,
  useSurveyElements,
} from '@/survey-designer/_store/survey-designer-store';
import {ElementSchemaType} from '@/types/element';
import {ElementEditorProps} from './element-editor';

type FooterProps = Pick<ElementEditorProps, 'onSettingsClick'> & {
  element: ElementSchemaType;
  index: number;
};

export const Footer = ({element, onSettingsClick, index}: FooterProps) => {
  const elements = useSurveyElements();
  const {handleRemoveElement, handleDuplicateElement} = useElementCrud();
  const {updateElement, setElements} = useDesignerActions();

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
    <footer className="mt-auto border-t bg-white px-5 py-2.5">
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
            <div className="mr-auto flex gap-2 sm:ml-auto sm:mr-0 lg:hidden">
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
              onClick={() => onSettingsClick((prev) => !prev)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <div className="space-x-2 border-l pl-4 lg:ml-auto lg:border-l-0 lg:pl-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicateElement(element.id);
                }}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
              <Button
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
