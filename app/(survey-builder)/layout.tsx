import {TopBar} from '@/components/top-bar';
import {LogOut} from '@/features/auth/components/log-out';

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
