import {useState} from 'react';
import {SwitchProps} from '@radix-ui/react-switch';
import {Label} from '@/components/ui/label';
import {Switch} from '@/components/ui/switch';
import {QuestionSchema} from '@/lib/validations/survey';

type PropertySettingKey = Exclude<
  keyof QuestionSchema['properties'],
  'choices'
>;

type ValidationSettingKey = keyof QuestionSchema['validations'];

interface Props extends Omit<SwitchProps, 'children'> {
  setting: PropertySettingKey | ValidationSettingKey;
  label: string;
  children?: (isChecked: boolean) => React.ReactNode;
}

export const SwitchSetting = ({
  setting,
  children,
  label,
  defaultChecked = false,
  onCheckedChange,
  ...rest
}: Props) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  return (
    <>
      <div
        className="flex flex-row items-center justify-between gap-4"
        key={setting}
      >
        <div className="space-y-0.5">
          <Label htmlFor={setting} className="text-sm font-normal">
            {label}
          </Label>
        </div>
        <Switch
          onCheckedChange={(checked) => {
            setIsChecked(checked);
            onCheckedChange?.(checked);
          }}
          id={setting}
          defaultChecked={defaultChecked}
          {...rest}
        />
      </div>
      {children?.(isChecked)}
    </>
  );
};

// export const SwitchSettingWithInput = () => {
//   const [isOpen, setIsOpen] = useState(defaultIsOpen);

//     const onCheckedChange = (checked: boolean) => {
//       setIsOpen(checked);
//       onCheckedChangeProp?.(checked);
//     };

//     return (
//       <>
//         <SwitchSetting
//           setting={setting}
//           key={setting}
//           id={setting}
//           checked={isOpen}
//           onCheckedChange={onCheckedChange}
//         />
//         {isOpen && (
//           <div className="flex w-full flex-row items-center gap-4">
//             <Input
//               type="number"
//               className="w-full rounded-md border px-2 py-1 text-sm"
//               {...rest}
//             />
//           </div>
//         )}
//       </>
//     );
//   };
// }
