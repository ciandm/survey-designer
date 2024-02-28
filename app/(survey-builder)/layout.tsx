import {TopBar} from '@/components/top-bar';
import {SignOutButton} from '@/features/auth/components/sign-out-button';

export default function SurveyBuilderLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <>
      <TopBar>
        <SignOutButton />
      </TopBar>
      {children}
    </>
  );
}
