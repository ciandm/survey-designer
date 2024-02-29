import {LogOut} from '@/app/(auth)/_components/log-out';
import {TopBar} from '@/components/top-bar';

export default function SurveyBuilderLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <>
      <TopBar>
        <LogOut />
      </TopBar>
      {children}
    </>
  );
}
